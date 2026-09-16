# Plan for Feature: จองคิวตรวจสุขภาพ (Booking)

## 1. สรุปแนวทาง
- ฟีเจอร์นี้อนุญาตให้ผู้รับบริการที่ยืนยันตัวตนแล้วเลือกแพ็กเกจ วัน และช่วงเวลาตรวจสุขภาพ
- ผู้ใช้จะเห็นช่วงเวลาว่างภายใน 30 วันข้างหน้า พร้อมจำนวนที่นั่งคงเหลือ
- เมื่อยืนยัน จะบันทึกการจอง ตัดจำนวนที่นั่ง และออกหมายเลขคิวให้ผู้ใช้
- การส่งข้อความยืนยันทำแบบ asynchronous (enqueue) เพื่อไม่ให้การจองรอผลการส่ง
- แนวทางการสร้าง: backend จัดการ business logic และ concurrency สำหรับการจอง, frontend แสดงรายการช่วงเวลาและ flow ยืนยัน

## 2. เทคโนโลยีที่ใช้
สิ่งที่เลือก | มาจาก | หมายเหตุ
---|---|---
Database: MySQL | CON-TECH-01 | ใช้เป็น datastore หลัก
Backend: Python + FastAPI | ทีมเลือกเอง (ไม่ได้มาจาก spec) | ให้บริการ REST API
Frontend: React (Vite) | ทีมเลือกเอง (ไม่ได้มาจาก spec) | SPA สำหรับ UI จอง
Notification broker / queue: Redis หรือ SQS | IF-NOT-01 | ใช้สำหรับเก็บคิวส่งข้อความแบบ asynchronous
IDP integration (OIDC) | IF-IDP-01 | รับข้อมูลยืนยันตัวตนจาก IDP
HIS lookup service | IF-HIS-01 | เรียก HIS ด้วยเลขบัตรประชาชนเพื่อรับ HN
TLS 1.2+ (transport security) | NFR-SEC-01 | ใช้ TLS ในทุก endpoint

## 3. โมเดลข้อมูล (entities)
- TimeSlot
  - id, date, start_time, end_time, capacity, remaining, package_id
  - รองรับ: FR-BKG-01, FR-BKG-06
- Package
  - id, name, duration_minutes, required_capacity
  - รองรับ: FR-BKG-06
- Booking
  - id, hn, timeslot_id, package_id, queue_number, status (confirmed/pending/failed), created_at
  - ป้องกัน: ไม่เก็บ national_id ตาม IF-HIS-01
  - รองรับ: FR-BKG-02, FR-BKG-04, FR-BKG-05
- NotificationQueue
  - id, booking_id, provider (SMS/LINE), payload, status, next_retry_at, attempts
  - รองรับ: FR-BKG-05, NFR-REL-02
- AuditLog
  - id, actor, action, target_booking_id, timestamp, hn
  - รองรับ: DOM-PDPA-01, AC-BKG-06

## 4. API / หน้าจอ (method path) — ไฟล์/endpoint หลัก
- GET /api/timeslots?start={date}&days=30
  - input: start date
  - output: list of TimeSlot (date, start_time, end_time, remaining)
  - รองรับ: FR-BKG-01, FR-BKG-06, AC-BKG-05
- POST /api/bookings
  - input: hn, timeslot_id, package_id
  - output: booking id, queue_number, status
  - พฤติกรรม: สร้าง booking แบบ transaction-safe, ตัด remaining, สร้าง NotificationQueue entry
  - รองรับ: FR-BKG-04, FR-BKG-03, AC-BKG-01, AC-BKG-03
- GET /api/bookings?hn={hn}&date={date}
  - input: hn, date
  - output: list of bookings (เพื่อเช็ก FR-BKG-02)
  - รองรับ: FR-BKG-02, AC-BKG-02
- GET /api/bookings/{id}
  - input: booking id
  - output: booking details
  - รองรับ: AC-BKG-01, AC-BKG-04
