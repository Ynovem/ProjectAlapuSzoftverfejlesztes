from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api.api_v1.api import api_router
from core.config import settings
from solvers.init_solvers import init_db

app = FastAPI(
    # title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
    title=settings.PROJECT_NAME
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        # allow_credentials=True,
        allow_credentials=False,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

init_db()

app.include_router(api_router, prefix=settings.API_V1_STR)
