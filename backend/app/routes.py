from fastapi import APIRouter, HTTPException
from .api import riot_client
from .exceptions import RiotApiException, AccountNotFoundException, RateLimitException, ApiKeyException
from .models import ApiResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/account/{summoner_name}/{tag_line}")
async def get_account_info(summoner_name: str, tag_line: str):
    """Retrieves basic Riot account information"""
    try:
        account = await riot_client.get_account_by_riot_id(summoner_name, tag_line)
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
async def get_complete_player_info(summoner_name: str, tag_line: str):
    """Retrieves complete player information (account, summoner, rankings)"""
    try:
        player_info = await riot_client.get_complete_player_info(summoner_name, tag_line)
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
async def get_summoner_by_puuid(puuid: str):
    """Retrieves summoner information by PUUID"""
    try:
        summoner = await riot_client.get_summoner_by_puuid(puuid)
        return ApiResponse(success=True, data=summoner.dict())
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/rankings/{summoner_id}")
async def get_league_entries(summoner_id: str):
    """Retrieves rankings for a summoner"""
    try:
        entries = await riot_client.get_league_entries(summoner_id)
        return ApiResponse(success=True, data=[entry.dict() for entry in entries])
    except RiotApiException as e:
        raise HTTPException(status_code=e.status_code or 500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
