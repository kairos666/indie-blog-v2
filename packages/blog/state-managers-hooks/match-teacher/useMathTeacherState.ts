import create from 'zustand';
import produce from 'immer';
import { MTableMultipleChoicesQuestionEntry } from 'kai-multiplication-table-teacher/types/types';
import { multiplicationTableBatchQuestionsBuilder, multiplicationTableBuilder } from 'kai-multiplication-table-teacher';

export interface TestConfig {
    testMode: "NO_TIME_LIMIT"|"SOFT_TIME_LIMIT"|"HARD_TIME_LIMIT"
    testStyle: "MULTIPLE_CHOICES"|"DIRECT_INPUT"
    durationTimePerQuestions: number
    selectedTables: number[]
}
export interface TestQuestionary {
    questions: MTableMultipleChoicesQuestionEntry[]
    results: { correctAnswer:boolean, elapsedTime:number, userAnswer: number, status:"timeout"|"answered"|"forfeit" }[]
    currentQuestionIndex:number
}
export interface MathTeacherState {
    activityState: "LEARN"|"TEST"
    changeGlobalState: (newActivityState:"LEARN"|"TEST") => void
    learn: {
        selectedTables: number[]
        availableTables:number[]
        toggleSelectedTable: (toggleMainParam: number) => void
    },
    test: {
        availableTables:number[]
        toggleSelectedTable: (toggleMainParam: number) => void
        testState: "PRE_TEST"|"RUN_TEST"|"TEST_RESULTS"
        testConfig: TestConfig
        questionnaire: TestQuestionary
        startTest: () => void
        endTest: (isForfeit:boolean) => void
        resetTest: () => void
        answerQuestion: (submittedAnswer:{ correctAnswer:boolean, elapsedTime:number, userAnswer: number, status:"timeout"|"answered"|"forfeit" }) => void
        changeTestConfig: (newTestConfig:Partial<TestConfig>) => void
    }
} 

