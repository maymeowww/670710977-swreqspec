from sqlalchemy.engine import Engine

from app.db.models import Base


def upgrade(engine: Engine) -> None:
    # Supports CON-TECH-01, IF-HIS-01, and DOM-PDPA-01 schema creation.
    Base.metadata.create_all(engine)