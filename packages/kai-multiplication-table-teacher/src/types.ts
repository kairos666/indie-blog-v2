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
 * a question descriptor (for direct answers without response prompts)
 */
export type MTableDirectQuestionEntry = {

}

/**
 * a question descriptor (without multiple response prompts, one right the rest wrong)
 */
export type MTableMultipleChoicesQuestionEntry = MTableDirectQuestionEntry & {

}

/**
 * a full multiplication table for one integer ex: toute la table de 3
 */
export type MTable = MTableEntry[];

/**
 * multiple multiplication tables ex: les tables de 1, 2, 5, 9
 */
export type MultiMTable = MTable[];