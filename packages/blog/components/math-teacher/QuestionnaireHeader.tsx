import { FC, ReactNode } from 'react';
import { useBreakpointMatcher } from '../../hooks/useBreakpointMatcher';
import { TestConfig, TestQuestionary } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import { testConfigLabels, testStateLabels } from '../../utils/Enum2LabelConverters';
import styles from './QuestionnaireHeader.module.scss';
import QuestionnaireProgress from './QuestionnaireProgress';

type QuestionnaireHeaderProps = {
    testState:"PRE_TEST"|"RUN_TEST"|"TEST_RESULTS"
    testConfig:TestConfig
    testQuestionary:TestQuestionary
};

const QuestionnaireHeader:FC<QuestionnaireHeaderProps> = ({ testState, testConfig, testQuestionary, children }) => {
    const isDesktop = useBreakpointMatcher(windowWidth => 1000 <= windowWidth);

    // selected tables render
    let renderedTableSelection:ReactNode = (<span className={ [styles['qh-Entry'], styles['qh-Entry--required']].join(' ') }>aucune table sélectionnée</span>);
    if(testConfig.selectedTables.length > 0) {
        renderedTableSelection = testConfig.selectedTables.map(entry => {
            return (<span key={ `table-entry-${ entry }` } className={ [styles['qh-Entry'], styles['qh-Entry--table']].join(' ') }>{ entry }</span>);
        });
    }

    // test runner sub header
    let renderedTestRunnerHeader:ReactNode = null;
    if(testState === "RUN_TEST") {
        renderedTestRunnerHeader = (
            <div className={ [styles['qh-Header_SubContainer'], styles['qh-Header_SubContainer--test-proceeding']].join(' ') }>
                <p>{ testStateLabels(testState) }</p>
                <QuestionnaireProgress />
                <menu>{ children }</menu>
            </div>
        );
    } else if(testState === "TEST_RESULTS") {
        renderedTestRunnerHeader = (
            <div className={ [styles['qh-Header_SubContainer'], styles['qh-Header_SubContainer--test-results']].join(' ') }>
                <p>{ testStateLabels(testState) }</p>
                <p>questions #{ testQuestionary.currentQuestionIndex + 1 } ({ testQuestionary.currentQuestionIndex + 1 }/{ testQuestionary.questions.length })</p>
                <menu>{ children }</menu>
            </div>
        );
    }

    // test config sub header
    let renderedTestConfigHeader:ReactNode = null;
    if(isDesktop) {
        renderedTestConfigHeader = (
            <div className={ [styles['qh-Header_SubContainer'], styles['qh-Header_SubContainer--test-config']].join(' ') }>
                <dl className={ [styles['qh-Setting'], styles['qh-Setting--multi-value']].join(' ') }>
                    <dt>tables de multiplication</dt>
                    <dd>{ renderedTableSelection }</dd>
                </dl>
                <dl className={ [styles['qh-Setting'], styles['qh-Setting--mono-value']].join(' ') }>
                    <dt>style de questionnaire</dt>
                    <dd>{ testConfigLabels(testConfig.testStyle) }</dd>
                </dl>
                <dl className={ [styles['qh-Setting'], styles['qh-Setting--mono-value']].join(' ') }>
                    <dt>style de passation du questionnaire</dt>
                    <dd>{ testConfigLabels(testConfig.testMode) }</dd>
                </dl>
            </div>
        );
    } else {
        renderedTestConfigHeader = (
            <div className={ [styles['qh-Header_SubContainer'], styles['qh-Header_SubContainer--test-config']].join(' ') }>
                <span className={ styles['qh-SettingMobile'] }>
                    <span>{ renderedTableSelection }</span>
                    {(testConfig.testStyle === "DIRECT_INPUT")
                        ? <span className={ styles['qh-SettingMobile--direct-input'] }></span>
                        : <span className={ styles['qh-SettingMobile--multiple-choices'] }></span>
                    }
                    {(testConfig.testMode === "SOFT_TIME_LIMIT")
                        ? <span className={ styles['qh-SettingMobile--time'] }></span>
                        : (testConfig.testMode === "HARD_TIME_LIMIT")
                        ? [<span key="stopwatch-1" className={ styles['qh-SettingMobile--time'] }></span>, <span key="stopwatch-2" className={ styles['qh-SettingMobile--time'] }></span>]
                        : null
                    }
                </span>
            </div>
        );
    }

    return (
        <header className={ styles['qh-Header'] }>
            { renderedTestConfigHeader }
            { renderedTestRunnerHeader }
        </header>
    )
}

export default QuestionnaireHeader;