export const useMathTeacherState = create<MathTeacherState>((set, get) => ({
    activityState: "LEARN",
    changeGlobalState: (newActivityState:"LEARN"|"TEST") => {
        const { activityState: currActivityState, test: { testState: currTestState, resetTest } } = get();
        // only allow legit transitions
        switch(true) {
            // test is being performed, prevent exiting test
            case (newActivityState === "LEARN" && currActivityState === "TEST" && currTestState === "RUN_TEST"):
                throw new Error(`state change forbidden from ${ currActivityState } to ${ newActivityState } because test is underway`);
            // test is done, reset setup if moving away to learn
            case (newActivityState === "LEARN" && currActivityState === "TEST" && currTestState === "TEST_RESULTS"):
                resetTest();
                set(produce((draft:MathTeacherState) => { draft.activityState = "LEARN" }));
            break;
            // standard case
            default:
                set(produce((draft:MathTeacherState) => { draft.activityState = newActivityState }));
        }
    },
    learn: {
        selectedTables: [],
        availableTables: new Array(10).fill(null).map((_, index) => index + 1),
        toggleSelectedTable: (toggleMainParam) => {
            const currentSelectedTables = get().learn.selectedTables;
            const isAlreadySelected = currentSelectedTables.includes(toggleMainParam);
    
            if(isAlreadySelected) {
                // already exists --> remove
                set(produce((draft:MathTeacherState) => {
                    draft.learn.selectedTables = currentSelectedTables.filter(selectedItem => selectedItem !== toggleMainParam).sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
                }));
            } else {
                // not yet selected --> add
                set(produce((draft:MathTeacherState) => {
                    draft.learn.selectedTables = [...currentSelectedTables, toggleMainParam].sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
                }));
            }        
        }
    },
    test: {
        availableTables: new Array(10).fill(null).map((_, index) => index + 1),
        toggleSelectedTable: (toggleMainParam) => {
            // forbid test config changes when not in test configuration stage
            if(get().test.testState !== "PRE_TEST") throw new Error(`test config change forbidden because test is underway - selected tables`);

            const currentSelectedTables = get().test.testConfig.selectedTables;
            const isAlreadySelected = currentSelectedTables.includes(toggleMainParam);
    
            if(isAlreadySelected) {
                // already exists --> remove
                set(produce((draft:MathTeacherState) => {
                    draft.test.testConfig.selectedTables = currentSelectedTables.filter(selectedItem => selectedItem !== toggleMainParam).sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
                }));
            } else {
                // not yet selected --> add
                set(produce((draft:MathTeacherState) => {
                    draft.test.testConfig.selectedTables = [...currentSelectedTables, toggleMainParam].sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
                }));
            }        
        },
        testState: "PRE_TEST",
        testConfig: {
            testMode: "NO_TIME_LIMIT",
            testStyle: "MULTIPLE_CHOICES",
            durationTimePerQuestions: 10,
            selectedTables: []
        },
        questionnaire: {
            questions: [],
            results: [],
            currentQuestionIndex: 0
        },
        startTest: () => {
            const currentTestState = get().test.testState;

            // allow only when test in configuration stage
            if(currentTestState === "PRE_TEST") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "RUN_TEST";

                // generate questions based on current config
                draft.test.questionnaire.currentQuestionIndex = 0;
                draft.test.questionnaire.results = [];
                draft.test.questionnaire.questions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder(draft.test.testConfig.selectedTables));
            }));
        },
        endTest: (isForfeit:boolean) => {
            const currentTestState = get().test.testState;

            // allow only when test in run stage
            if(currentTestState === "RUN_TEST") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "TEST_RESULTS";

                // if forfeit, fill missing answers
                if(isForfeit) {
                    const forfeitResults = new Array(draft.test.questionnaire.questions.length - draft.test.questionnaire.results.length).fill({ 
                        correctAnswer: false, 
                        elapsedTime:NaN, 
                        userAnswer: NaN, 
                        status:"forfeit" 
                    });
                    draft.test.questionnaire.results.push(...forfeitResults);
                }
            }));
        },
        resetTest: () => {
            const currentTestState = get().test.testState;

            // allow only when test in run or end state stage
            if(currentTestState === "RUN_TEST" || currentTestState === "TEST_RESULTS") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "PRE_TEST";
                draft.test.questionnaire.currentQuestionIndex = 0;
                draft.test.questionnaire.results = [];
                draft.test.questionnaire.questions = [];
            }));
        },
        answerQuestion: (submittedAnswer:{ correctAnswer:boolean, elapsedTime:number, userAnswer:number, status:"timeout"|"answered"|"forfeit" }) => {
            // forbid test answers outside test runs
            if(get().test.testState !== "RUN_TEST") throw new Error(`test question answers forbidden outside of test run`);

            set(produce((draft:MathTeacherState) => {
                draft.test.questionnaire.results = [...draft.test.questionnaire.results, submittedAnswer];
                draft.test.questionnaire.currentQuestionIndex++;
            }));

            // after update state - trigger questionnaire end if all questions have been answered
            const newState:MathTeacherState = get();
            if(newState.test.questionnaire.currentQuestionIndex >= newState.test.questionnaire.questions.length) newState.test.endTest(false);
        },
        changeTestConfig: (newTestConfig:Partial<TestConfig>) => {
            // forbid test config changes when not in test configuration stage
            if(get().test.testState !== "PRE_TEST") throw new Error(`test config change forbidden because test is underway`);

            // commit new mode
            set(produce((draft:MathTeacherState) => {
                if(newTestConfig.selectedTables) draft.test.testConfig.selectedTables = newTestConfig.selectedTables;
                if(newTestConfig.testMode) draft.test.testConfig.testMode = newTestConfig.testMode;
                if(newTestConfig.testStyle) draft.test.testConfig.testStyle = newTestConfig.testStyle;
            }));
        }
    }
}))