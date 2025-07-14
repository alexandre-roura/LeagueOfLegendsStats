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
        
        # Platform endpoints mapping (pour les données spécifiques au serveur)
        self.platform_endpoints = {
            "EUW": "https://euw1.api.riotgames.com",
            "EUNE": "https://eun1.api.riotgames.com",
            "NA": "https://na1.api.riotgames.com", 
            "KR": "https://kr.api.riotgames.com",
            "BR": "https://br1.api.riotgames.com",
            "JP": "https://jp1.api.riotgames.com",
            "LAN": "https://la1.api.riotgames.com",
            "LAS": "https://la2.api.riotgames.com",
            "OCE": "https://oc1.api.riotgames.com",
            "RU": "https://ru.api.riotgames.com",
            "TR": "https://tr1.api.riotgames.com",
            "ME": "https://me1.api.riotgames.com",
            "SG": "https://sg2.api.riotgames.com",
            "TW": "https://tw2.api.riotgames.com",
            "VN": "https://vn2.api.riotgames.com"
        }
        
        # Regional endpoints mapping (pour les données centralisées)
        self.regional_endpoints = {
            "EUW": "https://europe.api.riotgames.com",
            "EUNE": "https://europe.api.riotgames.com",
            "TR": "https://europe.api.riotgames.com",
            "RU": "https://europe.api.riotgames.com",
            "ME": "https://europe.api.riotgames.com",
            "NA": "https://americas.api.riotgames.com",
            "BR": "https://americas.api.riotgames.com",
            "LAN": "https://americas.api.riotgames.com",
            "LAS": "https://americas.api.riotgames.com",
            "KR": "https://asia.api.riotgames.com",
            "JP": "https://asia.api.riotgames.com",
            "OCE": "https://sea.api.riotgames.com",
            "SG": "https://sea.api.riotgames.com",
            "TW": "https://sea.api.riotgames.com",
            "VN": "https://sea.api.riotgames.com"
        }
        
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
    async def get_account_by_riot_id(self, summoner_name: str, tag_line: str, region: str = "EUW") -> RiotAccount:
        """
        Retrieves account information by Riot ID
        
        Args:
            summoner_name: Summoner name (e.g., "Faker")
            tag_line: Tag line (e.g., "T1")
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            RiotAccount: Riot account information
            
        Raises:
            AccountNotFoundException: If the account doesn't exist
            ApiKeyException: If the API key is invalid
            RateLimitException: If the rate limit is reached
        """
        self._rate_limit_wait()
        
        regional_url = self.get_regional_base_url(region)
        url = f"{regional_url}/riot/account/v1/accounts/by-riot-id/{summoner_name}/{tag_line}"
        
        logger.info(f"Fetching account: {summoner_name}#{tag_line} from regional URL: {regional_url}")
        
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
    async def get_summoner_by_puuid(self, puuid: str, region: str = "EUW") -> SummonerInfo:
        """
        Retrieves summoner information by PUUID
        
        Args:
            puuid: Player PUUID
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            SummonerInfo: Summoner information
        """
        self._rate_limit_wait()
        
        platform_url = self.get_platform_base_url(region)
        url = f"{platform_url}/lol/summoner/v4/summoners/by-puuid/{puuid}"
        
        logger.info(f"Fetching summoner: {puuid} in region {region} from platform URL: {platform_url}")
        
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
    async def get_league_entries(self, puuid: str, region: str = "EUW") -> List[LeagueEntry]:
        """
        Retrieves league entries for a summoner
        
        Args:
            puuid: Player PUUID
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            List[LeagueEntry]: List of rankings
        """
        self._rate_limit_wait()
    
        platform_url = self.get_platform_base_url(region)
        print(f"Fetching rankings for PUUID: {puuid} in region {region}")
        url = f"{platform_url}/lol/league/v4/entries/by-puuid/{puuid}"

        logger.info(f"Fetching rankings: {puuid} in region {region} from platform URL: {platform_url}")

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
    async def get_complete_player_info(self, summoner_name: str, tag_line: str, region: str = "EUW") -> Dict[str, Any]:
        """
        Retrieves all player information
        
        Args:
            summoner_name: Summoner name
            tag_line: Tag line
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            Dict containing all player information
        """
        try:
            # 1. Get Riot account
            account = await self.get_account_by_riot_id(summoner_name, tag_line, region)
            
            # 2. Get summoner info
            summoner = await self.get_summoner_by_puuid(account.puuid, region)
            
            # 3. Get rankings
            league_entries = await self.get_league_entries(summoner.puuid, region)
            logger.info(f"Complete information retrieved for {summoner_name}#{tag_line} in region {region}")
            
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
    
    # Fetch match history by PUUID
    async def get_match_history(self, puuid: str, region: str = "EUW", start: int = 0, count: int = 20) -> List[str]:
        """
        Retrieves match history (list of match IDs) for a player
        
        Args:
            puuid: Player PUUID
            region: Region code (e.g., "EUW", "NA", "KR")
            start: Start index (defaults to 0)
            count: Number of match IDs to return (defaults to 20, max 100)
            
        Returns:
            List[str]: List of match IDs
        """
        self._rate_limit_wait()
        
        regional_url = self.get_regional_base_url(region)
        url = f"{regional_url}/lol/match/v5/matches/by-puuid/{puuid}/ids"
        
        # Add query parameters
        params = {
            "start": start,
            "count": min(count, 100)  # Cap at 100 as per API limit
        }
        
        logger.info(f"Fetching match history: {puuid} in region {region} (start={start}, count={count})")
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            self._handle_response_errors(response)
            
            data = response.json()
            print(f"Match history API response data: {data}")  # Debug
            logger.info(f"Match history API response: {len(data)} matches found")
            return data
            
        except requests.exceptions.Timeout:
            raise RiotApiException("API request timeout", 408)
        except requests.exceptions.RequestException as e:
            raise RiotApiException(f"Connection error: {str(e)}")
    
    # Fetch match details by match ID
    async def get_match_details(self, match_id: str, region: str = "EUW") -> Dict[str, Any]:
        """
        Retrieves detailed match information by match ID
        
        Args:
            match_id: Match ID (e.g., "EUW1_7460265918")
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            Dict: Complete match data
        """
        self._rate_limit_wait()
        
        regional_url = self.get_regional_base_url(region)
        url = f"{regional_url}/lol/match/v5/matches/{match_id}"
        
        logger.info(f"Fetching match details for: {match_id} in region {region} from regional URL: {regional_url}")
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            self._handle_response_errors(response)
            
            data = response.json()
            logger.info(f"Match details API response: Match {match_id} retrieved successfully")
            return data
            
        except requests.exceptions.Timeout:
            raise RiotApiException("API request timeout", 408)
        except requests.exceptions.RequestException as e:
            raise RiotApiException(f"Connection error: {str(e)}")
    
    def get_platform_base_url(self, region: str) -> str:
        """
        Get the platform base URL for a specific region (pour données spécifiques au serveur)
        
        Args:
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            str: Platform base URL for the region
        """
        if region not in self.platform_endpoints:
            raise ValueError(f"Unsupported region: {region}. Supported regions: {list(self.platform_endpoints.keys())}")
        
        return self.platform_endpoints[region]
    
    def get_regional_base_url(self, region: str) -> str:
        """
        Get the regional base URL for a specific region (pour données centralisées)
        
        Args:
            region: Region code (e.g., "EUW", "NA", "KR")
            
        Returns:
            str: Regional base URL for the region
        """
        if region not in self.regional_endpoints:
            raise ValueError(f"Unsupported region: {region}. Supported regions: {list(self.regional_endpoints.keys())}")
        
        return self.regional_endpoints[region]


# Global client instance
riot_client = RiotApiClient()

