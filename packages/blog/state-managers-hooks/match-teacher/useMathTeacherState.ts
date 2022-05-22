import create from 'zustand';
import produce from 'immer';

export interface TestConfig {
    testMode: "NO_TIME_LIMIT"|"SOFT_TIME_LIMIT"|"HARD_TIME_LIMIT"
    selectedTables: number[]
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
        startTest: () => void
        endTest: () => void
        resetTest: () => void
        changeTestConfig: (newTestConfig:TestConfig) => void
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
                set({ activityState: "LEARN" });
            break;
            // standard case
            default:
                set({ activityState: newActivityState })
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
                set(state => ({ learn: { ...state.learn, selectedTables: currentSelectedTables.filter(selectedItem => selectedItem !== toggleMainParam).sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) }}));
            } else {
                // not yet selected --> add
                set(state => ({ learn: { ...state.learn, selectedTables: [...currentSelectedTables, toggleMainParam].sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) }}));
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
                set(produce((state:MathTeacherState) => {
                    state.test.testConfig.selectedTables = currentSelectedTables.filter(selectedItem => selectedItem !== toggleMainParam).sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
                }));
            } else {
                // not yet selected --> add
                set(produce((state:MathTeacherState) => {
                    state.test.testConfig.selectedTables = [...currentSelectedTables, toggleMainParam].sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
                }));
            }        
        },
        testState: "PRE_TEST",
        testConfig: {
            testMode: "NO_TIME_LIMIT",
            selectedTables: []
        },
        startTest: () => {
            const currentTestState = get().test.testState;

            // allow only when test in configuration stage
            if(currentTestState === "PRE_TEST") set(produce((state:MathTeacherState) => {
                state.test.testState = "RUN_TEST";
            }));
        },
        endTest: () => {
            const currentTestState = get().test.testState;

            // allow only when test in run stage
            if(currentTestState === "RUN_TEST") set(produce((state:MathTeacherState) => {
                state.test.testState = "TEST_RESULTS";
            }));
        },
        resetTest: () => {
            const currentTestState = get().test.testState;

            // allow only when test in run or end state stage
            if(currentTestState === "RUN_TEST" || currentTestState === "TEST_RESULTS") set(produce((state:MathTeacherState) => {
                state.test.testState = "PRE_TEST";
            }));
        },
        changeTestConfig: (newTestConfig) => {
            // forbid test config changes when not in test configuration stage
            if(get().test.testState !== "PRE_TEST") throw new Error(`test config change forbidden because test is underway`);

            // commit new mode
            set(produce((state:MathTeacherState) => {
                state.test.testConfig = newTestConfig;
            }));
        }
    }
}))