from fastapi import APIRouter, HTTPException, Query
from .api import riot_client
from .exceptions import RiotApiException, AccountNotFoundException, RateLimitException, ApiKeyException
from .models import ApiResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/account/{summoner_name}/{tag_line}")
async def get_account_info(
    summoner_name: str, 
    tag_line: str,
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)")
):
    """Retrieves basic Riot account information"""
    try:
        account = await riot_client.get_account_by_riot_id(summoner_name, tag_line, region)
        return ApiResponse(success=True, data=account.dict())
    except AccountNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ApiKeyException as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RateLimitException as e:
        raise HTTPException(status_code=429, detail=str(e))
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/player/{summoner_name}/{tag_line}")
async def get_complete_player_info(
    summoner_name: str, 
    tag_line: str, 
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)")
):
    """Retrieves complete player information (account, summoner, rankings)"""
    try:
        player_info = await riot_client.get_complete_player_info(summoner_name, tag_line, region)
        return ApiResponse(success=True, data=player_info)
    except AccountNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ApiKeyException as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RateLimitException as e:
        raise HTTPException(status_code=429, detail=str(e))
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/summoner/puuid/{puuid}")
async def get_summoner_by_puuid(
    puuid: str, 
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)")
):
    """Retrieves summoner information by PUUID"""
    try:
        summoner = await riot_client.get_summoner_by_puuid(puuid, region)
        return ApiResponse(success=True, data=summoner.dict())
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/rankings/{summoner_id}")
async def get_league_entries(
    summoner_id: str, 
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)")
):
    """Retrieves rankings for a summoner"""
    try:
        entries = await riot_client.get_league_entries(summoner_id, region)
        return ApiResponse(success=True, data=[entry.dict() for entry in entries])
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/matches/by-puuid/{puuid}/ids")
async def get_match_history(
    puuid: str,
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)"),
    start: int = Query(default=0, description="Start index"),
    count: int = Query(default=20, description="Number of matches to return (max 100)")
):
    """Retrieves match history (list of match IDs) for a player"""
    try:
        match_ids = await riot_client.get_match_history(puuid, region, start, count)
        return ApiResponse(success=True, data=match_ids)
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/matches/{match_id}")
async def get_match_details(
    match_id: str,
    region: str = Query(default="EUW", description="Region code (e.g., EUW, NA, KR)")
):
    """Retrieves detailed match information by match ID"""
    try:
        match_details = await riot_client.get_match_details(match_id, region)
        return ApiResponse(success=True, data=match_details)
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

