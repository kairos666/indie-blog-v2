import { MTable, MultiMTable, TableConfig } from "../src/types";
import { multiplicationTableBuilder } from "../src/index";
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
});