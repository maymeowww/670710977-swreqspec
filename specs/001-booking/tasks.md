# Tasks: จองคิวตรวจสุขภาพ (Booking)

อ้างอิง `spec.md` SPEC-BKG-001 Draft v2 และ `plan.md` ทุกงานเป็นงานวิเคราะห์ ออกแบบ ทดสอบ หรือ implement ตามข้อกำหนดใน spec เท่านั้น ยังไม่รวมงานนอก Scope

สถานะที่ใช้: `Todo` = ยังไม่เริ่ม, `Blocked: รอ Q-02` = ห้ามตัดสินใจหรือทำต่อจนกว่าจะได้คำตอบจากเจ้าหน้าที่เวชระเบียน

## ลำดับงาน

| ID | งาน | อ้างอิง | สถานะ |
|---|---|---|---|
| TASK-BKG-01 | สร้าง schema และ migration สำหรับ `slots`, `bookings` และ `audit_logs` บน PostgreSQL โดย bookings เก็บเฉพาะ HN และไม่เก็บเลขบัตรประชาชน | CON-TECH-01, IF-HIS-01, DOM-PDPA-01, FR-BKG-04 | Todo |
| TASK-BKG-02 | กำหนดการตรวจผลยืนยันตัวตนก่อนเข้าถึง endpoint ของฟีเจอร์ และปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตน | IF-IDP-01, FR-BKG-01, FR-BKG-02, FR-BKG-04 | Todo |
| TASK-BKG-03 | ทำ API ค้นหาช่วงเวลาว่างภายใน 30 วัน พร้อมแพ็กเกจ ที่นั่งคงเหลือ และการคำนวณใหม่เมื่อเปลี่ยนแพ็กเกจ | FR-BKG-01, FR-BKG-06 | Todo |
| TASK-BKG-04 | ทำหน้าจอเลือกแพ็กเกจและช่วงเวลาให้โหลดข้อมูลใหม่ตามแพ็กเกจที่เลือก และแสดงที่นั่งคงเหลือ | FR-BKG-01, FR-BKG-06 | Todo |
| TASK-BKG-05 | ทำการยืนยันการจองแบบ transaction ป้องกันการตัดที่นั่งเกินจำนวน บันทึก booking และส่งผลการจองกลับ | FR-BKG-04, AC-BKG-01 | Todo |
| TASK-BKG-06 | ปฏิเสธการจองซ้ำเมื่อผู้รับบริการมีคิวที่ยังไม่ได้ใช้ในวันเดียวกัน พร้อมส่งหมายเลขคิวเดิมกลับ | FR-BKG-02, AC-BKG-02 | Todo |
| TASK-BKG-07 | เมื่อช่วงเวลาเต็มระหว่างยืนยัน ให้ตอบสถานะที่เหมาะสม พร้อมช่วงเวลาว่าง 3 ตัวเลือกที่ใกล้ที่สุดในวันเดียวกันและวันถัดไป โดยไม่สร้าง booking | FR-BKG-03, AC-BKG-03 | Todo |
| TASK-BKG-08 | วางคำขอส่งข้อความยืนยันลงคิวแบบ asynchronous โดยไม่รอผลการส่ง และกำหนดการส่งซ้ำตาม ASM-03 ภายใน 5 นาที สูงสุด 3 ครั้ง | FR-BKG-05, IF-NOT-01, NFR-REL-02, AC-BKG-04 | Todo |
| TASK-BKG-09 | บันทึก audit log ทุกครั้งที่เข้าถึงข้อมูลการจอง โดยเก็บผู้เข้าถึง เวลา และ HN และรองรับการเก็บรักษาไม่น้อยกว่า 1 ปี | DOM-PDPA-01, AC-BKG-06 | Todo |
| TASK-BKG-10 | ทำ endpoint ค้นหา HN จาก HIS ด้วยเลขบัตรประชาชน โดยส่งต่อเลขบัตรไปยัง HIS และไม่บันทึกเลขบัตรในระบบการจอง | IF-HIS-01, FR-BKG-04 | Todo |
| TASK-BKG-11 | กำหนดวิธีออกหมายเลขคิวและแสดงหมายเลขคิวในผลการจอง | FR-BKG-04, AC-BKG-01, AC-BKG-04, Q-02 | Blocked: รอ Q-02 |
| TASK-BKG-12 | ทำหน้าจอยืนยันการจองและหน้าผลลัพธ์ให้แสดงหมายเลขคิว รวมถึงกรณีส่งข้อความไม่สำเร็จที่ยังต้องแสดงหมายเลขคิว | FR-BKG-04, FR-BKG-05, AC-BKG-01, AC-BKG-04 | Todo |
| TASK-BKG-13 | ทำหน้าจอแจ้ง "ช่วงเวลาเต็ม" และแสดงตัวเลือกช่วงเวลาใกล้เคียง 3 ตัวเลือกจากผลตอบกลับของ API | FR-BKG-03, AC-BKG-03 | Todo |
| TASK-BKG-14 | เชื่อมหน้าจอเข้ากับ API ตามสัญญา `GET /slots`, `POST /bookings` และ `GET /bookings/{id}` | FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05 | Todo |
| TASK-BKG-15 | ตรวจการตอบสนองการค้นหาช่วงเวลาว่างที่ผู้ใช้พร้อมกัน 200 คน และยืนยัน p95 ไม่เกิน 2 วินาที | FR-BKG-01, NFR-PERF-01, AC-BKG-05 | Todo |
| TASK-BKG-16 | ตรวจว่าการรับส่งข้อมูลการจองใช้ TLS 1.2 ขึ้นไป | FR-BKG-04, NFR-SEC-01 | Todo |
| TASK-BKG-17 | ทดสอบ usability กับผู้ใช้ใหม่ 10 คน และตรวจว่าอย่างน้อย 8 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ | FR-BKG-04, NFR-USE-01 | Todo |

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