from pydantic import BaseModel
from typing import Optional, Union, List, Dict, Any
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
    data: Optional[Union[Dict[str, Any], List[Any], str, int]] = None
    error: Optional[str] = None
    status_code: Optional[int] = None


class ObjectiveDto(BaseModel):
    """Model for objective information"""
    first: bool
    kills: int


class ObjectivesDto(BaseModel):
    """Model for team objectives"""
    baron: ObjectiveDto
    champion: ObjectiveDto
    dragon: ObjectiveDto
    horde: ObjectiveDto
    inhibitor: ObjectiveDto
    riftHerald: ObjectiveDto
    tower: ObjectiveDto


class BanDto(BaseModel):
    """Model for champion bans"""
    championId: int
    pickTurn: int


class TeamDto(BaseModel):
    """Model for team information"""
    bans: List[BanDto]
    objectives: ObjectivesDto
    teamId: int
    win: bool


class PerkStatsDto(BaseModel):
    """Model for perk stats"""
    defense: int
    flex: int
    offense: int


class PerkStyleSelectionDto(BaseModel):
    """Model for perk style selection"""
    perk: int
    var1: int
    var2: int
    var3: int


class PerkStyleDto(BaseModel):
    """Model for perk style"""
    description: str
    selections: List[PerkStyleSelectionDto]
    style: int


class PerksDto(BaseModel):
    """Model for perks"""
    statPerks: PerkStatsDto
    styles: List[PerkStyleDto]


class ChallengesDto(BaseModel):
    """Model for challenges (simplified - only key stats)"""
    kda: Optional[float] = None
    killParticipation: Optional[float] = None
    soloKills: Optional[int] = None
    takedowns: Optional[int] = None
    teamDamagePercentage: Optional[float] = None
    visionScorePerMinute: Optional[float] = None


class ParticipantDto(BaseModel):
    """Model for match participant"""
    assists: int
    baronKills: int
    bountyLevel: int
    champExperience: int
    champLevel: int
    championId: int
    championName: str
    championTransform: int
    consumablesPurchased: int
    damageDealtToBuildings: int
    damageDealtToObjectives: int
    damageDealtToTurrets: int
    damageSelfMitigated: int
    deaths: int
    detectorWardsPlaced: int
    doubleKills: int
    dragonKills: int
    firstBloodAssist: bool
    firstBloodKill: bool
    firstTowerAssist: bool
    firstTowerKill: bool
    gameEndedInEarlySurrender: bool
    gameEndedInSurrender: bool
    goldEarned: int
    goldSpent: int
    individualPosition: str
    inhibitorKills: int
    inhibitorTakedowns: int
    inhibitorsLost: int
    item0: int
    item1: int
    item2: int
    item3: int
    item4: int
    item5: int
    item6: int
    itemsPurchased: int
    killingSprees: int
    kills: int
    lane: str
    largestCriticalStrike: int
    largestKillingSpree: int
    largestMultiKill: int
    longestTimeSpentLiving: int
    magicDamageDealt: int
    magicDamageDealtToChampions: int
    magicDamageTaken: int
    neutralMinionsKilled: int
    nexusKills: int
    nexusLost: int
    nexusTakedowns: int
    objectivesStolen: int
    objectivesStolenAssists: int
    participantId: int
    pentaKills: int
    perks: PerksDto
    physicalDamageDealt: int
    physicalDamageDealtToChampions: int
    physicalDamageTaken: int
    profileIcon: int
    puuid: str
    quadraKills: int
    riotIdGameName: str
    riotIdTagline: str
    role: str
    sightWardsBought: int
    spell1Casts: int
    spell2Casts: int
    spell3Casts: int
    spell4Casts: int
    summoner1Casts: int
    summoner1Id: int
    summoner2Casts: int
    summoner2Id: int
    summonerId: str
    summonerLevel: int
    summonerName: str
    teamEarlySurrendered: bool
    teamId: int
    teamPosition: str
    timeCCingOthers: int
    timePlayed: int
    totalDamageDealt: int
    totalDamageDealtToChampions: int
    totalDamageShieldedOnTeammates: int
    totalDamageTaken: int
    totalHeal: int
    totalHealsOnTeammates: int
    totalMinionsKilled: int
    totalTimeCCDealt: int
    totalTimeSpentDead: int
    totalUnitsHealed: int
    tripleKills: int
    trueDamageDealt: int
    trueDamageDealtToChampions: int
    trueDamageTaken: int
    turretKills: int
    turretTakedowns: int
    turretsLost: int
    unrealKills: int
    visionScore: int
    visionWardsBought: int
    wardsKilled: int
    wardsPlaced: int
    win: bool
    challenges: Optional[ChallengesDto] = None
    placement: Optional[int] = None  # Arena placement (1-8)


class MatchInfoDto(BaseModel):
    """Model for match info"""
    gameCreation: int
    gameDuration: int
    gameEndTimestamp: int
    gameId: int
    gameMode: str
    gameName: str
    gameStartTimestamp: int
    gameType: str
    gameVersion: str
    mapId: int
    participants: List[ParticipantDto]
    platformId: str
    queueId: int
    teams: List[TeamDto]
    tournamentCode: Optional[str] = None


class MatchMetadataDto(BaseModel):
    """Model for match metadata"""
    dataVersion: str
    matchId: str
    participants: List[str]


class MatchDto(BaseModel):
    """Model for complete match data"""
    metadata: MatchMetadataDto
    info: MatchInfoDto
