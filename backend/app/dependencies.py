"""
Dependency injection setup for FastAPI
Provides shared resources and configurations
"""
from fastapi import Depends
from functools import lru_cache
from .api import RiotApiClient
from .services import PlayerService, MatchService
import logging


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@lru_cache()
def get_riot_client() -> RiotApiClient:
    """
    Dependency provider for RiotApiClient
    Uses lru_cache to ensure singleton behavior
    """
    return RiotApiClient()


def get_player_service(
    riot_client: RiotApiClient = Depends(get_riot_client)
) -> PlayerService:
    """
    Dependency provider for PlayerService
    Injects RiotApiClient dependency
    """
    service = PlayerService()
    service.riot_client = riot_client
    return service


def get_match_service(
    riot_client: RiotApiClient = Depends(get_riot_client)
) -> MatchService:
    """
    Dependency provider for MatchService
    Injects RiotApiClient dependency
    """
    service = MatchService()
    service.riot_client = riot_client
    return service


def get_logger() -> logging.Logger:
    """
    Dependency provider for logger
    """
    return logger
