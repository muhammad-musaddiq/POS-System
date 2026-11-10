from pydantic import BaseModel, model_validator


class PaginatedResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int = 0
    has_next: bool = False
    has_previous: bool = False

    @model_validator(mode="after")
    def calculate_pagination(self) -> "PaginatedResponse":
        self.total_pages = (self.total + self.page_size - 1) // self.page_size
        self.has_next = self.page < self.total_pages
        self.has_previous = self.page > 1
        return self
