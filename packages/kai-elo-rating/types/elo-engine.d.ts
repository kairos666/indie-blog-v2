import { MatchDescriptor, MatchResultDescriptor, MultiMatchDescriptor, MultiMatchResultDescriptor, PlayersEloRanks, ScoreDifferentialParams } from './types';
/**
 * A player's expected score is their probability of winning plus half their probability of drawing. Thus, an expected score of 0.75 could represent a 75% chance of winning, 25% chance of losing, and 0% chance of drawing. On the other extreme it could represent a 50% chance of winning, 0% chance of losing, and 50% chance of drawing.
 * @param playersEloRanks
 * @returns expected score (0 - 1)
 */
export declare function expectedScore(playersEloRanks: PlayersEloRanks): number;
/**
 * Evaluates the elo rank shift that happens based on players ranks, match outcome and K factor
 * @param params object parameters: actualScore = match(es) score outcome, expectedScore = theoritical match(es) score outcome, kFactor - maximum score adjustment per game
 * @returns score variations to be applied to player ranking
 */
export declare function scoreDifferential(params: ScoreDifferentialParams): number;
/**
 * Evaluate player and opponent ELO rank change after match is decided
 * @param matchDescriptor player and opponent match full descriptor
 * @returns player and opponent change in ranks post match
 */
export declare function monoMatchCalculator(matchDescriptor: MatchDescriptor): MatchResultDescriptor;
/**
 * Calculate ELO ranking changes for multi matches sequence (only considers players rank shift and act as average rank change for average performance)
 * @param matchDescriptors - all necessary info for multi match palyer ranking calculation
 * @returns rank change details
 */
export declare function multiMatchCalculator(matchDescriptors: MultiMatchDescriptor): MultiMatchResultDescriptor;
