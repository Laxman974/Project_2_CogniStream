from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import router


app = FastAPI(
    title="CogniStream API",
    description="Backend API for Developer Flow State Analytics",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROOT
# ---------------------------------------------------------

@app.get("/")
def root():

    return {
        "project": "CogniStream",
        "status": "Running",
        "database": "ClickHouse",
    }


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "CogniStream API",
    }


# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------

app.include_router(router)