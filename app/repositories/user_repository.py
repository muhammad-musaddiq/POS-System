from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.auth import Permission, Role, User, user_roles


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        statement = (
            select(User)
            .options(selectinload(User.roles).selectinload(Role.permissions))
            .where(User.id == user_id)
        )
        return self.db.execute(statement).scalar_one_or_none()

    def get_by_email(self, email: str) -> User | None:
        statement = (
            select(User)
            .options(selectinload(User.roles).selectinload(Role.permissions))
            .where(func.lower(User.email) == email.lower())
        )
        return self.db.execute(statement).scalar_one_or_none()

    def add(self, user: User) -> User:
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return user

    def list(
        self,
        *,
        search: str | None = None,
        status: str | None = None,
        role_id: int | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[User], int]:
        statement = (
            select(User)
            .options(selectinload(User.roles).selectinload(Role.permissions))
            .where(User.is_deleted.is_(False))
            .order_by(User.created_at.desc(), User.id.desc())
        )
        count_statement = select(func.count(User.id)).where(User.is_deleted.is_(False))

        if search:
            pattern = f"%{search.lower()}%"
            condition = (
                func.lower(User.full_name).like(pattern)
                | func.lower(User.email).like(pattern)
            )
            statement = statement.where(condition)
            count_statement = count_statement.where(condition)
        if status:
            statement = statement.where(User.status == status)
            count_statement = count_statement.where(User.status == status)
        if role_id is not None:
            statement = statement.join(user_roles).where(user_roles.c.role_id == role_id)
            count_statement = count_statement.join(user_roles).where(user_roles.c.role_id == role_id)

        total = self.db.execute(count_statement).scalar_one()
        users = self.db.execute(statement.offset(skip).limit(limit)).scalars().unique().all()
        return list(users), total

    def get_active_role(self, role_id: int) -> Role | None:
        statement = (
            select(Role)
            .options(selectinload(Role.permissions))
            .where(Role.id == role_id, Role.is_deleted.is_(False), Role.status == "ACTIVE")
        )
        return self.db.execute(statement).scalar_one_or_none()


class RoleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, role_id: int) -> Role | None:
        statement = (
            select(Role)
            .options(selectinload(Role.permissions), selectinload(Role.users))
            .where(Role.id == role_id, Role.is_deleted.is_(False))
        )
        return self.db.execute(statement).scalar_one_or_none()

    def get_by_name(self, name: str) -> Role | None:
        statement = select(Role).where(
            func.lower(Role.name) == name.lower(),
            Role.is_deleted.is_(False),
        )
        return self.db.execute(statement).scalar_one_or_none()

    def list(
        self,
        *,
        search: str | None = None,
        status: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Role], int]:
        statement = (
            select(Role)
            .options(selectinload(Role.permissions), selectinload(Role.users))
            .where(Role.is_deleted.is_(False))
            .order_by(Role.is_system_role.desc(), Role.name.asc())
        )
        count_statement = select(func.count(Role.id)).where(Role.is_deleted.is_(False))

        if search:
            pattern = f"%{search.lower()}%"
            condition = func.lower(Role.name).like(pattern)
            statement = statement.where(condition)
            count_statement = count_statement.where(condition)
        if status:
            statement = statement.where(Role.status == status)
            count_statement = count_statement.where(Role.status == status)

        total = self.db.execute(count_statement).scalar_one()
        roles = self.db.execute(statement.offset(skip).limit(limit)).scalars().unique().all()
        return list(roles), total

    def create(self, role: Role) -> Role:
        self.db.add(role)
        self.db.flush()
        self.db.refresh(role)
        return role


class PermissionRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self) -> list[Permission]:
        statement = (
            select(Permission)
            .where(Permission.is_deleted.is_(False), Permission.status == "ACTIVE")
            .order_by(Permission.module.asc(), Permission.action.asc())
        )
        return list(self.db.execute(statement).scalars().all())

    def get_many(self, permission_ids: list[int]) -> list[Permission]:
        if not permission_ids:
            return []
        statement = select(Permission).where(
            Permission.id.in_(permission_ids),
            Permission.is_deleted.is_(False),
            Permission.status == "ACTIVE",
        )
        return list(self.db.execute(statement).scalars().all())
