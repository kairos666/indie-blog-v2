import { IEloRankingBoard } from "./interfaces";
import { KFactorRule, Match, MatchOutcome, Player } from "./types";
export declare abstract class AEloRankingBoard implements IEloRankingBoard {
    private _initialRank;
    private _kFactorRule;
    constructor(initialRank: number, kFactorRule: KFactorRule);
    abstract createPlayer(player?: any): Player;
    abstract deletePlayer(playerId: number): void;
    abstract getPlayer(playerId: number): Player | null;
    abstract getAllPlayers(): Player[];
    abstract getAllMatches(): Match[];
    abstract getPlayerMatches(playerId: number): Match[];
    abstract getMatch(matchId: number): Match | null;
    abstract createMatch(match: {
        playerAId: number;
        playerBId: number;
        matchOutcome: MatchOutcome;
    }): Match;
    abstract getMatchExpectancy(playerAId: number, playerBId: number): number;
    get initialRank(): number;
    set initialRank(newInitialRank: number);
    get kFactorRule(): KFactorRule;
    set kFactorRule(newkFactorRule: KFactorRule);
}
