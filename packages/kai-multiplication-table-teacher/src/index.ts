import { MTable, MTableEntry, MTableMultipleChoicesQuestionEntry, MultiMTable, TableConfig, TableMultipleChoicesConfig } from "./types";
import { shuffle } from "lodash";

const defaultTableConfig:TableConfig = {
	maxMultiplicator: 10,
    isShuffled: false
}

const defaultTableMultipleChoicesConfig:TableMultipleChoicesConfig = {
	proposalCount: 6,
    proposalVariationAmplitude: 20
}

/**
 * get representation of multiplication table - for display purposes
 * @param tableMainParam 
 * @param config 
 */
export function multiplicationTableBuilder(tableMainParam:number, config?:TableConfig):MTable
export function multiplicationTableBuilder(tableMainParam:number[], config?:TableConfig):MultiMTable;
export function multiplicationTableBuilder(tableMainParam:number|number[], config:TableConfig = defaultTableConfig):MTable|MultiMTable {
	// mono table utility function
	function monoMultiplicationTableBuilderFunc(mainParam:number):MTable {
		// catch floats or 0 or negative params
		if(mainParam < 1 || Math.round(mainParam) !== mainParam) throw new Error(`multiplicationTableBuilder - invalid tableMainParam or tablesMainParam, this should be an integer greater or equal to 1. Received: ${ tableMainParam }`);

		const monoResult = new Array(config.maxMultiplicator).fill(null).map((_value, index) => ({
			mainParam: mainParam,
			multiplicator: index + 1,
			result: mainParam * (index + 1)
		}));

		// return shuffled mono table if necessary
		return (config.isShuffled)
			? shuffle(monoResult)
			: monoResult;
	}
	
	// generate tables entries
	const signatureType:"mono"|"multi" = (Array.isArray(tableMainParam)) ? "multi" : "mono";
	switch(true) {
		case (signatureType === "multi" && !config.isShuffled):
			// multi table in order
			return (tableMainParam as number[]).map(val => monoMultiplicationTableBuilderFunc(val));

		case (signatureType === "multi" && config.isShuffled):
			// multi table shuffled (inner table is already shuffled, but order of tables has to be shuffled also)
			return shuffle((tableMainParam as number[]).map(val => monoMultiplicationTableBuilderFunc(val)));

		default:
			// default is mono table (either shuffled or ordered)
			return monoMultiplicationTableBuilderFunc((tableMainParam as number));
	}
}

/**
 * Get questions with multiple choices for testing student purposes
 * @param tables 
 * @param config 
 */
export function multiplicationTableBatchQuestionsBuilder(tables:MTable|MultiMTable, config:TableMultipleChoicesConfig = defaultTableMultipleChoicesConfig):MTableMultipleChoicesQuestionEntry[] {
	// choices builder utility function
	const choicesBuilder = (entry:MTableEntry) => {
		let safetyLoopMaxCount:number = 0;
		const resultChoices:number[] = [];

		// loop attempt to generate valid WRONG choices until choices count is fulfilled (maximum 100 attempts)
		do {
			// generate random number between minus variation and plus variation around real result
			const generatedChoice:number = Math.round(entry.result + 2 * (Math.random() - 0.5) * config.proposalVariationAmplitude);
			// console.log(`result: ${ entry.result } choice: ${ generatedChoice } (amplitude: ${ config.proposalVariationAmplitude })`);

			// check if generated choice respect constraints and push it if yes
			if(generatedChoice !== entry.result && !resultChoices.includes(generatedChoice)) resultChoices.push(generatedChoice);

			// increment safety loop count
			safetyLoopMaxCount++;
		} while ((resultChoices.length + 1 < config.proposalCount) && (safetyLoopMaxCount < 100))

		// inject RIGHT choice randomly in choices array
		const randomIndex:number = Math.floor(Math.random() * resultChoices.length);
		resultChoices.splice(randomIndex, 0, entry.result);

		return resultChoices
	}

	// flatten array
	const flattenedArray:MTable = (tables as any).reduce((acc:MTableEntry[], curr:MTableEntry|MTable) => {
		// check if entry (MONO) or table (MULTI)
		const isMulti:boolean = Array.isArray(curr);

		if(isMulti) {
			acc.push(...(curr as MTableEntry[]));
		} else {
			acc.push((curr as MTableEntry));
		}

		return acc;
	}, []);

	// shuffle entries
	const shuffledArray:MTable = shuffle(flattenedArray);

	// generate choices for each entry
	return shuffledArray.map(entry => {
		return {
			...entry,
			choices: choicesBuilder(entry)
		}
	});
}

