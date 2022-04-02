export declare type MatchOutcome = 0 | 1 | 0.5;
export declare type PlayersEloRanks = {
    playerRank: number;
    opponentRank: number;
};
export declare type ScoreDifferentialParams = {
    actualScore: number;
    expectedScore: number;
    kFactor: number;
};
export declare type MatchDescriptor = {
    playerRank: number;
    playerKFactor: number;
    opponentRank: number;
    opponentKFactor: number;
    matchOutcome: MatchOutcome;
};
export declare type MatchResultDescriptor = {
    player: {
        initialRank: number;
        newRank: number;
        rankDiff: number;
    };
    opponent: {
        initialRank: number;
        newRank: number;
        rankDiff: number;
    };
};
export declare type MultiMatchDescriptor = {
    playerRank: number;
    playerKFactor: number;
    matchesSetup: Array<{
        opponentRank: number;
        matchOutcome: MatchOutcome;
    }>;
};
export declare type MultiMatchResultDescriptor = {
    initialRank: number;
    newRank: number;
    rankDiff: number;
};
export declare type KFactorRule = (player: Player) => number;
export declare type Player = {
    id: number;
    creationDate: number;
    lastPlayed: number;
    initialRank: number;
    currentRank: number;
    matches: number[];
    meta?: any;
};
export declare type Match = {
    id: number;
    creationDate: number;
    resolutionDate: number;
    playerAId: number;
    playerBId: number;
    playerARank: number;
    playerBRank: number;
    playerAKFactor: number;
    playerBKFactor: number;
    matchOutcome: MatchOutcome;
};
