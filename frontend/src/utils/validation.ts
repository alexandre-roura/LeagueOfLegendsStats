import { z } from "zod";

// =====================================
// VALIDATION SCHEMAS
// =====================================

// Regions supportées par Riot Games
export const RegionSchema = z.enum([
  "EUW",
  "NA",
  "KR",
  "EUNE",
  "BR",
  "JP",
  "LAN",
  "LAS",
  "OCE",
  "RU",
  "TR",
] as const);

// Paramètres de recherche de joueur
export const SearchParamsSchema = z.object({
  name: z
    .string()
    .min(1, "Summoner name is required")
    .max(16, "Summoner name cannot exceed 16 characters")
    .regex(/^[a-zA-Z0-9\s]+$/, "Invalid characters in summoner name"),
  tag: z
    .string()
    .min(2, "Tag must be at least 2 characters")
    .max(5, "Tag cannot exceed 5 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Tag can only contain letters and numbers"),
  region: RegionSchema,
});

// URL Parameters pour SummonerPage
export const SummonerUrlParamsSchema = z.object({
  region: RegionSchema,
  nameTag: z
    .string()
    .min(1, "Invalid name-tag format")
    .regex(/^.+-[a-zA-Z0-9]+$/, "Invalid name-tag format (should be Name-Tag)"),
});

// =====================================
// API RESPONSE SCHEMAS
// =====================================

// Validation des réponses Riot API
export const RankedStatsSchema = z.object({
  queueType: z.string(),
  tier: z.string(),
  rank: z.string(),
  leaguePoints: z.number(),
  wins: z.number(),
  losses: z.number(),
  veteran: z.boolean().optional(),
  inactive: z.boolean().optional(),
  freshBlood: z.boolean().optional(),
  hotStreak: z.boolean().optional(),
});

export const SummonerSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  puuid: z.string(),
  name: z.string(),
  profileIconId: z.number(),
  revisionDate: z.number(),
  summonerLevel: z.number(),
});

export const PlayerDataSchema = z.object({
  summoner: SummonerSchema,
  rankedStats: z.array(RankedStatsSchema),
  account: z.object({
    puuid: z.string(),
    gameName: z.string(),
    tagLine: z.string(),
  }),
});

// Match participant validation
export const ParticipantSchema = z.object({
  puuid: z.string(),
  summonerName: z.string(),
  championName: z.string(),
  championId: z.number(),
  teamId: z.number(),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  win: z.boolean(),
  item0: z.number(),
  item1: z.number(),
  item2: z.number(),
  item3: z.number(),
  item4: z.number(),
  item5: z.number(),
  item6: z.number(),
  summoner1Id: z.number(),
  summoner2Id: z.number(),
});

export const MatchInfoSchema = z.object({
  gameId: z.number(),
  gameMode: z.string(),
  gameType: z.string(),
  mapId: z.number(),
  queueId: z.number(),
  gameVersion: z.string(),
  gameDuration: z.number(),
  gameCreation: z.number(),
  participants: z.array(ParticipantSchema),
});

export const MatchDtoSchema = z.object({
  metadata: z.object({
    matchId: z.string(),
    participants: z.array(z.string()),
  }),
  info: MatchInfoSchema,
});

// =====================================
// UTILITY TYPES
// =====================================

export type Region = z.infer<typeof RegionSchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type SummonerUrlParams = z.infer<typeof SummonerUrlParamsSchema>;
export type PlayerData = z.infer<typeof PlayerDataSchema>;
export type MatchDto = z.infer<typeof MatchDtoSchema>;
export type RankedStats = z.infer<typeof RankedStatsSchema>;

// =====================================
// VALIDATION HELPERS
// =====================================

export function validateSearchParams(data: unknown): SearchParams {
  return SearchParamsSchema.parse(data);
}

export function validatePlayerData(data: unknown): PlayerData {
  return PlayerDataSchema.parse(data);
}

export function validateMatchData(data: unknown): MatchDto {
  return MatchDtoSchema.parse(data);
}

// Parse name-tag URL parameter
export function parseNameTag(nameTag: string): { name: string; tag: string } {
  const lastDashIndex = nameTag.lastIndexOf("-");
  if (lastDashIndex === -1) {
    throw new Error("Invalid name-tag format");
  }

  const name = nameTag.substring(0, lastDashIndex);
  const tag = nameTag.substring(lastDashIndex + 1);

  // Validate the parsed parts
  const result = SearchParamsSchema.pick({ name: true, tag: true }).parse({
    name,
    tag,
  });
  return result;
}
