# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08:40 | test: ผ่าน 8 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 (ไม่ตรงเรื่อง) | T-02 | backend/app/slots/router.py: get_slots; backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 | ไม่มีการบังคับกันซ้ำใน backend/app/booking/service.py: create_booking | ไม่มี test | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | ไม่มีการตรวจช่วงเต็ม/เสนอ 3 ตัวเลือกใน backend/app/ | ไม่มี test | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking, next_queue_no; backend/app/booking/router.py: create_booking | backend/tests/test_AC_BKG_01.py::test_AC_BKG_01, test_TC_BKG_01_1_booking_success, test_TC_BKG_01_2_booking_exactly_one_slot, test_TC_BKG_01_3_requires_identity_verification (ผ่าน 4/4) | ครบ |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่มีคิวส่งข้อความ/ส่งซ้ำจริงใน backend/app/ | ไม่มี test | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-10 (ไม่ตรงเรื่อง) | backend/app/slots/router.py: get_slots (filter package_code); backend/app/slots/service.py: list_available_slots | ไม่มี test สำหรับเงื่อนไขเปลี่ยนแพ็กเกจ | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py::test_AC_BKG_05 (ผ่าน) | ครบ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มีการบังคับ TLS หรือการเข้ารหัสสำหรับ payload ใน app/ | ไม่มี test | ยังไม่ถึง |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่มีระบบส่งซ้ำภายใน 5 นาทีใน backend/app/ | ไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มีการวัดเวลาการจองของผู้ใช้ใหม่หรือวิธีทดสอบ 8/10 คน | ไม่มี test | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC | T-01 | backend/app/config.py: DATABASE_URL default เป็น sqlite:///./dev.db; backend/app/db/session.py: create_engine(DATABASE_URL) | backend/tests/test_T01_schema.py::test_T01_tables_created (ผ่าน) แต่ไม่ตรวจ PostgreSQL จริง | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | ไม่มี middleware audit log ใน backend/app/ | ไม่มี test | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC แต่เป็น constraint | T-03 | backend/app/auth/idp.py: get_verified_hn; backend/app/booking/router.py: create_booking | backend/tests/test_AC_BKG_01.py::test_TC_BKG_01_3_requires_identity_verification (ผ่าน) | ครบ |
| IF-HIS-01 | ไม่มี AC | T-09 | backend/app/booking/router.py: BookingRequest.national_id; backend/app/db/models.py: Booking เก็บเฉพาะ hn; ไม่มี lookup HIS | ไม่มี test | ยังไม่ถึง |
| IF-NOT-01 | AC-BKG-04 | T-07 | ไม่มีคิวแจ้งเตือนหรือ retry queue ใน backend/app/ | ไม่มี test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/booking/router.py: POST /bookings | FR-BKG-04, IF-IDP-01 | ใช่บางส่วน | รับ header Authorization และตรวจ get_verified_hn ได้; แต่ยังไม่มีการส่งข้อความยืนยันและไม่มีตัดจำนวนที่นั่งลบจาก capacity ในกรณีเต็ม | 
| backend/app/booking/service.py: create_booking | FR-BKG-04 | ใช่บางส่วน | ลด remaining แต่ไม่มีการตรวจจองซ้ำวันเดียวกัน/ช่วงเต็มแบบครบตามรายละเอียด FR-BKG-02/03 | 
| backend/app/booking/service.py: next_queue_no | Q-02 | ไม่ | ใช้รูปแบบ A001 และรีเซ็ตวันละวันโดยไม่ถามทีม; spec ระบุ Q-02 ยังไม่ได้คำตอบ | 
| backend/app/booking/router.py: DELETE /bookings/{booking_id} | Out of scope | ไม่ | มีฟังก์ชันยกเลิกการจอง แต่ spec ระบุยกเลิก/เลื่อนคิวเป็น Out of scope | 
| backend/app/slots/router.py: GET /slots | FR-BKG-01, FR-BKG-06 | ใช่บางส่วน | คืนวันที่/เวลา/remaining ได้ แต่ FR-BKG-01 ระบุ "ภายใน 30 วันข้างหน้า" และ code ใช้ 14 วันเท่านั้น | 
| backend/app/slots/service.py: list_available_slots | FR-BKG-01, FR-BKG-06 | ใช่บางส่วน | คำนวณ date_from ถึง +14 วัน ไม่ตรง 30 วันตาม spec; ยังไม่มี test สำหรับแพ็กเกจเปลี่ยนวัน/ช่วง | 
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ไม่ | ค่าเริ่มต้นเป็น SQLite แม้ comments ระบุ PostgreSQL ในระบบจริง | 
| backend/app/db/models.py: Booking | IF-HIS-01, DOM-PDPA-01 | ใช่บางส่วน | รักษาเฉพาะ hn ได้ แต่มี field national_id ใน request model และ logger ส่ง national_id ที่อาจเป็นข้อมูลบัตรประชาชน | 
| frontend/src/App.jsx | ไม่ระบุ | ไม่ใช่ requirement actual | หน้าเพียง placeholder ไม่มีหน้าจอของ booking จริง | 

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | FR ไม่มี AC | backend/app/slots/router.py; backend/app/slots/service.py | FR-BKG-01, FR-BKG-06 | FR-BKG-01 และ FR-BKG-06 มี code จริงแต่ไม่มี AC หรือ test ที่ตรวจสิ่งที่โค้ดทำตรงตาม requirement อย่างชัดเจน; spec traceability ก็บอก AC-BKG-05 เป็นเรื่องความเร็ว ไม่ใช่ FR-BKG-01 | เพิ่ม Q-xx / แก้ spec |
| F-002 | เดา Q-xx | backend/app/booking/service.py: next_queue_no | Q-02, FR-BKG-04 | โค้ดกำหนด queue_no เป็น A001 และนับวันละวันแบบไม่ถามทีม แม้ spec ระบุ Q-02 ยังไม่ได้คำตอบ | เพิ่ม Q-xx |
| F-003 | อยู่ใน Out of scope | backend/app/booking/router.py: DELETE /bookings/{booking_id}; backend/app/booking/service.py: cancel_booking | Out of scope | มีฟังก์ชันยกเลิกคิวในโค้ด แม้ spec ระบุยกเลิก / เลื่อนคิว เป็น Out of scope และไม่ได้สั่งให้สร้าง | แก้โค้ด |
| F-004 | ละเมิด Constraint | backend/app/booking/router.py: BookingRequest; backend/app/auth/idp.py | IF-HIS-01, IF-IDP-01 | โค้ดรับ national_id และ log national_id ใน logger แม้ spec ระบุไม่เก็บเลขบัตรประชาชนในตารางการจอง และไม่ควรรับ/เก็บข้อมูลที่ห้าม | แก้โค้ด |
| F-005 | ตัวเลขไม่ตรง spec | backend/app/slots/service.py: list_available_slots | FR-BKG-01 | code ใช้ 14 วันแทน 30 วัน และไม่แสดงเต็มตามวันข้างหน้า 30 วันตาม requirement | แก้โค้ด |
| F-006 | ละเมิด Constraint | backend/app/config.py: DATABASE_URL | CON-TECH-01 | ค่าเริ่มต้นใช้ SQLite ใน dev environment แม้ requirement บังคับใช้ PostgreSQL ตามมาตรฐานฝ่าย IT | แก้โค้ด |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| - | ไม่มีข้อค้นพบที่ยืนยันว่าจะแก้แล้วใน repo ปัจจุบัน | รัน test ทั้งหมดแล้วเห็นยังมีช่องโหว่ตามด้านบน |
