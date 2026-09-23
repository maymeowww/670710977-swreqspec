# Tasks: จองคิวตรวจสุขภาพ (Booking)

อ้างอิง `spec.md` SPEC-BKG-001 Draft v2 และ `plan.md` ทุกงานเป็นงานวิเคราะห์ ออกแบบ ทดสอบ หรือ implement ตามข้อกำหนดใน spec เท่านั้น ยังไม่รวมงานนอก Scope

สถานะที่ใช้: `พร้อมทำ` = ตรวจเงื่อนไขแล้วและเริ่มได้, `Todo` = ยังไม่เริ่ม, `เสร็จ รอทีมตรวจ` = ทำเสร็จแล้วรอทีมตรวจ, `Blocked: รอ Q-02` = ห้ามตัดสินใจหรือทำต่อจนกว่าจะได้คำตอบจากเจ้าหน้าที่เวชระเบียน

## ลำดับงาน

| ID | งาน | ต้องทำหลัง | ไฟล์ที่แตะ | เสร็จเมื่อ | อ้างอิง | สถานะ |
|---|---|---|---|---|---|---|
| TASK-BKG-01 | สร้าง schema และ migration สำหรับ `slots`, `bookings` และ `audit_logs` บน PostgreSQL โดย bookings เก็บเฉพาะ HN และไม่เก็บเลขบัตรประชาชน | ไม่มี | `backend/app/db/models.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/test_TASK_BKG_01.py` | สร้าง 3 ตารางได้, `bookings` ไม่มี `national_id`, `audit_logs` มีผู้เข้าถึง เวลา และ HN, และ test ผ่าน | CON-TECH-01, IF-HIS-01, DOM-PDPA-01, FR-BKG-04 | เสร็จ รอทีมตรวจ |
| TASK-BKG-02 | กำหนดการตรวจผลยืนยันตัวตนก่อนเข้าถึง endpoint ของฟีเจอร์ และปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตน | TASK-BKG-01 | `backend/app/auth/idp.py`, `backend/app/main.py`, `backend/tests/test_TASK_BKG_02.py` | endpoint ของฟีเจอร์ปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตน และ test ผ่าน | IF-IDP-01, FR-BKG-01, FR-BKG-02, FR-BKG-04 | Todo |
| TASK-BKG-03 | ทำ API ค้นหาช่วงเวลาว่างภายใน 30 วัน พร้อมแพ็กเกจ ที่นั่งคงเหลือ และการคำนวณใหม่เมื่อเปลี่ยนแพ็กเกจ | TASK-BKG-01, TASK-BKG-02 | `backend/app/slots/router.py`, `backend/app/slots/service.py`, `backend/tests/test_TASK_BKG_03.py` | `GET /slots` คืนช่วงเวลาภายใน 30 วันและที่นั่งคงเหลือตามแพ็กเกจ และ test ผ่าน | FR-BKG-01, FR-BKG-06 | Todo |
| TASK-BKG-04 | ทำหน้าจอเลือกแพ็กเกจและช่วงเวลาให้โหลดข้อมูลใหม่ตามแพ็กเกจที่เลือก และแสดงที่นั่งคงเหลือ | ไม่มี | `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/__tests__/TASK-BKG-04.test.jsx` | เปิดแอปแล้วเห็นหน้าจอเลือกแพ็กเกจและวันจริง, เปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่และแสดงที่นั่งคงเหลือ, และ test ผ่าน | FR-BKG-01, FR-BKG-06 | เสร็จ รอทีมตรวจ |
| TASK-BKG-05 | ทำการยืนยันการจองแบบ transaction ป้องกันการตัดที่นั่งเกินจำนวน บันทึก booking และส่งผลการจองกลับ | TASK-BKG-01, TASK-BKG-02 | `backend/app/booking/router.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_01.py` | ยืนยันสำเร็จแล้วบันทึก booking, ลดที่นั่งจาก 1 เหลือ 0 และคืนผลการจอง และ test `test_AC_BKG_01` ผ่าน | FR-BKG-04, AC-BKG-01 | Todo |
| TASK-BKG-06 | ปฏิเสธการจองซ้ำเมื่อผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน พร้อมส่งหมายเลขคิวเดิมกลับ | TASK-BKG-05 | `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_02.py` | การจองซ้ำวันเดียวกันถูกปฏิเสธและคืนหมายเลขคิวเดิม และ test `test_AC_BKG_02` ผ่าน | FR-BKG-02, AC-BKG-02 | Todo |
| TASK-BKG-07 | เมื่อช่วงเวลาเต็มระหว่างยืนยัน ให้ตอบสถานะที่เหมาะสม พร้อมช่วงเวลาว่าง 3 ตัวเลือกที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป โดยไม่สร้าง booking | TASK-BKG-03, TASK-BKG-05 | `backend/app/booking/service.py`, `backend/app/slots/service.py`, `backend/tests/test_AC_BKG_03.py` | คืน 409 พร้อม 3 ช่วงที่ใกล้ที่สุดและไม่สร้าง booking ซ้อน และ test `test_AC_BKG_03` ผ่าน | FR-BKG-03, AC-BKG-03 | Todo |
| TASK-BKG-08 | วางคำขอส่งข้อความยืนยันลงคิวแบบ asynchronous โดยไม่รอผลการส่ง และกำหนดการส่งซ้ำตาม ASM-03 ภายใน 5 นาที สูงสุด 3 ครั้ง | TASK-BKG-05 | `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_04.py` | booking ยังบันทึกเมื่อแจ้งเตือนล้มเหลว และมีงานส่งซ้ำภายใน 5 นาทีตาม ASM-03 และ test `test_AC_BKG_04` ผ่าน | FR-BKG-05, IF-NOT-01, NFR-REL-02, AC-BKG-04 | Todo |
| TASK-BKG-09 | บันทึก audit log ทุกครั้งที่เข้าถึงข้อมูลการจอง โดยเก็บผู้เข้าถึง เวลา และ HN และรองรับการเก็บรักษาไม่น้อยกว่า 1 ปี | TASK-BKG-01, TASK-BKG-02 | `backend/app/audit/middleware.py`, `backend/tests/test_AC_BKG_06.py` | การเข้าถึง booking สร้าง audit log ที่มี actor, เวลา และ HN และ test `test_AC_BKG_06` ผ่าน | DOM-PDPA-01, AC-BKG-06 | Todo |
| TASK-BKG-10 | ทำ endpoint ค้นหา HN จาก HIS ด้วยเลขบัตรประชาชน โดยส่งต่อเลขบัตรไปยัง HIS และไม่บันทึกเลขบัตรในระบบการจอง | TASK-BKG-01, TASK-BKG-02 | `backend/app/his/client.py`, `backend/app/main.py`, `backend/tests/test_TASK_BKG_10.py` | lookup คืน HN จาก HIS และข้อมูลการจองไม่มีเลขบัตรประชาชน และ test ผ่าน | IF-HIS-01, FR-BKG-04 | Todo |
| TASK-BKG-11 | กำหนดวิธีออกหมายเลขคิวและแสดงหมายเลขคิวในผลการจอง | TASK-BKG-05, TASK-BKG-06 | `backend/app/booking/service.py`, `frontend/src/pages/BookingResult.jsx`, `backend/tests/test_TASK_BKG_11.py` | ได้คำตอบ Q-02 ใน spec ก่อนกำหนดวิธีออกหรือแสดงหมายเลขคิว | FR-BKG-04, AC-BKG-01, AC-BKG-04, Q-02 | Blocked: รอ Q-02 |
| TASK-BKG-12 | ทำหน้าจอยืนยันการจองและหน้าผลลัพธ์ให้แสดงหมายเลขคิว รวมถึงกรณีส่งข้อความไม่สำเร็จที่ยังต้องแสดงหมายเลขคิว | TASK-BKG-05, TASK-BKG-08, TASK-BKG-11 | `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/__tests__/AC-BKG-01.test.jsx`, `frontend/src/__tests__/AC-BKG-04.test.jsx` | หน้าจอแสดงผลการจองและหมายเลขคิวแม้ส่งข้อความไม่สำเร็จ และ tests ผ่าน | FR-BKG-04, FR-BKG-05, AC-BKG-01, AC-BKG-04 | Todo |
| TASK-BKG-13 | ทำหน้าจอแจ้ง "ช่วงเวลาเต็ม" และแสดงตัวเลือกช่วงเวลาใกล้เคียง 3 ตัวเลือกจากผลตอบกลับของ API | TASK-BKG-07 | `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx` | เมื่อ API ตอบ 409 หน้าจอแสดง "ช่วงเวลาเต็ม" และ 3 ตัวเลือก และ test `AC-BKG-03` ผ่าน | FR-BKG-03, AC-BKG-03 | Todo |
| TASK-BKG-14 | เชื่อมหน้าจอเข้ากับ API ตามสัญญา `GET /slots`, `POST /bookings` และ `GET /bookings/{id}` | TASK-BKG-03, TASK-BKG-07, TASK-BKG-12, TASK-BKG-13 | `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`, `frontend/src/__tests__/TASK-BKG-14.test.jsx` | หน้าจอเรียก API ทั้ง 3 รายการตามสัญญาและ test ผ่าน | FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05 | Todo |
| TASK-BKG-15 | ตรวจการตอบสนองการค้นหาช่วงเวลาว่างที่ผู้ใช้พร้อมกัน 200 คน และยืนยัน p95 ไม่เกิน 2 วินาที | TASK-BKG-03 | `backend/tests/test_AC_BKG_05.py` | test ผู้ใช้พร้อมกัน 200 คนวัด p95 ได้ไม่เกิน 2 วินาที หรือบันทึกผลการวัดบนเครื่องทดสอบตาม AC | FR-BKG-01, NFR-PERF-01, AC-BKG-05 | Todo |
| TASK-BKG-16 | ตรวจว่าการรับส่งข้อมูลการจองใช้ TLS 1.2 ขึ้นไป | TASK-BKG-05, TASK-BKG-14 | `backend/tests/test_TASK_BKG_16.py` | การทดสอบยืนยันการรับส่งข้อมูลการจองด้วย TLS 1.2 ขึ้นไปผ่าน | FR-BKG-04, NFR-SEC-01 | Todo |
| TASK-BKG-17 | ทดสอบ usability กับผู้ใช้ใหม่ 10 คน และตรวจว่าอย่างน้อย 8 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ | TASK-BKG-12, TASK-BKG-14 | `frontend/tests/usability_TASK_BKG_17.md` | ผู้ใช้ใหม่อย่างน้อย 8 จาก 10 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ และมีผลทดสอบบันทึกไว้ | FR-BKG-04, NFR-USE-01 | Todo |