- POST /internal/notifications/process (worker)
  - input: (internal) consume NotificationQueue and call external notifier
  - รองรับ: FR-BKG-05, NFR-REL-02

## 5. ตารางตรวจ Constraints
Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ
---|---|---
CON-TECH-01 | Database: MySQL, schema ของ Booking/TimeSlot | ใช้แล้ว
DOM-PDPA-01 | AuditLog เก็บการเข้าถึงการจอง (actor, time, hn) | ใช้แล้ว
IF-IDP-01 | Authentication flow: รับข้อมูลยืนยันตัวตนก่อนเข้าถึง API | ใช้แล้ว
IF-HIS-01 | Lookup HN จาก HIS ก่อนสร้าง booking; ไม่เก็บ national_id | ใช้แล้ว
IF-NOT-01 | NotificationQueue + worker สำหรับส่ง SMS/LINE แบบ asynchronous | ใช้แล้ว

## 6. แผนทดสอบจาก Acceptance Criteria
AC ID | ชื่อ test | ทดสอบอย่างไร
---|---|---
AC-BKG-01 | test_AC_BKG_01_booking_success_and_decrement | Given: timeslot 09:00 มี remaining=1, auth user → POST /api/bookings → Expect: 201, queue_number returned, TimeSlot.remaining == 0
AC-BKG-02 | test_AC_BKG_02_reject_if_existing_booking_same_day | Given: user มี booking ในวันเดียวกัน → POST /api/bookings → Expect: 409 หรือ 400 พร้อมหมายเลขคิวเดิม
AC-BKG-03 | test_AC_BKG_03_timeslot_full_show_alternatives | Simulate concurrent confirmation where remaining goes to 0 by another user → POST /api/bookings → Expect: response แจ้ง "ช่วงเวลาเต็ม" และส่งรายการตัวเลือก 3 ตัว (ไม่มี booking created)
AC-BKG-04 | test_AC_BKG_04_persist_when_notification_fails | Mock notifier down → POST /api/bookings → Expect: booking persisted, queue entry created with next_retry_at within 5 minutes
AC-BKG-05 | test_AC_BKG_05_timeslot_search_perf | Simulate 200 concurrent users calling GET /api/timeslots and measure p95 <= 2s (requires performance env)
AC-BKG-06 | test_AC_BKG_06_audit_log_exists | Access booking details → verify AuditLog record exists with actor, time, hn

## 7. ลำดับงาน (5–10 ขั้น)
1. ออกแบบ schema สำหรับ TimeSlot, Booking, NotificationQueue, AuditLog (รองรับ FR-BKG-01..05) — FR-BKG-01, FR-BKG-04
2. ติดตั้ง DB และ migrations (MySQL) — CON-TECH-01
3. พัฒนา endpoint GET /api/timeslots และ query performance optimizations (indexing, caching) — FR-BKG-01, AC-BKG-05
4. พัฒนา POST /api/bookings พร้อม transaction/locking เพื่อรองรับ concurrency และ log audit — FR-BKG-04, FR-BKG-03, AC-BKG-01/03
5. พัฒนา worker สำหรับ NotificationQueue และ retry policy — FR-BKG-05, NFR-REL-02
6. พัฒนา frontend pages สำหรับแสดง timeslots และ flow ยืนยันการจอง — NFR-USE-01, FR-BKG-01..04
7. ทำ automated tests ตาม ACs และ performance test สำหรับ AC-BKG-05
8. UAT กับพยาบาลคัดกรองและเจ้าหน้าที่เวชระเบียนเพื่อยืนยัน behaviors (โควตา, queue numbering)

## 8. สิ่งที่ยังไม่ทำ (Open Questions)
- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง? — ส่วนที่เกี่ยวข้องกับข้อนี้จะยังไม่สร้างจนกว่าจะได้คำตอบ (ต้องถาม: เจ้าหน้าที่เวชระเบียน)



