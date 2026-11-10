from typing import Literal

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.db.session import get_db
from app.models.auth import User
from app.schemas.auth import (
    PermissionGrouped,
    PermissionRead,
    RoleCreate,
    RoleListResponse,
    RoleManagementRead,
    RoleUpdate,
    UserCreate,
    UserListResponse,
    UserManagementRead,
    UserPasswordUpdate,
    UserStatusUpdate,
    UserUpdate,
)
from app.services.access_control_service import AccessControlService


users_router = APIRouter()
roles_router = APIRouter()
permissions_router = APIRouter()


@users_router.get("", response_model=UserListResponse, dependencies=[Depends(require_permission("users.read"))])
def list_users(
    search: str | None = None,
    status_filter: Literal["ACTIVE", "INACTIVE"] | None = Query(default=None, alias="status"),
    role_id: int | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserListResponse:
    users, total = AccessControlService(db).list_users(
        search=search,
        status_filter=status_filter,
        role_id=role_id,
        page=page,
        page_size=page_size,
        current_user=current_user,
    )
    return UserListResponse(items=users, total=total, page=page, page_size=page_size)


@users_router.post(
    "",
    response_model=UserManagementRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("users.create"))],
)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserManagementRead:
    return AccessControlService(db).create_user(payload, current_user)


@users_router.get("/{user_id}", response_model=UserManagementRead, dependencies=[Depends(require_permission("users.read"))])
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserManagementRead:
    return AccessControlService(db).get_user(user_id, current_user)


@users_router.put("/{user_id}", response_model=UserManagementRead, dependencies=[Depends(require_permission("users.update"))])
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserManagementRead:
    return AccessControlService(db).update_user(user_id, payload, current_user)


@users_router.patch(
    "/{user_id}/status",
    response_model=UserManagementRead,
    dependencies=[Depends(require_permission("users.update"))],
)
def update_user_status(
    user_id: int,
    payload: UserStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserManagementRead:
    return AccessControlService(db).update_user_status(user_id, payload, current_user)


@users_router.patch(
    "/{user_id}/password",
    response_model=UserManagementRead,
    dependencies=[Depends(require_permission("users.update"))],
)
def update_user_password(
    user_id: int,
    payload: UserPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserManagementRead:
    return AccessControlService(db).update_user_password(user_id, payload, current_user)


@users_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permission("users.delete"))])
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    AccessControlService(db).delete_user(user_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@roles_router.get("", response_model=RoleListResponse, dependencies=[Depends(require_permission("roles.read"))])
def list_roles(
    search: str | None = None,
    status_filter: Literal["ACTIVE", "INACTIVE"] | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RoleListResponse:
    roles, total = AccessControlService(db).list_roles(
        search=search,
        status_filter=status_filter,
        page=page,
        page_size=page_size,
        current_user=current_user,
    )
    service = AccessControlService(db)
    return RoleListResponse(
        items=[service.role_to_read(role) for role in roles],
        total=total,
        page=page,
        page_size=page_size,
    )


@roles_router.post(
    "",
    response_model=RoleManagementRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("roles.create"))],
)
def create_role(
    payload: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RoleManagementRead:
    service = AccessControlService(db)
    return service.role_to_read(service.create_role(payload, current_user))


@roles_router.get("/{role_id}", response_model=RoleManagementRead, dependencies=[Depends(require_permission("roles.read"))])
def get_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RoleManagementRead:
    service = AccessControlService(db)
    return service.role_to_read(service.get_role(role_id, current_user))


@roles_router.put("/{role_id}", response_model=RoleManagementRead, dependencies=[Depends(require_permission("roles.update"))])
def update_role(
    role_id: int,
    payload: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RoleManagementRead:
    service = AccessControlService(db)
    return service.role_to_read(service.update_role(role_id, payload, current_user))


@roles_router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_permission("roles.delete"))])
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    AccessControlService(db).delete_role(role_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@permissions_router.get("", response_model=list[PermissionRead], dependencies=[Depends(require_permission("permissions.read"))])
def list_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[PermissionRead]:
    return AccessControlService(db).list_permissions(current_user)


@permissions_router.get(
    "/grouped",
    response_model=list[PermissionGrouped],
    dependencies=[Depends(require_permission("permissions.read"))],
)
def grouped_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[PermissionGrouped]:
    return AccessControlService(db).grouped_permissions(current_user)
