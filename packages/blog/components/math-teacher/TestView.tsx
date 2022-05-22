import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';

type TestViewProps = {
    displayDetailHandler: (children:ReactNode) => void
};

const TestView:FC<TestViewProps> = ({ displayDetailHandler }) => {
    const { availableTables, testState, testConfig, canChangeTestConfig } = useMathTeacherState(state => ({
        availableTables:state.test.availableTables,
        testState: state.test.testState,
        testConfig: state.test.testConfig,
        canChangeTestConfig: (state.test.testState === "PRE_TEST")
    }));
    const { toggleSelectedTable, startTest, endTest, resetTest, changeTestConfig } = useMathTeacherState(state => ({
        startTest: state.test.startTest,
        endTest: state.test.endTest,
        resetTest: state.test.resetTest,
        toggleSelectedTable: state.test.toggleSelectedTable,
        changeTestConfig: state.test.changeTestConfig
    }));

    const startTestHandler = useCallback(() => { displayDetailHandler(null); startTest(); }, [startTest, displayDetailHandler]);
    const endTestHandler = useCallback(() => { displayDetailHandler(null); endTest(); }, [endTest, displayDetailHandler]);
    const resetTestHandler = useCallback(() => { displayDetailHandler(null); resetTest(); }, [resetTest, displayDetailHandler]);
    const triggerTestConfigSetupHandler = useCallback(() => {
        displayDetailHandler(
            <>
                <menu>
                    <button type="button" onClick={ () => changeTestConfig({ ...testConfig, testMode: "NO_TIME_LIMIT" }) }>no time</button>
                    <button type="button" onClick={ () => changeTestConfig({ ...testConfig, testMode: "SOFT_TIME_LIMIT" }) }>time limit soft</button>
                    <button type="button" onClick={ () => changeTestConfig({ ...testConfig, testMode: "HARD_TIME_LIMIT" }) }>time limit hard</button>
                </menu>
                <button type="button" onClick={ () => toggleSelectedTable(Math.ceil(Math.random() * 10)) }>add/remove random selecte tables</button>
            </>
        );
    }, [displayDetailHandler, changeTestConfig, toggleSelectedTable]);

    // ensure details removal when unmounting
    useEffect(() => {
        return () => displayDetailHandler(null)
    }, []);

    return (
        <>
            <p>test state: { testState }</p>
            <p>available tables: { availableTables.join(', ') }</p>
            <p>selected tables: { testConfig.selectedTables.join(', ') }</p>
            <p>test mode: { testConfig.testMode }</p>
            <menu>
                <button type="button" disabled={ (testState !== "PRE_TEST") } onClick={ startTestHandler }>start</button>
                <button type="button" disabled={ (testState !== "RUN_TEST") } onClick={ endTestHandler }>end</button>
                <button type="button" disabled={ (testState === "PRE_TEST") } onClick={ resetTestHandler }>reset</button>
                <button type="button" disabled={ !canChangeTestConfig } onClick={ triggerTestConfigSetupHandler }>trigger config panel</button>
            </menu>
        </>
    );
}

export default TestView;