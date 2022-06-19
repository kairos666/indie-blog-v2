import create from 'zustand';
import produce from 'immer';
import { MTableMultipleChoicesQuestionEntry } from 'kai-multiplication-table-teacher/types/types';
import { multiplicationTableBatchQuestionsBuilder, multiplicationTableBuilder } from 'kai-multiplication-table-teacher';
import { Subscription } from 'rxjs';
import { testHardTimerObservableBuilder, testSoftTimerObservableBuilder } from '../../utils/testTimerObservables';

export interface TestConfig {
    testMode: "NO_TIME_LIMIT"|"SOFT_TIME_LIMIT"|"HARD_TIME_LIMIT"
    testStyle: "MULTIPLE_CHOICES"|"DIRECT_INPUT"
    durationTimePerQuestions: number
    selectedTables: number[]
}
export interface TestQuestionary {
    questions: MTableMultipleChoicesQuestionEntry[]
    results: { correctAnswer:boolean, answerTimestamp:number, userAnswer: number }[]
    overallResult: "completed"|"forfeit"|"timeout"|null
    testStartTimestamp:number
    testSoftSubscription:null|Subscription
    testHardHandler:null|{ subscription:Subscription, answerRegisterCb:() => void }
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
        completeTest: () => void
        forfeitTest: () => void
        timeoutTest: () => void
        resetTest: () => void
        answerQuestion: (submittedAnswer:{ correctAnswer:boolean, answerTimestamp:number, userAnswer: number }) => void
        changeTestConfig: (newTestConfig:Partial<TestConfig>) => void
        cleanupTimers: () => void
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
            overallResult: null,
            testStartTimestamp: NaN,
            testSoftSubscription: null,
            testHardHandler: null,
            currentQuestionIndex: 0
        },
        startTest: () => {
            const currentState = get();
            const currentTestMode = currentState.test.testConfig.testMode;
            const currentTestState = currentState.test.testState;

            // allow only when test in configuration stage
            if(currentTestState === "PRE_TEST") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "RUN_TEST";
                const generatedQuestions = multiplicationTableBatchQuestionsBuilder(multiplicationTableBuilder(draft.test.testConfig.selectedTables));

                // generate questions based on current config
                draft.test.questionnaire.overallResult = null;
                draft.test.questionnaire.testStartTimestamp = new Date().getTime();
                draft.test.questionnaire.currentQuestionIndex = 0;
                draft.test.questionnaire.results = [];
                draft.test.questionnaire.questions = generatedQuestions;

                if(currentTestMode === "SOFT_TIME_LIMIT") {
                    // setup SOFT timer
                    const softTimerObservable = testSoftTimerObservableBuilder(generatedQuestions.length, currentState.test.testConfig.durationTimePerQuestions);
                    draft.test.questionnaire.testSoftSubscription = softTimerObservable.subscribe({ complete: () => {
                        get().test.timeoutTest();
                    }});
                } else if(currentTestMode === "HARD_TIME_LIMIT") {
                    // setup HARD timer
                    const { observable: hardTimerObservable, answerRegisterCb } = testHardTimerObservableBuilder(generatedQuestions.length, currentState.test.testConfig.durationTimePerQuestions);
                    const testHardSubscription = hardTimerObservable.subscribe({
                        next: () => {
                            get().test.answerQuestion({ correctAnswer: false, answerTimestamp: new Date().getTime(), userAnswer: NaN }); // automatically push a wrong answer
                        }
                    });
                    draft.test.questionnaire.testHardHandler = { subscription: testHardSubscription, answerRegisterCb };
                }
            }));
        },
        completeTest: () => {
            const currentState = get();
            const currentTestState = currentState.test.testState;

            // cleanup timers
            currentState.test.cleanupTimers(); 

            // allow only when test in run stage
            if(currentTestState === "RUN_TEST") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "TEST_RESULTS";
                draft.test.questionnaire.overallResult = "completed";
                draft.test.questionnaire.testSoftSubscription = null;
                draft.test.questionnaire.testHardHandler = null;
            }));
        },
        forfeitTest: () => {
            const currentState = get();
            const currentTestState = currentState.test.testState;

            // cleanup timers
            currentState.test.cleanupTimers(); 

            // allow only when test in run stage
            if(currentTestState === "RUN_TEST") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "TEST_RESULTS";
                draft.test.questionnaire.overallResult = "forfeit";
                draft.test.questionnaire.testSoftSubscription = null;
                draft.test.questionnaire.testHardHandler = null;
            }));
        },
        timeoutTest: () => {
            const currentState = get();
            const currentTestState = currentState.test.testState;

            // cleanup timers
            currentState.test.cleanupTimers(); 

            // allow only when test in run stage
            if(currentTestState === "RUN_TEST") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "TEST_RESULTS";
                draft.test.questionnaire.overallResult = "timeout";
                draft.test.questionnaire.testSoftSubscription = null;
                draft.test.questionnaire.testHardHandler = null;
            }));
        },
        resetTest: () => {
            const currentState = get();
            const currentTestState = currentState.test.testState;

            // cleanup timers
            currentState.test.cleanupTimers(); 

            // allow only when test in run or end state stage
            if(currentTestState === "RUN_TEST" || currentTestState === "TEST_RESULTS") set(produce((draft:MathTeacherState) => {
                draft.test.testState = "PRE_TEST";
                draft.test.questionnaire.overallResult = null;
                draft.test.questionnaire.testStartTimestamp = NaN;
                draft.test.questionnaire.testSoftSubscription = null;
                draft.test.questionnaire.testHardHandler = null;
                draft.test.questionnaire.currentQuestionIndex = 0;
                draft.test.questionnaire.results = [];
                draft.test.questionnaire.questions = [];
            }));
        },
        answerQuestion: (submittedAnswer:{ correctAnswer:boolean, answerTimestamp:number, userAnswer:number }) => {
            const currentState:MathTeacherState = get();

            // forbid test answers outside test runs
            if(currentState.test.testState !== "RUN_TEST") throw new Error(`test question answers forbidden outside of test run`);

            const completeTestFunc = currentState.test.completeTest;
            const answerRegisterCbFunc = (currentState?.test?.questionnaire?.testHardHandler)
                ? currentState?.test?.questionnaire?.testHardHandler.answerRegisterCb
                : false;
            const answerIsLastOneFromTest:boolean = ((currentState.test.questionnaire.results.length + 1) >= currentState.test.questionnaire.questions.length);

            // ensure not pointing to inexistant question at end of test
            const nextQuestionIndex:number = (answerIsLastOneFromTest)
                ? currentState.test.questionnaire.questions.length - 1
                : currentState.test.questionnaire.currentQuestionIndex + 1

            // register answer
            set(produce((draft:MathTeacherState) => {
                draft.test.questionnaire.results = [...draft.test.questionnaire.results, submittedAnswer];
                draft.test.questionnaire.currentQuestionIndex = nextQuestionIndex;
            }));

            // after answer registration actions
            if(answerIsLastOneFromTest) {
                // end test
                completeTestFunc();
            } else if(answerRegisterCbFunc) {
                // HARD MODE - reset question timer
                answerRegisterCbFunc();
            }
        },
        changeTestConfig: (newTestConfig:Partial<TestConfig>) => {
            // forbid test config changes when not in test configuration stage
            if(get().test.testState !== "PRE_TEST") throw new Error(`test config change forbidden because test is underway`);

            // commit new mode
            set(produce((draft:MathTeacherState) => {
                if(newTestConfig.selectedTables) draft.test.testConfig.selectedTables = newTestConfig.selectedTables;
                if(newTestConfig.testMode) draft.test.testConfig.testMode = newTestConfig.testMode;
                if(newTestConfig.testStyle) draft.test.testConfig.testStyle = newTestConfig.testStyle;
                if(newTestConfig.durationTimePerQuestions) draft.test.testConfig.durationTimePerQuestions = newTestConfig.durationTimePerQuestions;
            }));
        },
        cleanupTimers: () => {
            const currentQuestionnaire = get().test.questionnaire;

            // unsubscribe SOFT timers if necessary
            if(currentQuestionnaire?.testSoftSubscription) currentQuestionnaire.testSoftSubscription.unsubscribe();

            // unsubscribe HARD timers if necessary
            if(currentQuestionnaire?.testHardHandler) currentQuestionnaire.testHardHandler.subscription.unsubscribe();
        }
    }
}))