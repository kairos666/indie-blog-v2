import { KFactorRule } from "./types";
export declare function rangeDescriptorParser(range: string): [{
    lowerBoundValue: number;
    isIncluded: boolean;
}, {
    upperBoundValue: number;
    isIncluded: boolean;
}];
/**
 * K FACTOR RULE
 * STRATEGIES CATALOGUE
 *
 * you can always provide your own custom strategy by providing a custom KFactorRule function
 */
/**
 * always return the same K factor value
 * @param kFactorValue
 * @returns
 */
export declare function fixedKFactorRuleBuilder(kFactorValue: number): KFactorRule;
/**
 * return k factor value based on player rank
 * range examples
 * range = (0,2100), between 0 and 2100
 * range = [2100,2400), between 2100 (excluded) and 2400 (included)
 * range = [2400,2600], between 2400 (excluded) and 2600 (excluded)
 * @param kFactorStages
 */
export declare function adaptToPlayerRankKFactorRuleBuilder(kFactorStages: {
    kFactorValue: number;
    range: string;
}[]): KFactorRule;
