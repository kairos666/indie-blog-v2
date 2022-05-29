import { CSSProperties, FC } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import styles from './QuestionnaireProgress.module.scss';

type QuestionnaireProgressProps = {};

const QuestionnaireProgress:FC<QuestionnaireProgressProps> = () => {
    const { testConfig, questionnaire } = useMathTeacherState(state => ({
        testConfig: state.test.testConfig,
        questionnaire: state.test.questionnaire
    }));

    const questionCount:number = questionnaire.questions.length;
    const questionProgress:number = 100 * (questionnaire.results.length / questionCount);
    const testDuration:number = questionCount * testConfig.durationTimePerQuestions;
    const questionProgressCSS = { "--question-cursor-progress": `${ questionProgress }%`, "--questions-count": questionCount, "--soft-time-limit": `${ testDuration}s` };

    switch(testConfig.testMode) {
        case "HARD_TIME_LIMIT":
            return <p>hard limit</p>

        case "SOFT_TIME_LIMIT":
            return (
                <figure className={ styles['qp-ProgressBar'] } style={ (questionProgressCSS as CSSProperties) }>
                    <span className={ styles['qp-ProgressTimerCursor'] }></span>
                    <span className={ styles['qp-ProgressQuestionCursor'] }></span>
                </figure>
            );

        default:
            return (
                <figure className={ styles['qp-ProgressBar'] } style={ (questionProgressCSS as CSSProperties) }>
                    <span className={ styles['qp-ProgressQuestionCursor'] }></span>
                </figure>
            );
    }
}

export default QuestionnaireProgress;