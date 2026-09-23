import importlib

from sqlalchemy import create_engine, inspect


upgrade = importlib.import_module("app.db.migrations.001_init").upgrade


def test_TASK_BKG_01_creates_required_schema_without_national_id():
    engine = create_engine("sqlite:///:memory:")

    upgrade(engine)

    inspector = inspect(engine)
    assert set(inspector.get_table_names()) == {"slots", "bookings", "audit_logs"}
    assert {column["name"] for column in inspector.get_columns("bookings")} == {
        "id",
        "hn",
        "slot_id",
        "booking_date",
        "queue_no",
        "status",
        "created_at",
    }
    assert {column["name"] for column in inspector.get_columns("audit_logs")} >= {
        "actor_id",
        "accessed_at",
        "hn",
    }