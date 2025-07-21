"""
Service layer for player-related business logic
Separates business logic from route handlers
"""
from typing import List, Optional
from pydantic import Field, validator
from .api import riot_client
from .models import RiotAccount, SummonerInfo, LeagueEntry
from .exceptions import AccountNotFoundException, RiotApiException


class PlayerService:
    """Service class for player-related operations"""
    
    @staticmethod
    async def get_account_info(summoner_name: str, tag_line: str, region: str) -> RiotAccount:
        """
        Business logic for retrieving account information
        """
        # Input validation
        if not summoner_name.strip():
            raise ValueError("Summoner name cannot be empty")
        if not tag_line.strip():
            raise ValueError("Tag line cannot be empty")
        if len(summoner_name) > 16:
            raise ValueError("Summoner name too long (max 16 characters)")
        if len(tag_line) > 5:
            raise ValueError("Tag line too long (max 5 characters)")
        
        return await riot_client.get_account_by_riot_id(summoner_name.strip(), tag_line.strip(), region.upper())
    
    @staticmethod
    async def get_complete_player_info(summoner_name: str, tag_line: str, region: str) -> dict:
        """
        Business logic for retrieving complete player information
        Aggregates data from multiple API calls
        """
        # Input validation (same as above)
        if not summoner_name.strip():
            raise ValueError("Summoner name cannot be empty")
        if not tag_line.strip():
            raise ValueError("Tag line cannot be empty")
        if len(summoner_name) > 16:
            raise ValueError("Summoner name too long (max 16 characters)")
        if len(tag_line) > 5:
            raise ValueError("Tag line too long (max 5 characters)")
        
        return await riot_client.get_complete_player_info(summoner_name.strip(), tag_line.strip(), region.upper())
    
    @staticmethod
    async def get_summoner_by_puuid(puuid: str, region: str) -> SummonerInfo:
        """
        Business logic for retrieving summoner by PUUID
        """
        # PUUID validation
        if not puuid or len(puuid) != 78:
            raise ValueError("Invalid PUUID format")
        
        return await riot_client.get_summoner_by_puuid(puuid, region.upper())
    
    @staticmethod
    async def get_league_entries(summoner_id: str, region: str) -> List[LeagueEntry]:
        """
        Business logic for retrieving league entries
        """
        if not summoner_id.strip():
            raise ValueError("Summoner ID cannot be empty")
        
        return await riot_client.get_league_entries(summoner_id.strip(), region.upper())


class MatchService:
    """Service class for match-related operations"""
    
    @staticmethod
    async def get_match_history(puuid: str, region: str, start: int = 0, count: int = 20) -> List[str]:
        """
        Business logic for retrieving match history
        Applies business rules like count validation
        """
        # Input validation
        if not puuid or len(puuid) != 78:
            raise ValueError("Invalid PUUID format")
        if start < 0:
            raise ValueError("Start index must be non-negative")
        if count < 1 or count > 100:
            raise ValueError("Count must be between 1 and 100")
        
        return await riot_client.get_match_history(puuid, region.upper(), start, count)
    
    @staticmethod
    async def get_match_details(match_id: str, region: str) -> dict:
        """
        Business logic for retrieving match details
        """
        if not match_id.strip():
            raise ValueError("Match ID cannot be empty")
        if not match_id.startswith(region.upper()):
            raise ValueError(f"Match ID must start with {region.upper()}")
        
        return await riot_client.get_match_details(match_id.strip(), region.upper())
