import { expectedScore, monoMatchCalculator, multiMatchCalculator, scoreDifferential } from "./elo-engine";
import { fixedKFactorRuleBuilder, adaptToPlayerRankKFactorRuleBuilder } from "./elo-kfactor-rules";
import { EloRankingBoard as EloRankingBoard_InMemory } from "./elo-ranks-board-in-memory";
export declare const EloEngine: {
    expectedScore: typeof expectedScore;
    scoreDifferential: typeof scoreDifferential;
    monoMatchCalculator: typeof monoMatchCalculator;
    multiMatchCalculator: typeof multiMatchCalculator;
};
export declare const EloRankingBoardInMemory: typeof EloRankingBoard_InMemory;
export declare const fixedKFactorRuleMaker: typeof fixedKFactorRuleBuilder;
export declare const adaptToPlayerRankKFactorRuleMaker: typeof adaptToPlayerRankKFactorRuleBuilder;
