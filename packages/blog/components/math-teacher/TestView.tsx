import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import Questionnaire from './Questionnaire';
import QuestionnaireHeader from './QuestionnaireHeader';
import styles from './TestView.module.scss';

type TestViewProps = {
    displayDetailHandler: (children:ReactNode) => void
};

const TestView:FC<TestViewProps> = ({ displayDetailHandler }) => {
    const { testState, testConfig } = useMathTeacherState(state => ({
        testState: state.test.testState,
        testConfig: state.test.testConfig
    }));
    const { startTest, forfeitTest, resetTest } = useMathTeacherState(state => ({
        startTest: state.test.startTest,
        forfeitTest: state.test.forfeitTest,
        resetTest: state.test.resetTest,
        toggleSelectedTable: state.test.toggleSelectedTable,
        changeTestConfig: state.test.changeTestConfig
    }));
    const testQuestionary = useMathTeacherState(state => state.test.questionnaire);

    const cancelTestHandler = useCallback(() => { displayDetailHandler(null); forfeitTest(); }, [forfeitTest, displayDetailHandler]);
    const resetTestHandler = useCallback(() => { displayDetailHandler(null); resetTest(); }, [resetTest, displayDetailHandler]);

    // ensure details removal when unmounting
    useEffect(() => {
        return () => displayDetailHandler(null)
    }, []);

    return (
        <article className={ styles['tv-TestLayout'] }>
            <QuestionnaireHeader 
                testState={ testState } 
                testConfig={ testConfig } 
                testQuestionary={ testQuestionary }
            >
                { (testState === "RUN_TEST")
                    ?   <button type="button" className={ [styles['tv-testBtn'], styles['tv-testBtn--secondary']].join(' ') } onClick={ cancelTestHandler }>Abandonner</button>
                    : (testState === "TEST_RESULTS")
                    ?   <button type="button" className={ styles['tv-testBtn'] } onClick={ resetTestHandler }>Retour</button>
                    : null 
                }
            </QuestionnaireHeader>
            <Questionnaire />
        </article>
    );
}

export default TestView;