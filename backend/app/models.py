from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RiotAccount(BaseModel):
    """Model for a Riot Games account"""
    puuid: str
    gameName: str
    tagLine: str


class SummonerInfo(BaseModel):
    """Model for summoner information"""
    puuid: str
    profileIconId: int
    revisionDate: int
    summonerLevel: int


class MiniSeries(BaseModel):
    """Model for a mini-series (promotion series)"""
    losses: int
    progress: str
    target: int
    wins: int


class LeagueEntry(BaseModel):
    """Model for a league entry (ranking information)"""
    leagueId: Optional[str] = None
    puuid: str
    queueType: str
    tier: str
    rank: str
    leaguePoints: int
    wins: int
    losses: int
    hotStreak: bool = False
    veteran: bool = False
    freshBlood: bool = False
    inactive: bool = False
    miniSeries: Optional[MiniSeries] = None


class ApiResponse(BaseModel):
    """Generic model for API responses"""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    status_code: Optional[int] = None
