import os
import requests
import asyncio
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from datetime import datetime, timedelta
import logging
import time

from .models import RiotAccount, SummonerInfo, LeagueEntry, ApiResponse
from .exceptions import (
    RiotApiException, 
    AccountNotFoundException, 
    RateLimitException, 
    ApiKeyException,
    ServiceUnavailableException
)

# Load environment variables from .env file
load_dotenv()

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RiotApiClient:
    """Robust client for Riot Games API with error handling and rate limiting"""
    
    def __init__(self):
        self.api_key: str = os.getenv("RIOT_API_KEY")
        self.base_url_riot: str = "https://europe.api.riotgames.com"
        self.base_url_lol_euw: str = "https://euw1.api.riotgames.com"
        
        # API key validation
        if not self.api_key:
            raise ValueError("RIOT_API_KEY is not defined in environment variables")
        
        # Default headers
        self.headers: Dict[str, str] = {
            "X-Riot-Token": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Basic rate limiting
        self.last_request_time: Optional[datetime] = None
        self.min_request_interval: timedelta = timedelta(milliseconds=100)  # 10 req/sec max
    



    def _handle_response_errors(self, response: requests.Response, summoner_name: str = "", tag_line: str = "") -> None:
        """Handles HTTP response errors"""
        if response.status_code == 200:
            return
        
        logger.error(f"API Error: {response.status_code} - {response.text}")
        
        if response.status_code == 404:
            raise AccountNotFoundException(summoner_name, tag_line)
        elif response.status_code == 403:
            raise ApiKeyException()
        elif response.status_code == 429:
            raise RateLimitException()
        elif response.status_code == 503:
            raise ServiceUnavailableException()
        else:
            raise RiotApiException(
                f"Unexpected API error: {response.status_code} - {response.text}",
                response.status_code
            )
    



    def _rate_limit_wait(self) -> None:
        """Applies delay to respect rate limits"""
        if self.last_request_time:
            elapsed = datetime.now() - self.last_request_time
            if elapsed < self.min_request_interval:
                sleep_time = (self.min_request_interval - elapsed).total_seconds()
                logger.debug(f"Rate limiting: waiting {sleep_time:.3f}s")
                time.sleep(sleep_time)
        
        self.last_request_time = datetime.now()



    
    ### Start of API methods


    # Fetch account by Riot ID
    async def get_account_by_riot_id(self, summoner_name: str, tag_line: str) -> RiotAccount:
        """
        Retrieves account information by Riot ID
        
        Args:
            summoner_name: Summoner name (e.g., "Faker")
            tag_line: Tag line (e.g., "T1")
            
        Returns:
            RiotAccount: Riot account information
            
        Raises:
            AccountNotFoundException: If the account doesn't exist
            ApiKeyException: If the API key is invalid
            RateLimitException: If the rate limit is reached
        """
        self._rate_limit_wait()
        
        url = f"{self.base_url_riot}/riot/account/v1/accounts/by-riot-id/{summoner_name}/{tag_line}"
        
        logger.info(f"Fetching account: {summoner_name}#{tag_line}")
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            self._handle_response_errors(response, summoner_name, tag_line)
            
            data = response.json()
            return RiotAccount(**data)
            
        except requests.exceptions.Timeout:
            raise RiotApiException("API request timeout", 408)
        except requests.exceptions.RequestException as e:
            raise RiotApiException(f"Connection error: {str(e)}")
    

    # Fetch summoner info by PUUID
    async def get_summoner_by_puuid(self, puuid: str) -> SummonerInfo:
        """
        Retrieves summoner information by PUUID
        
        Args:
            puuid: Player PUUID
            
        Returns:
            SummonerInfo: Summoner information
        """
        self._rate_limit_wait()
        
        url = f"{self.base_url_lol_euw}/lol/summoner/v4/summoners/by-puuid/{puuid}"
        
        logger.info(f"Fetching summoner: {puuid}")
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            self._handle_response_errors(response)
            
            data = response.json()
            logger.info(f"Summoner API response data: {data}")  # Debug
            return SummonerInfo(**data)
            
        except requests.exceptions.Timeout:
            raise RiotApiException("API request timeout", 408)
        except requests.exceptions.RequestException as e:
            raise RiotApiException(f"Connection error: {str(e)}")
        

    # Fetch league entries by puuid ID
    async def get_league_entries(self, puuid: str) -> List[LeagueEntry]:
        """
        Retrieves league entries for a summoner
        
        Args:
            puuid: Player PUUID
            
        Returns:
            List[LeagueEntry]: List of rankings
        """
        self._rate_limit_wait()
    

        print(f"Fetching rankings for PUUID: {puuid}")
        url = f"{self.base_url_lol_euw}/lol/league/v4/entries/by-puuid/{puuid}"

        logger.info(f"Fetching rankings: {puuid}")

        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            self._handle_response_errors(response)
            
            data = response.json()
            logger.info(f"League API response data: {data}")  # Debug
            return [LeagueEntry(**entry) for entry in data]
            
        except requests.exceptions.Timeout:
            raise RiotApiException("API request timeout", 408)
        except requests.exceptions.RequestException as e:
            raise RiotApiException(f"Connection error: {str(e)}")
        

    # Fetch complete player info
    async def get_complete_player_info(self, summoner_name: str, tag_line: str) -> Dict[str, Any]:
        """
        Retrieves all player information
        
        Args:
            summoner_name: Summoner name
            tag_line: Tag line
            
        Returns:
            Dict containing all player information
        """
        try:
            # 1. Get Riot account
            account = await self.get_account_by_riot_id(summoner_name, tag_line)
            
            # 2. Get summoner info
            summoner = await self.get_summoner_by_puuid(account.puuid)
            
            # 3. Get rankings
            league_entries = await self.get_league_entries(summoner.puuid)
            logger.info(f"Complete information retrieved for {summoner_name}#{tag_line}")
            
            return {
                "account": account.dict(),
                "summoner": summoner.dict(),
                "rankings": [entry.dict() for entry in league_entries]
            }
            
        except RiotApiException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise RiotApiException(f"Unexpected error: {str(e)}")


# Global client instance
riot_client = RiotApiClient()
    
