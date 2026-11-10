"""Idempotent foundation seed; credentials are used only when creating the admin."""
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import select
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.auth import User, Role, Permission
from app.models.settings import SystemSettings

PERMISSIONS = {
    "users": ("read", "create", "update", "delete"),
    "roles": ("read", "create", "update", "delete"),
    "permissions": ("read",),
    "settings": ("read", "update"),
}
class AdminCredentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value

def seed(db):
    permissions = []
    for module, actions in PERMISSIONS.items():
        for action in actions:
            code = f"{module}.{action}"
            permission = db.scalar(select(Permission).where(Permission.code == code))
            if permission is None:
                permission = Permission(module=module, action=action, code=code, status="ACTIVE")
                db.add(permission)
            permissions.append(permission)
    roles = {}
    for name in ("Super Admin", "Admin", "Viewer"):
        role = db.scalar(select(Role).where(Role.name == name))
        if role is None:
            role = Role(name=name, is_system_role=True, status="ACTIVE")
            role.permissions = permissions[:] if name != "Viewer" else [p for p in permissions if p.code == "settings.read"]
            db.add(role)
        elif name == "Super Admin":
            role.permissions = permissions[:]
        roles[name] = role
    credentials = AdminCredentials(email=settings.ADMIN_EMAIL, password=settings.ADMIN_PASSWORD)
    admin = db.scalar(select(User).where(User.email == str(credentials.email)))
    if admin is None:
        admin = User(full_name=settings.ADMIN_NAME, email=str(credentials.email), hashed_password=get_password_hash(credentials.password), status="ACTIVE", roles=[roles["Super Admin"]])
        db.add(admin)
    if db.scalar(select(SystemSettings).where(SystemSettings.is_deleted.is_(False))) is None:
        db.add(SystemSettings(app_name=settings.PROJECT_NAME))
    db.flush()
    return admin

def run():
    with SessionLocal() as db:
        try:
            seed(db)
            db.commit()
        except Exception:
            db.rollback()
            raise
    print("Foundation seed complete. Existing passwords and role customizations preserved.")

if __name__ == "__main__":
    run()
