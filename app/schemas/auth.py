from datetime import datetime
from typing import Annotated
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, computed_field

from app.schemas.common import PaginatedResponse

LocalEmailStr = Annotated[
    str,
    Field(
        min_length=3,
        max_length=255,
        pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
    ),
]


class LoginRequest(BaseModel):
    email: LocalEmailStr
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=1)


class PermissionRead(BaseModel):
    id: int
    module: str
    action: str
    code: str
    description: str | None = None

    model_config = {"from_attributes": True}


class RoleRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    is_system_role: bool = False
    permissions: list[PermissionRead] = []

    model_config = {"from_attributes": True}


class UserRead(BaseModel):
    id: int
    full_name: str
    email: LocalEmailStr
    phone: str | None = None
    status: str
    roles: list[RoleRead] = []

    model_config = {"from_attributes": True}


class PermissionGrouped(BaseModel):
    module: str
    label: str
    permissions: list[PermissionRead]


class UserManagementRead(UserRead):
    created_at: datetime

    @computed_field
    @property
    def name(self) -> str:
        return self.full_name

    @computed_field
    @property
    def role_id(self) -> int | None:
        return self.roles[0].id if self.roles else None


class UserListResponse(PaginatedResponse):
    items: list[UserManagementRead]


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    role_id: int
    status: Literal["ACTIVE", "INACTIVE"] = "ACTIVE"


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)
    role_id: int | None = None
    status: Literal["ACTIVE", "INACTIVE"] | None = None


class UserStatusUpdate(BaseModel):
    status: Literal["ACTIVE", "INACTIVE"]


class UserPasswordUpdate(BaseModel):
    password: str = Field(min_length=8, max_length=128)


class RoleManagementRead(RoleRead):
    status: str
    users_count: int = 0
    permissions_count: int = 0
    created_at: datetime


class RoleListResponse(PaginatedResponse):
    items: list[RoleManagementRead]


class RoleCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    permission_ids: list[int] = []
    status: Literal["ACTIVE", "INACTIVE"] = "ACTIVE"


class RoleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    permission_ids: list[int] | None = None
    status: Literal["ACTIVE", "INACTIVE"] | None = None
