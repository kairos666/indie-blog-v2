import { MTable, MTableMultipleChoicesQuestionEntry, MultiMTable, TableConfig, TableMultipleChoicesConfig } from "../src/types";
import { multiplicationTableBatchQuestionsBuilder, multiplicationTableBuilder } from "../src/index";
import { isEqual } from "lodash";

describe("kai-multiplication-table-teacher", () => {
    const configAlternativeA:TableConfig = {
        maxMultiplicator: 12,
        isShuffled: false
    }
    const configAlternativeB:TableConfig = {
        maxMultiplicator: 10,
        isShuffled: true
    }
    const configQuestionAlternative:TableMultipleChoicesConfig = {
        proposalCount: 8,
        proposalVariationAmplitude: 15
    }
    const configQuestionImpossibleToFulfillAlternative:TableMultipleChoicesConfig = {
        proposalCount: 10,
        proposalVariationAmplitude: 3
    }
    const expectedTable1Results:MTable = [
        { mainParam: 1, multiplicator: 1, result: 1 },
        { mainParam: 1, multiplicator: 2, result: 2 },
        { mainParam: 1, multiplicator: 3, result: 3 },
        { mainParam: 1, multiplicator: 4, result: 4 },
        { mainParam: 1, multiplicator: 5, result: 5 },
        { mainParam: 1, multiplicator: 6, result: 6 },
        { mainParam: 1, multiplicator: 7, result: 7 },
        { mainParam: 1, multiplicator: 8, result: 8 },
        { mainParam: 1, multiplicator: 9, result: 9 },
        { mainParam: 1, multiplicator: 10, result: 10 },
        { mainParam: 1, multiplicator: 11, result: 11 },
        { mainParam: 1, multiplicator: 12, result: 12 }
    ];
    const expectedTable5Results:MTable = [
        { mainParam: 5, multiplicator: 1, result: 5 },
        { mainParam: 5, multiplicator: 2, result: 10 },
        { mainParam: 5, multiplicator: 3, result: 15 },
        { mainParam: 5, multiplicator: 4, result: 20 },
        { mainParam: 5, multiplicator: 5, result: 25 },
        { mainParam: 5, multiplicator: 6, result: 30 },
        { mainParam: 5, multiplicator: 7, result: 35 },
        { mainParam: 5, multiplicator: 8, result: 40 },
        { mainParam: 5, multiplicator: 9, result: 45 },
        { mainParam: 5, multiplicator: 10, result: 50 },
        { mainParam: 5, multiplicator: 11, result: 55 },
        { mainParam: 5, multiplicator: 12, result: 60 }
    ];
    const expectedTable9Results:MTable = [
        { mainParam: 9, multiplicator: 1, result: 9 },
        { mainParam: 9, multiplicator: 2, result: 18 },
        { mainParam: 9, multiplicator: 3, result: 27 },
        { mainParam: 9, multiplicator: 4, result: 36 },
        { mainParam: 9, multiplicator: 5, result: 45 },
        { mainParam: 9, multiplicator: 6, result: 54 },
        { mainParam: 9, multiplicator: 7, result: 63 },
        { mainParam: 9, multiplicator: 8, result: 72 },
        { mainParam: 9, multiplicator: 9, result: 81 },
        { mainParam: 9, multiplicator: 10, result: 90 },
        { mainParam: 9, multiplicator: 11, result: 99 },
        { mainParam: 9, multiplicator: 12, result: 108 }
    ];

    describe("multiplicationTableBuilder", () => {
        // tests for mono table value call signature
        describe("MONO table signature", () => {
            it(`generate correct multiplication table structure and values for 1`, () => {
                const results:MTable = multiplicationTableBuilder(1);
                expect(results).toEqual(expectedTable1Results.slice(0, 10));
            });
            it(`generate correct multiplication table structure and values for 5`, () => {
                const results:MTable = multiplicationTableBuilder(5);
                expect(results).toEqual(expectedTable5Results.slice(0, 10));
            });
            it(`generate correct multiplication table structure and values for 9`, () => {
                const results:MTable = multiplicationTableBuilder(9);
                expect(results).toEqual(expectedTable9Results.slice(0, 10));
            });
            it(`apply maxMultiplicator config correctly applied`, () => {
                const results:MTable = multiplicationTableBuilder(9, configAlternativeA);
                expect(results).toEqual(expectedTable9Results);
            });
            it(`apply shuffle config correctly applied`, () => {
                // check that deep equality is wrong (because of shuffled entries)
                const results:MTable = multiplicationTableBuilder(9, configAlternativeB);
                expect(results).not.toEqual(expectedTable9Results.slice(0, 10));

                // check there is exactly the correct number of entries
                expect(results.length).toBe(10);

                // check that all entries exists
                const hasAllEntries:boolean = expectedTable9Results.slice(0, 10).every(expectedEntry => {
                    const resultEntryMatch = results.find(resultEntry => isEqual(resultEntry, expectedEntry));

                    return !!resultEntryMatch;
                });
                expect(hasAllEntries).toBeTruthy();
            });
            it(`throw error for 0`, () => {
                expect(() => {
                    multiplicationTableBuilder(0);
                }).toThrow();
            });
            it(`throw error for -1`, () => {
                expect(() => {
                    multiplicationTableBuilder(-1);
                }).toThrow();
            });
            it(`throw error for float numbers`, () => {
                expect(() => {
                    multiplicationTableBuilder(3.14);
                }).toThrow();
            });
        });

        // tests for multi table value call signature
        describe("MULTI table signature", () => {
            it(`generate correct multiplication table structure and values for [1]`, () => {
                const results:MultiMTable = multiplicationTableBuilder([1]);
                expect(results).toEqual([expectedTable1Results.slice(0, 10)]);
            });
            it(`generate correct multiplication table structure and values for [1, 9]`, () => {
                const results:MultiMTable = multiplicationTableBuilder([1, 9]);
                expect(results).toEqual([expectedTable1Results.slice(0, 10), expectedTable9Results.slice(0, 10)]);
            });
            it(`generate correct multiplication table structure and values for [1, 5, 9]`, () => {
                const results:MultiMTable = multiplicationTableBuilder([1, 5, 9]);
                expect(results).toEqual([expectedTable1Results.slice(0, 10), expectedTable5Results.slice(0, 10), expectedTable9Results.slice(0, 10)]);
            });
            it(`apply maxMultiplicator config correctly applied`, () => {
                const results:MultiMTable = multiplicationTableBuilder([1, 9], configAlternativeA);
                expect(results).toEqual([expectedTable1Results, expectedTable9Results]);
            });
            it(`apply shuffle config correctly applied`, () => {
                /**
                 * inner table shuffling is already covered by MONO test, only check if tables order is also shuffled
                 */
                const orderedResult = [expectedTable1Results.slice(0, 10), expectedTable5Results.slice(0, 10), expectedTable9Results.slice(0, 10)];

                // check that deep equality is wrong (because of shuffled entries)
                const results:MultiMTable = multiplicationTableBuilder([1, 5, 9], configAlternativeB);
                expect(results).not.toEqual(orderedResult);

                // check there is exactly the correct number of entries
                expect(results.length).toBe(orderedResult.length);

                // check that all entries exists
                const hasAllEntries:boolean = orderedResult.every(expectedEntry => {
                    const resultEntryMatch = results.find(resultEntry => (resultEntry[0].mainParam === expectedEntry[0].mainParam));

                    return !!resultEntryMatch;
                });
                expect(hasAllEntries).toBeTruthy();
            });
            it(`throw error for [0, 1]`, () => {
                expect(() => {
                    multiplicationTableBuilder([0, 1]);
                }).toThrow();
            });
            it(`throw error for [1, -1]`, () => {
                expect(() => {
                    multiplicationTableBuilder([1, -1]);
                }).toThrow();
            });
            it(`throw error for float numbers`, () => {
                expect(() => {
                    multiplicationTableBuilder([0, 3.14]);
                }).toThrow();
            });
        });
	});

    describe("multiplicationTableBatchQuestionsBuilder", () => {
        it(`support MONO table as input parameter`, () => {
            expect(() => {
                multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder(1));
            }).not.toThrow();
        });
        it(`support MULTI table as input parameter`, () => {
            expect(() => {
                multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]));
            }).not.toThrow();
        });
        it(`generate shuffled questions (shuffle check, even if input is ordered)`, () => {
            // MONO
            const inputMonoTable = multiplicationTableBuilder(1);
            const outputMonoTable = multiplicationTableBatchQuestionsBuilder(inputMonoTable);

            // delete choices to allow comparison
            const noChoicesOutputMonoTable = (outputMonoTable as any).reduce((acc:Partial<MTableMultipleChoicesQuestionEntry>[], curr:Partial<MTableMultipleChoicesQuestionEntry>) => {
                const cloneEntryWithoutChoice = {...curr};
                delete cloneEntryWithoutChoice?.choices;

                return [...acc, cloneEntryWithoutChoice];
            }, []);

            // check that deep equality is wrong (because of shuffled entries)
            expect(noChoicesOutputMonoTable).not.toEqual(inputMonoTable);

            // check there is exactly the correct number of entries
            expect(inputMonoTable.length).toBe(outputMonoTable.length);

            // check that all entries exists
            const hasAllMonoEntries:boolean = inputMonoTable.every(expectedEntry => {
                const resultEntryMatch = noChoicesOutputMonoTable.find((resultEntry:Partial<MTableMultipleChoicesQuestionEntry>) => ((resultEntry.mainParam === expectedEntry.mainParam) && (resultEntry.multiplicator === expectedEntry.multiplicator) && (resultEntry.result === expectedEntry.result)));

                return !!resultEntryMatch;
            });
            expect(hasAllMonoEntries).toBeTruthy();
            
            // MULTI
            const inputMultiTable = multiplicationTableBuilder([1, 5, 9]);
            const outputMultiTable = multiplicationTableBatchQuestionsBuilder(inputMultiTable);
            const flattenedInputMultiTable = inputMultiTable.reduce((acc, curr) => {
                return [...acc, ...curr];
            }, []);

            // delete choices to allow comparison
            const noChoicesOutputMultiTable = (outputMultiTable as any).reduce((acc:Partial<MTableMultipleChoicesQuestionEntry>[], curr:Partial<MTableMultipleChoicesQuestionEntry>) => {
                const cloneEntryWithoutChoice = {...curr};
                delete cloneEntryWithoutChoice?.choices;

                return [...acc, cloneEntryWithoutChoice];
            }, []);

            // check that deep equality is wrong (because of shuffled entries)
            expect(noChoicesOutputMultiTable).not.toEqual(flattenedInputMultiTable);

            // check there is exactly the correct number of entries
            expect(flattenedInputMultiTable.length).toBe(outputMultiTable.length);

            // check that all entries exists
            const hasAllMultiEntries:boolean = flattenedInputMultiTable.every(expectedEntry => {
                const resultEntryMatch = noChoicesOutputMultiTable.find((resultEntry:Partial<MTableMultipleChoicesQuestionEntry>) => ((resultEntry.mainParam === expectedEntry.mainParam) && (resultEntry.multiplicator === expectedEntry.multiplicator) && (resultEntry.result === expectedEntry.result)));

                return !!resultEntryMatch;
            });
            expect(hasAllMultiEntries).toBeTruthy();
        });
        it(`correct choice appears once and only once (correct choice check)`, () => {
            const questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]));

            // correct if all questions have exactly one RIGHT answer
            const isResultAppearingOnce:boolean = questions.every(questionEntry => {
                const filterChoicesRightAnswsers = questionEntry.choices.filter(proposal => proposal === questionEntry.result);

                // correct when the correct answer appears only once
                return (filterChoicesRightAnswsers.length === 1);
            });

            expect(isResultAppearingOnce).toBeTruthy();
        });
        it(`generate correct choices count for each entries (count check)`, () => {
            const questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]), configQuestionAlternative);

            // correct if all questions have exactly "proposalCount" choices
            const isProposalCountCorrect:boolean = questions.every(questionEntry => (questionEntry.choices.length === configQuestionAlternative.proposalCount));

            expect(isProposalCountCorrect).toBeTruthy();
        });
        it(`generate only valid choices for each entries (amplitude check)`, () => {
            const questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]), configQuestionAlternative);

            // correct if all questions have all their choices inside "proposalVariationAmplitude" brackets
            const isProposalAmplitudeCorrect:boolean = questions.every(questionEntry => {
                const minProposal:number = questionEntry.result - configQuestionAlternative.proposalVariationAmplitude;
                const maxProposal:number = questionEntry.result + configQuestionAlternative.proposalVariationAmplitude;

                return questionEntry.choices.every(proposal => ((minProposal <= proposal) && (proposal <= maxProposal)));
            });

            expect(isProposalAmplitudeCorrect).toBeTruthy();
        });
        it(`generate only valid choices for each entries (integers only check)`, () => {
            const questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]));

            // correct if all questions have all integers choices
            const isProposalsIntegersOnly:boolean = questions.every(questionEntry => {
                return questionEntry.choices.every(proposal => Number.isInteger(proposal));
            });
            
            expect(isProposalsIntegersOnly).toBeTruthy();
        });
        it(`generate only valid choices for each entries (positive and not zero values)`, () => {
            const questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]));

            // correct if all questions positive and 1+ values
            const isProposalsNonZeroPositive:boolean = questions.every(questionEntry => {
                return questionEntry.choices.every(proposal => (proposal >= 1));
            });
            
            expect(isProposalsNonZeroPositive).toBeTruthy();
        });
        it(`generate unique choices for each entries (choice duplication check)`, () => {
            const questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]));

            // correct if all questions have unique choices
            const isProposalUniqueAlways:boolean = questions.every(questionEntry => {
                return (new Set(questionEntry.choices)).size === questionEntry.choices.length;
            });

            expect(isProposalUniqueAlways).toBeTruthy();
        });
        it(`safely execute in case amplitude and count is impossible to fulfill (execution ends in a satisfying way without stack overflow error)`, () => {
            expect(() => {
                multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder([1, 5, 9]), configQuestionImpossibleToFulfillAlternative);
            }).not.toThrow();
        });
    });
});