## Traceability

| รายการใน spec | งานที่ตรวจหรือรองรับ |
|---|---|
| FR-BKG-01 | TASK-BKG-03, TASK-BKG-04, TASK-BKG-14, TASK-BKG-15 |
| FR-BKG-02 | TASK-BKG-02, TASK-BKG-06 |
| FR-BKG-03 | TASK-BKG-07, TASK-BKG-13, TASK-BKG-14 |
| FR-BKG-04 | TASK-BKG-01, TASK-BKG-02, TASK-BKG-05, TASK-BKG-10, TASK-BKG-11, TASK-BKG-12, TASK-BKG-14, TASK-BKG-16, TASK-BKG-17 |
| FR-BKG-05 | TASK-BKG-08, TASK-BKG-12, TASK-BKG-14 |
| FR-BKG-06 | TASK-BKG-03, TASK-BKG-04 |
| AC-BKG-01 | TASK-BKG-05, TASK-BKG-11, TASK-BKG-12 |
| AC-BKG-02 | TASK-BKG-06 |
| AC-BKG-03 | TASK-BKG-07, TASK-BKG-13 |
| AC-BKG-04 | TASK-BKG-08, TASK-BKG-11, TASK-BKG-12 |
| AC-BKG-05 | TASK-BKG-15 |
| AC-BKG-06 | TASK-BKG-09 |
| CON-TECH-01 | TASK-BKG-01 |
| DOM-PDPA-01 | TASK-BKG-01, TASK-BKG-09 |
| IF-IDP-01 | TASK-BKG-02 |
| IF-HIS-01 | TASK-BKG-01, TASK-BKG-10 |
| IF-NOT-01 | TASK-BKG-08 |
| NFR-PERF-01 | TASK-BKG-15 |
| NFR-SEC-01 | TASK-BKG-16 |
| NFR-REL-02 | TASK-BKG-08 |
| NFR-USE-01 | TASK-BKG-17 |

## Open Questions

- `Q-02`: หมายเลขคิวรีเซ็ตรายวันหรือนับต่อเนื่อง และมีรูปแบบอย่างไร ต้องได้คำตอบก่อนทำ `TASK-BKG-11`