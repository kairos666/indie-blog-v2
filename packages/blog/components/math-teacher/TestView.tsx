import { FC } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';

type TestViewProps = {};

const TestView:FC<TestViewProps> = () => {
    const { test: { availableTables, toggleSelectedTable, testState, testConfig, startTest, endTest, resetTest, changeTestConfig } } = useMathTeacherState();

    return (
        <>
            <p>test state: { testState }</p>
            <p>available tables: { availableTables.join(', ') }</p>
            <p>selected tables: { testConfig.selectedTables.join(', ') }</p>
            <p>test mode: { testConfig.testMode }</p>
            <menu>
                <button type="button" onClick={ () => changeTestConfig({ ...testConfig, testMode: "NO_TIME_LIMIT" }) }>no time</button>
                <button type="button" onClick={ () => changeTestConfig({ ...testConfig, testMode: "SOFT_TIME_LIMIT" }) }>time limit soft</button>
                <button type="button" onClick={ () => changeTestConfig({ ...testConfig, testMode: "HARD_TIME_LIMIT" }) }>time limit hard</button>
            </menu>
            <menu>
                <button type="button" onClick={ startTest }>start</button>
                <button type="button" onClick={ endTest }>end</button>
                <button type="button" onClick={ resetTest }>reset</button>
            </menu>
            <button type="button" onClick={ () => toggleSelectedTable(Math.ceil(Math.random() * 10)) }>add/remove random selecte tables</button>
        </>
    );
}

export default TestView;