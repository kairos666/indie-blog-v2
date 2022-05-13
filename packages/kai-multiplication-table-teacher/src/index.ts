import { MTable, MTableMultipleChoicesQuestionEntry, MultiMTable, TableConfig } from "./types";
import { shuffle } from "lodash";

const defaultTableConfig:TableConfig = {
	maxMultiplicator: 10,
    isShuffled: false
}

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

// export function multiplicationTableBatchQuestionsBuilder(tableMainParam:number|number[], config):MTableDirectQuestionEntry[]|MTableMultipleChoicesQuestionEntry[] {

// }

