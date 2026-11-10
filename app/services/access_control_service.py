from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.auth import Permission, Role, User
from app.repositories.user_repository import PermissionRepository, RoleRepository, UserRepository
from app.schemas.auth import RoleCreate, RoleUpdate, UserCreate, UserPasswordUpdate, UserStatusUpdate, UserUpdate


SYSTEM_ROLE_NAMES = {"Super Admin", "Admin", "Viewer"}
ADMIN_ROLE_NAMES = {"Super Admin", "Admin"}
DANGEROUS_PERMISSION_CODES = {
    "users.delete",
    "roles.delete",
    "roles.create",
    "roles.update",
}
ACTION_ORDER = ["read", "view", "amounts.view", "financial.view", "create", "update", "delete", "approve", "export"]

MODULE_LABELS = {"dashboard": "Dashboard", "settings": "Settings", "users": "Users", "roles": "Roles", "permissions": "Permissions", "activity_logs": "Activity Logs"}


def is_super_admin(user: User) -> bool:
    return any(role.name == "Super Admin" and role.status == "ACTIVE" and not role.is_deleted for role in user.roles)


def is_admin_user(user: User) -> bool:
    return any(role.name in ADMIN_ROLE_NAMES and role.status == "ACTIVE" and not role.is_deleted for role in user.roles)


def active_permission_codes(user: User) -> set[str]:
    return {
        permission.code
        for role in user.roles
        if role.status == "ACTIVE" and not role.is_deleted
        for permission in role.permissions
        if permission.status == "ACTIVE" and not permission.is_deleted
    }


