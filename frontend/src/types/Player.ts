export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface SummonerInfo {
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface MiniSeries {
  losses: number;
  progress: string;
  target: number;
  wins: number;
}

export interface LeagueEntry {
  leagueId?: string;
  puuid: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries?: MiniSeries;
}

export interface PlayerData {
  account: RiotAccount;
  summoner: SummonerInfo;
  rankings: LeagueEntry[];
}
