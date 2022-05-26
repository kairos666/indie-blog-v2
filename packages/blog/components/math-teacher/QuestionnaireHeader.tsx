import { FC, ReactNode, useCallback } from 'react';
import { TestConfig, TestQuestionary } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import { testConfigLabels } from '../../utils/Enum2LabelConverters';
import styles from './QuestionnaireHeader.module.scss';

type QuestionnaireHeaderProps = {
    canChangeTestConfig:boolean
    testState:"PRE_TEST"|"RUN_TEST"|"TEST_RESULTS"
    testConfig:TestConfig
    testQuestionary:TestQuestionary
    triggerTestSetupHandler: () => void
};

const QuestionnaireHeader:FC<QuestionnaireHeaderProps> = ({ canChangeTestConfig, testState, testConfig, testQuestionary, triggerTestSetupHandler }) => {
    const setupTrigger = useCallback(() => {
        if(canChangeTestConfig)  triggerTestSetupHandler(); // only when trigger is allowed
    }, [triggerTestSetupHandler]);

    // selected tables render
    let renderedTableSelection:ReactNode = (<span className={ styles['qh-Entry'] }>cliquez pour configurer le test</span>);
    if(testConfig.selectedTables.length > 0) {
        renderedTableSelection = testConfig.selectedTables.map(entry => {
            return (<span key={ `table-entry-${ entry }` } className={ [styles['qh-Entry'], styles['qh-Entry--table']].join(' ') }>{ entry }</span>);
        });
    }

    return (
        <header className={ styles['qh-Header'] }>
            <div className={ [styles['qh-Header_SubContainer'], styles['qh-Header_SubContainer--test-setup']].join(' ') }>
                <dl className={ [styles['qh-Setting'], styles['qh-Setting--multi-value']].join(' ') }>
                    <dt>tables de multiplication</dt>
                    <dd data-disabled={ !canChangeTestConfig } onClick={ setupTrigger }>{ renderedTableSelection }</dd>
                </dl>
                <dl className={ [styles['qh-Setting'], styles['qh-Setting--mono-value']].join(' ') }>
                    <dt>style de questionnaire</dt>
                    <dd data-disabled={ !canChangeTestConfig } onClick={ setupTrigger }>{ testConfigLabels(testConfig.testStyle) }</dd>
                </dl>
                <dl className={ [styles['qh-Setting'], styles['qh-Setting--mono-value']].join(' ') }>
                    <dt>style de passation du questionnaire</dt>
                    <dd data-disabled={ !canChangeTestConfig } onClick={ setupTrigger }>{ testConfigLabels(testConfig.testMode) }</dd>
                </dl>
                <button type="button" className={ styles['qh-ConfigSetupTriggerBtn'] } disabled={ !canChangeTestConfig } onClick={ setupTrigger } >configurer le questionnaire</button>
            </div>
            {(testState === "RUN_TEST")
                ?   <div className={ [styles['qh-Header_SubContainer'], styles['qh-Header_SubContainer--test-proceeding']].join(' ') }>
                        <p>test state: { testState }</p>
                        <p>questions #{ testQuestionary.currentQuestionIndex + 1 } ({ testQuestionary.currentQuestionIndex + 1 }/{ testQuestionary.questions.length })</p>
                    </div>
                : null
            }
        </header>
    )
}

export default QuestionnaireHeader;