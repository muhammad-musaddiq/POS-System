from sqlalchemy.orm import Session

from app.core.security import create_access_token, create_refresh_token, decode_refresh_token, get_password_hash, verify_password
from app.models.auth import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenResponse


class AuthService:
    def __init__(self, db: Session) -> None:
        self.users = UserRepository(db)

    def login(self, email: str, password: str) -> TokenResponse | None:
        user = self.users.get_by_email(email)
        if user is None or user.is_deleted or user.status != "ACTIVE":
            return None
        if not verify_password(password, user.hashed_password):
            return None

        return self._token_pair(user)

    def refresh(self, refresh_token: str) -> TokenResponse | None:
        try:
            payload = decode_refresh_token(refresh_token)
            user_id = int(payload.get("sub"))
        except (TypeError, ValueError):
            return None

        user = self.users.get_by_id(user_id)
        if user is None or user.is_deleted or user.status != "ACTIVE":
            return None
        return self._token_pair(user)

    def create_internal_user(
        self,
        *,
        full_name: str,
        email: str,
        password: str,
        phone: str | None = None,
        status: str = "ACTIVE",
    ) -> User:
        user = User(
            full_name=full_name,
            email=email,
            hashed_password=get_password_hash(password),
            phone=phone,
            status=status,
        )
        return self.users.add(user)

    def _token_pair(self, user: User) -> TokenResponse:
        return TokenResponse(
            access_token=create_access_token(subject=user.id),
            refresh_token=create_refresh_token(subject=user.id),
        )