class AccessControlService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.users = UserRepository(db)
        self.roles = RoleRepository(db)
        self.permissions = PermissionRepository(db)

    def list_users(
        self,
        *,
        search: str | None,
        status_filter: str | None,
        role_id: int | None,
        page: int,
        page_size: int,
        current_user: User,
    ) -> tuple[list[User], int]:
        self._require_admin(current_user)
        return self.users.list(
            search=search,
            status=status_filter,
            role_id=role_id,
            skip=(page - 1) * page_size,
            limit=page_size,
        )

    def get_user(self, user_id: int, current_user: User | None = None) -> User:
        if current_user is not None:
            self._require_admin(current_user)
        user = self.users.get_by_id(user_id)
        if user is None or user.is_deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    def create_user(self, payload: UserCreate, current_user: User) -> User:
        self._require_admin(current_user)
        if self.users.get_by_email(payload.email) is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
        role = self._get_assignable_role(payload.role_id, current_user)
        user = User(
            full_name=payload.name,
            email=str(payload.email),
            phone=payload.phone,
            hashed_password=get_password_hash(payload.password),
            status=payload.status,
            roles=[role],
        )
        try:
            user = self.users.add(user)
            self.db.commit()
            self.db.refresh(user)
            return self.get_user(user.id)
        except IntegrityError as exc:
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists") from exc

    def update_user(self, user_id: int, payload: UserUpdate, current_user: User) -> User:
        self._require_admin(current_user)
        user = self.get_user(user_id)
        updates = payload.model_dump(exclude_unset=True)
        new_role = None
        if "email" in updates:
            existing = self.users.get_by_email(str(updates["email"]))
            if existing is not None and existing.id != user.id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
        if "role_id" in updates and updates["role_id"] is not None:
            new_role = self._get_assignable_role(updates["role_id"], current_user)
            self._ensure_not_removing_own_admin_access(user, [new_role], current_user)
        if updates.get("status") == "INACTIVE":
            self._ensure_not_self(user, current_user, "You cannot deactivate your own account")

        if "name" in updates:
            user.full_name = updates["name"]
        if "email" in updates:
            user.email = str(updates["email"])
        if "phone" in updates:
            user.phone = updates["phone"]
        if "status" in updates:
            user.status = updates["status"]
        if new_role is not None:
            user.roles = [new_role]

        try:
            self.db.commit()
            return self.get_user(user.id)
        except IntegrityError as exc:
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists") from exc

    def update_user_status(self, user_id: int, payload: UserStatusUpdate, current_user: User) -> User:
        self._require_admin(current_user)
        user = self.get_user(user_id)
        if payload.status == "INACTIVE":
            self._ensure_not_self(user, current_user, "You cannot deactivate your own account")
        user.status = payload.status
        self.db.commit()
        return self.get_user(user.id)

    def update_user_password(self, user_id: int, payload: UserPasswordUpdate, current_user: User) -> User:
        self._require_admin(current_user)
        user = self.get_user(user_id)
        user.hashed_password = get_password_hash(payload.password)
        self.db.commit()
        return self.get_user(user.id)

    def delete_user(self, user_id: int, current_user: User) -> None:
        self._require_admin(current_user)
        user = self.get_user(user_id)
        self._ensure_not_self(user, current_user, "You cannot delete your own account")
        user.is_deleted = True
        user.status = "INACTIVE"
        self.db.commit()

    def list_roles(
        self,
        *,
        search: str | None,
        status_filter: str | None,
        page: int,
        page_size: int,
        current_user: User,
    ) -> tuple[list[Role], int]:
        self._require_admin(current_user)
        return self.roles.list(
            search=search,
            status=status_filter,
            skip=(page - 1) * page_size,
            limit=page_size,
        )

    def get_role(self, role_id: int, current_user: User | None = None) -> Role:
        if current_user is not None:
            self._require_admin(current_user)
        role = self.roles.get(role_id)
        if role is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
        return role

    def create_role(self, payload: RoleCreate, current_user: User) -> Role:
        self._require_admin(current_user)
        if self.roles.get_by_name(payload.name) is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already exists")
        permissions = self._get_permissions(payload.permission_ids, current_user)
        role = Role(
            name=payload.name,
            description=payload.description,
            status=payload.status,
            is_system_role=False,
            permissions=permissions,
        )
        try:
            role = self.roles.create(role)
            self.db.commit()
            return self.get_role(role.id)
        except IntegrityError as exc:
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already exists") from exc

    def update_role(self, role_id: int, payload: RoleUpdate, current_user: User) -> Role:
        self._require_admin(current_user)
        role = self.get_role(role_id)
        if role.is_system_role and not is_super_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Super Admin can modify system roles",
            )
        if role.name == "Super Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super Admin role permissions are locked",
            )
        updates = payload.model_dump(exclude_unset=True)
        if "name" in updates:
            existing = self.roles.get_by_name(updates["name"])
            if existing is not None and existing.id != role.id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already exists")
            role.name = updates["name"]
        if "description" in updates:
            role.description = updates["description"]
        if "status" in updates:
            role.status = updates["status"]
        if "permission_ids" in updates and updates["permission_ids"] is not None:
            role.permissions = self._get_permissions(updates["permission_ids"], current_user)

        self._ensure_not_removing_own_admin_access(current_user, current_user.roles, current_user)
        try:
            self.db.commit()
            return self.get_role(role.id)
        except IntegrityError as exc:
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role already exists") from exc

    def delete_role(self, role_id: int, current_user: User) -> None:
        self._require_admin(current_user)
        role = self.get_role(role_id)
        if role.is_system_role:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="System roles cannot be deleted")
        if any(not user.is_deleted for user in role.users):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role is assigned to users")
        role.is_deleted = True
        self.db.commit()

    def list_permissions(self, current_user: User | None = None) -> list[Permission]:
        if current_user is not None:
            self._require_admin(current_user)
        return self.permissions.list()

    def grouped_permissions(self, current_user: User | None = None) -> list[dict[str, object]]:
        grouped: dict[str, list[Permission]] = {}
        for permission in self.list_permissions(current_user):
            grouped.setdefault(permission.module, []).append(permission)
        ordered_modules = list(MODULE_LABELS.keys())
        for module in grouped:
            if module not in ordered_modules:
                ordered_modules.append(module)
        return [
            {
                "module": module,
                "label": MODULE_LABELS.get(module, module.replace("_", " ").title()),
                "permissions": sorted(
                    grouped[module],
                    key=lambda permission: (
                        ACTION_ORDER.index(permission.action)
                        if permission.action in ACTION_ORDER
                        else len(ACTION_ORDER),
                        permission.action,
                    ),
                ),
            }
            for module in ordered_modules
            if module in grouped
        ]

    def role_to_read(self, role: Role) -> dict[str, object]:
        return {
            "id": role.id,
            "name": role.name,
            "description": role.description,
            "is_system_role": role.is_system_role,
            "status": role.status,
            "users_count": len([user for user in role.users if not user.is_deleted]),
            "permissions_count": len([permission for permission in role.permissions if not permission.is_deleted]),
            "permissions": role.permissions,
            "created_at": role.created_at,
        }

    def _get_assignable_role(self, role_id: int, current_user: User) -> Role:
        role = self.users.get_active_role(role_id)
        if role is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
        if role.name == "Super Admin" and not is_super_admin(current_user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Super Admin can assign Super Admin")
        return role

    def _get_permissions(self, permission_ids: list[int], current_user: User) -> list[Permission]:
        permissions = self.permissions.get_many(permission_ids)
        if len({permission.id for permission in permissions}) != len(set(permission_ids)):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
        dangerous = {permission.code for permission in permissions}.intersection(DANGEROUS_PERMISSION_CODES)
        if dangerous and not is_super_admin(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Super Admin can assign dangerous permissions",
            )
        return permissions

    def _require_admin(self, current_user: User) -> None:
        if not is_admin_user(current_user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")

    def _ensure_not_self(self, user: User, current_user: User, detail: str) -> None:
        if user.id == current_user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

    def _ensure_not_removing_own_admin_access(
        self,
        affected_user: User,
        new_roles: list[Role],
        current_user: User,
    ) -> None:
        if affected_user.id != current_user.id:
            return
        if not any(role.name in ADMIN_ROLE_NAMES and role.status == "ACTIVE" and not role.is_deleted for role in new_roles):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot remove your own Admin/Super Admin access",
            )
