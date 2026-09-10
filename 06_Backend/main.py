from fastapi import FastAPI

from routers import router

app = FastAPI(
    title="CogniStream API",
    description="Backend API for Developer Flow State Analytics",
    version="1.0.0",
)


@app.get("/")
def root():

    return {
        "project": "CogniStream",
        "status": "Running",
        "database": "ClickHouse",
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "CogniStream API",
    }


app.include_router(router)