/**
 * a specific entry descriptor in a multiplication table
 */
export type MTableEntry = {
    mainParam: number,
    multiplicator: number,
    result: number
}

/**
 * config object for common config details (how far does multiplications must go, should results be randomized)
 */
export type TableConfig = {
    maxMultiplicator: number,
    isShuffled: boolean
}

/**
 * config object for multiple choices building parameters (how many proposal, amplitude of variations)
 * TIPS: to avoid issues select a proposal count way lower than amplitude to have enough room to generate enough choices
 */
export type TableMultipleChoicesConfig = {
    proposalCount: number,
    proposalVariationAmplitude: number
}

/**
 * a question descriptor (without multiple response prompts, one right the rest wrong)
 */
export type MTableMultipleChoicesQuestionEntry = MTableEntry & {
    choices: number[]
}

/**
 * a full multiplication table for one integer ex: toute la table de 3
 */
export type MTable = MTableEntry[];

/**
 * multiple multiplication tables ex: les tables de 1, 2, 5, 9
 */
export type MultiMTable = MTable[];