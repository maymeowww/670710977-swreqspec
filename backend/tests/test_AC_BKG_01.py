# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from app.db.models import Booking, Slot
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_booking_success(client, make_slot, db):
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then บันทึกสำเร็จ; แสดงหมายเลขคิว; ที่นั่งว่างของช่วงนั้นเป็น 0
    assert res.status_code == 201
    body = res.json()
    assert body["queue_no"] == "A001"
    assert db.get(Slot, slot.id).remaining == 0
    assert db.query(Booking).count() == 1


def test_TC_BKG_01_2_booking_exactly_one_slot(client, make_slot, db):
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่างตรง 1 ที่ (จำนวนขั้นต่ำก่อนการจอง)
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then บันทึกสำเร็จ; แสดงหมายเลขคิว; ที่นั่งว่างของช่วงนั้นเป็น 0
    assert res.status_code == 201
    body = res.json()
    assert body["queue_no"] == "A001"
    assert db.get(Slot, slot.id).remaining == 0
    assert db.query(Booking).count() == 1


def test_TC_BKG_01_3_requires_identity_verification(client, make_slot, db):
    # Given ยังไม่ได้ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When พยายามยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id})

    # Then ปฏิเสธการเข้าถึงและไม่บันทึกการจอง
    assert res.status_code == 401
    assert res.json()["detail"] == "ยังไม่ได้ยืนยันตัวตน"
    assert db.get(Slot, slot.id).remaining == 1
    assert db.query(Booking).count() == 0
