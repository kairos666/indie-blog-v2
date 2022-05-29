import { FC, ReactNode, useCallback, useEffect } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import Questionnaire from './Questionnaire';
import QuestionnaireConfigurator from './QuestionnaireConfigurator';
import QuestionnaireHeader from './QuestionnaireHeader';
import styles from './TestView.module.scss';

type TestViewProps = {
    displayDetailHandler: (children:ReactNode) => void
};

const TestView:FC<TestViewProps> = ({ displayDetailHandler }) => {
    const { testState, testConfig, canChangeTestConfig } = useMathTeacherState(state => ({
        testState: state.test.testState,
        testConfig: state.test.testConfig,
        canChangeTestConfig: (state.test.testState === "PRE_TEST")
    }));
    const { startTest, endTest, resetTest } = useMathTeacherState(state => ({
        startTest: state.test.startTest,
        endTest: state.test.endTest,
        resetTest: state.test.resetTest,
        toggleSelectedTable: state.test.toggleSelectedTable,
        changeTestConfig: state.test.changeTestConfig
    }));
    const testQuestionary = useMathTeacherState(state => state.test.questionnaire);

    const startTestHandler = useCallback(() => { displayDetailHandler(null); startTest(); }, [startTest, displayDetailHandler]);
    const endTestHandler = useCallback(() => { displayDetailHandler(null); endTest(true); }, [endTest, displayDetailHandler]);
    const resetTestHandler = useCallback(() => { displayDetailHandler(null); resetTest(); }, [resetTest, displayDetailHandler]);
    const triggerTestConfigSetupHandler = useCallback(() => {
        displayDetailHandler(<QuestionnaireConfigurator onCancelConfigurator={ () => displayDetailHandler(null) } />);
    }, [displayDetailHandler]);

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
                    ?   <>
                            <button type="button" className={ styles['tv-testBtn'] } onClick={ startTestHandler }>Démarrer</button>
                            <button type="button" className={ [styles['tv-testBtn'], styles['tv-testBtn--secondary']].join(' ') } onClick={ triggerTestConfigSetupHandler }>Configurer</button>
                        </> 
                    : (testState === "RUN_TEST")
                    ?   <button type="button" className={ [styles['tv-testBtn'], styles['tv-testBtn--secondary']].join(' ') } onClick={ endTestHandler }>Abandonner</button>
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