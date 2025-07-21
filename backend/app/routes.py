"""
Refactored routes following clean architecture principles
Separates HTTP concerns from business logic
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
import logging

from .services import PlayerService, MatchService
from .dependencies import get_player_service, get_match_service, get_logger
from .exceptions import RiotApiException, AccountNotFoundException, RateLimitException, ApiKeyException
from .models import ApiResponse, RiotAccount, SummonerInfo, LeagueEntry

router = APIRouter()


@router.get("/account/{summoner_name}/{tag_line}", response_model=ApiResponse)
async def get_account_info(
    summoner_name: str, 
    tag_line: str,
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    player_service: PlayerService = Depends(get_player_service),
    logger: logging.Logger = Depends(get_logger)
):
    """Retrieves basic Riot account information"""
    try:
        account = await player_service.get_account_info(summoner_name, tag_line, region)
        return ApiResponse(success=True, data=account.dict())
    except AccountNotFoundException as e:
        logger.warning(f"Account not found: {summoner_name}#{tag_line}")
        raise HTTPException(status_code=404, detail=str(e))
    except ApiKeyException as e:
        logger.error("API key invalid or expired")
        raise HTTPException(status_code=403, detail=str(e))
    except RateLimitException as e:
        logger.warning("Rate limit exceeded")
        raise HTTPException(status_code=429, detail=str(e))
    except RiotApiException as e:
        logger.error(f"Riot API error: {str(e)}")
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in get_account_info: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/player/{summoner_name}/{tag_line}", response_model=ApiResponse)
async def get_complete_player_info(
    summoner_name: str, 
    tag_line: str, 
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    player_service: PlayerService = Depends(get_player_service),
    logger: logging.Logger = Depends(get_logger)
):
    """Retrieves complete player information (account, summoner, rankings)"""
    try:
        player_info = await player_service.get_complete_player_info(summoner_name, tag_line, region)
        return ApiResponse(success=True, data=player_info)
    except AccountNotFoundException as e:
        logger.warning(f"Player not found: {summoner_name}#{tag_line}")
        raise HTTPException(status_code=404, detail=str(e))
    except ApiKeyException as e:
        logger.error("API key invalid or expired")
        raise HTTPException(status_code=403, detail=str(e))
    except RateLimitException as e:
        logger.warning("Rate limit exceeded")
        raise HTTPException(status_code=429, detail=str(e))
    except RiotApiException as e:
        logger.error(f"Riot API error: {str(e)}")
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in get_complete_player_info: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/summoner/puuid/{puuid}", response_model=ApiResponse)
async def get_summoner_by_puuid(
    puuid: str, 
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    player_service: PlayerService = Depends(get_player_service),
    logger: logging.Logger = Depends(get_logger)
):
    """Retrieves summoner information by PUUID"""
    try:
        summoner = await player_service.get_summoner_by_puuid(puuid, region)
        return ApiResponse(success=True, data=summoner.dict())
    except RiotApiException as e:
        logger.error(f"Riot API error: {str(e)}")
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in get_summoner_by_puuid: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/rankings/{summoner_id}", response_model=ApiResponse)
async def get_league_entries(
    summoner_id: str, 
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    player_service: PlayerService = Depends(get_player_service),
    logger: logging.Logger = Depends(get_logger)
):
    """Retrieves rankings for a summoner"""
    try:
        entries = await player_service.get_league_entries(summoner_id, region)
        return ApiResponse(success=True, data=[entry.dict() for entry in entries])
    except RiotApiException as e:
        logger.error(f"Riot API error: {str(e)}")
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in get_league_entries: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/matches/by-puuid/{puuid}/ids", response_model=ApiResponse)
async def get_match_history(
    puuid: str,
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    start: int = Query(default=0, description="Start index", ge=0),
    count: int = Query(default=20, description="Number of matches to return", ge=1, le=100),
    match_service: MatchService = Depends(get_match_service),
    logger: logging.Logger = Depends(get_logger)
):
    """Retrieves match history (list of match IDs) for a player"""
    try:
        match_ids = await match_service.get_match_history(puuid, region, start, count)
        return ApiResponse(success=True, data=match_ids)
    except RiotApiException as e:
        logger.error(f"Riot API error: {str(e)}")
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in get_match_history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/matches/{match_id}", response_model=ApiResponse)
async def get_match_details(
    match_id: str,
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    match_service: MatchService = Depends(get_match_service),
    logger: logging.Logger = Depends(get_logger)
):
    """Retrieves detailed match information by match ID"""
    try:
        match_details = await match_service.get_match_details(match_id, region)
        return ApiResponse(success=True, data=match_details)
    except RiotApiException as e:
        logger.error(f"Riot API error: {str(e)}")
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in get_match_details: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
