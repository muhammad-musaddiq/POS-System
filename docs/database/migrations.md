# Migrations

Run from the starter root with its virtual environment and dedicated DATABASE_URL:

```bash
alembic upgrade head
alembic current
alembic check
alembic revision --autogenerate -m "describe schema change"
alembic downgrade -1
```

Review generated migrations before applying. Every schema change requires upgrade and downgrade. The baseline is independent of the source migration history; apply it only to a new starter database. Downgrading the initial migration removes all foundation tables and their data; use a disposable database for roundtrip verification.
