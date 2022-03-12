import { AEloRankingBoard } from "./abstract-elo-ranks-board";
import { KFactorRule, MatchOutcome, Player } from "./types";
export declare class EloRankingBoard extends AEloRankingBoard {
    private _players;
    private _matches;
    constructor(initialRank: number, kFactorRule: KFactorRule);
    private _getPlayer;
    createPlayer(player?: any): Player;
    deletePlayer(playerId: number): void;
    getPlayer(playerId: number): {
        matches: number[];
        id: number;
        creationDate: number;
        lastPlayed: number;
        initialRank: number;
        currentRank: number;
    } | null;
    getAllPlayers(): {
        id: number;
        creationDate: number;
        lastPlayed: number;
        initialRank: number;
        currentRank: number;
        matches: number[];
    }[];
    getAllMatches(): {
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
    }[];
    getPlayerMatches(playerId: number): {
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
    }[];
    getMatch(matchId: number): {
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
    } | null;
    createMatch(match: {
        playerAId: number;
        playerBId: number;
        matchOutcome: MatchOutcome;
    }): {
        playerAId: number;
        playerBId: number;
        matchOutcome: MatchOutcome;
        id: number;
        creationDate: number;
        resolutionDate: number;
        playerARank: number;
        playerBRank: number;
        playerAKFactor: number;
        playerBKFactor: number;
    };
    getMatchExpectancy(playerAId: number, playerBId: number): number;
}
