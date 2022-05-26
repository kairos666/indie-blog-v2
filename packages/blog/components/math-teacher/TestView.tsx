import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import QuestionnaireHeader from './QuestionnaireHeader';
import styles from './TestView.module.scss';

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
    const testQuestionary = useMathTeacherState(state => state.test.questionnaire);
    const { questions, results, currentQuestionIndex } = testQuestionary;

    const startTestHandler = useCallback(() => { displayDetailHandler(null); startTest(); }, [startTest, displayDetailHandler]);
    const endTestHandler = useCallback(() => { displayDetailHandler(null); endTest(); }, [endTest, displayDetailHandler]);
    const resetTestHandler = useCallback(() => { displayDetailHandler(null); resetTest(); }, [resetTest, displayDetailHandler]);
    const triggerTestConfigSetupHandler = useCallback(() => {
        displayDetailHandler(
            <>
                <button type="button" onClick={ () => toggleSelectedTable(Math.ceil(Math.random() * 10)) }>add/remove random selecte tables</button>
                <menu>
                    <button type="button" onClick={ () => changeTestConfig({ testStyle: "MULTIPLE_CHOICES" }) }>multiple choices questions</button>
                    <button type="button" onClick={ () => changeTestConfig({ testStyle: "DIRECT_INPUT" }) }>direct input questions</button>
                </menu>
                <menu>
                    <button type="button" onClick={ () => changeTestConfig({ testMode: "NO_TIME_LIMIT" }) }>no time</button>
                    <button type="button" onClick={ () => changeTestConfig({ testMode: "SOFT_TIME_LIMIT" }) }>time limit soft</button>
                    <button type="button" onClick={ () => changeTestConfig({ testMode: "HARD_TIME_LIMIT" }) }>time limit hard</button>
                </menu>
            </>
        );
    }, [displayDetailHandler, changeTestConfig, toggleSelectedTable]);

    // ensure details removal when unmounting
    useEffect(() => {
        return () => displayDetailHandler(null)
    }, []);

    return (
        <article className={ styles['tv-TestLayout'] }>
            <QuestionnaireHeader 
                canChangeTestConfig={ canChangeTestConfig } 
                testState={ testState } 
                testConfig={ testConfig } 
                testQuestionary={ testQuestionary } 
                triggerTestSetupHandler={ triggerTestConfigSetupHandler }
            >
                { (testState === "PRE_TEST") 
                    ?   [
                            <button type="button" className={ styles['tv-testBtn'] } onClick={ startTestHandler }>start</button>,
                            <button type="button" className={ [styles['tv-testBtn'], styles['tv-testBtn--secondary']].join(' ') } onClick={ triggerTestConfigSetupHandler }>configure</button>
                        ] 
                    : (testState === "RUN_TEST")
                    ?   <button type="button" className={ styles['tv-testBtn'] } onClick={ endTestHandler }>end</button>
                    : (testState === "TEST_RESULTS")
                    ?   <button type="button" className={ styles['tv-testBtn'] } onClick={ resetTestHandler }>reset</button>
                    : null 
                }
            </QuestionnaireHeader>
            <section>
                <ol>
                    { questions.map((question, index) => (
                        <li key={ `question-#${ index }` }>
                            <p>{ question.mainParam } X { question.multiplicator } = { question.result } (choices: { question.choices.join(', ') })</p>
                        </li>
                    ))}
                </ol>
                <p>results:</p>
                <ol>
                    { results.map((result, index) => (
                        <li key={ `result-#${ index }` }>
                            <p>{ result.correctAnswer ? 'JUSTE' : 'FAUX' } ({ result.elapsedTime } secondes)</p>
                        </li>
                    ))}
                </ol>
            </section>
        </article>
    );
}

export default TestView;