from collections.abc import Callable

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.auth import User
from app.repositories.user_repository import UserRepository


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        subject = payload.get("sub")
        user_id = int(subject)
    except (TypeError, ValueError):
        raise credentials_error from None

    user = UserRepository(db).get_by_id(user_id)
    if user is None or user.is_deleted or user.status != "ACTIVE":
        raise credentials_error
    db.info["current_user_id"] = user.id
    return user


def require_role(*role_names: str) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        user_roles = {
            role.name
            for role in current_user.roles
            if not role.is_deleted and role.status == "ACTIVE"
        }
        if not user_roles.intersection(role_names):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role permissions",
            )
        return current_user

    return dependency


def require_permission(
    permission_code: str,
    *,
    allow_legacy_no_roles: bool = False,
) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        active_roles = [
            role
            for role in current_user.roles
            if not role.is_deleted and role.status == "ACTIVE"
        ]
        if not active_roles and allow_legacy_no_roles:
            return current_user

        user_permissions = {
            permission.code
            for role in active_roles
            for permission in role.permissions
            if not permission.is_deleted and permission.status == "ACTIVE"
        }
        if permission_code not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return dependency


def require_module_permission(module: str) -> Callable[[Request, User], User]:
    def dependency(
        request: Request,
        current_user: User = Depends(get_current_user),
    ) -> User:
        action_by_method = {
            "GET": "read",
            "HEAD": "read",
            "OPTIONS": "read",
            "POST": "create",
            "PATCH": "update",
            "PUT": "update",
            "DELETE": "delete",
        }
        action = action_by_method.get(request.method, "read")
        permission_dependency = require_permission(f"{module}.{action}")
        return permission_dependency(current_user)

    return dependency
