import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TestQuestionary, useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import { MTableMultipleChoicesQuestionEntry } from 'kai-multiplication-table-teacher/types/types';
import styles from './Questionnaire.module.scss';
import QuestionnaireConfiguratorFull from './QuestionnaireConfiguratorFull';

type QuestionnaireProps = {};

const Questionnaire:FC<QuestionnaireProps> = () => {
    const { testState, testConfig, questionnaire, answerQuestion } = useMathTeacherState(state => ({
        testState: state.test.testState, 
        testConfig: state.test.testConfig, 
        questionnaire: state.test.questionnaire,
        answerQuestion: state.test.answerQuestion
    }));

    const nextQuestionHandler = useCallback((answer:string) => {
        const parsedAnswer:number = parseInt(answer);

        // check if answer is correct
        const currentQuestion = questionnaire.questions[questionnaire.currentQuestionIndex];

        answerQuestion({ 
            correctAnswer: (parsedAnswer === currentQuestion.result), 
            answerTimestamp: new Date().getTime(), 
            userAnswer: parsedAnswer
        });
    }, [questionnaire, answerQuestion]);

    switch(true) {
        case (testState === "RUN_TEST" && questionnaire.questions.length > 0 && testConfig.testStyle === "DIRECT_INPUT"):
            return (<TestQuestionDirectInput questionEntry={ questionnaire.questions[questionnaire.currentQuestionIndex] } nextQuestionHandler={ nextQuestionHandler }/>)

        case (testState === "RUN_TEST" && questionnaire.questions.length > 0 && testConfig.testStyle === "MULTIPLE_CHOICES"):
            return (<TestQuestionMultiChoices questionEntry={ questionnaire.questions[questionnaire.currentQuestionIndex] } nextQuestionHandler={ nextQuestionHandler }/>)

        case (testState === "TEST_RESULTS"):
            return (<TestResults questionnaire={ questionnaire } />);

        default:
            return (
                <aside className={ styles['q-EmptyState'] }>
                    <div className={ styles['q-EmptyStateInner'] }>
                        <QuestionnaireConfiguratorFull />
                    </div>
                </aside>
            )
    }
}

export default Questionnaire;

type TestQuestionDirectInputProps = {
    questionEntry:MTableMultipleChoicesQuestionEntry
    nextQuestionHandler: (answer:string) => void
};

export const TestQuestionDirectInput:FC<TestQuestionDirectInputProps> = ({ questionEntry, nextQuestionHandler }) => {
    const [answer, setAnswer] = useState('');
    const inputEltRef = useRef(null);

    // reset input when question change and setup focus
    useEffect(() => {
        setAnswer('');
        (inputEltRef.current as unknown as HTMLInputElement).focus();
    }, [questionEntry]);

    return (
        <section className={ [styles['q-Question'], styles['q-Question--direct-input']].join(' ') }>
            <form onSubmit={ evt => { evt.preventDefault(); nextQuestionHandler(answer) } }>
                <label htmlFor="test-question-calculus-label">{ `${ questionEntry.mainParam } X ${ questionEntry.multiplicator }` }</label>
                <input type="number" ref={ inputEltRef } id="test-question-calculus-label" autoComplete="off" min="0" step="1" value={ answer.toString() } name="test-question-calculus-label" onChange={ evt => setAnswer(evt.target.value) } required />
                <button type="submit">Valider ma r??ponse</button>
            </form>
        </section>
    )
}

type TestQuestionMultiChoicesProps = {
    questionEntry:MTableMultipleChoicesQuestionEntry
    nextQuestionHandler: (answer:string) => void
};

export const TestQuestionMultiChoices:FC<TestQuestionMultiChoicesProps> = ({ questionEntry, nextQuestionHandler }) => {
    return (
        <section className={ [styles['q-Question'], styles['q-Question--multiple-choices']].join(' ') }>
            <form onSubmit={ evt => evt.preventDefault() }>
                <fieldset>
                    <legend>{ `${ questionEntry.mainParam } X ${ questionEntry.multiplicator }` }</legend>
                </fieldset>
                <menu>
                    { questionEntry.choices.map(choice => {
                        return (
                            <button key={ `question-choice-${ choice }` } type="submit" title="Je valide cette r??ponse" onClick={ evt => { (evt.target as HTMLButtonElement).blur(); nextQuestionHandler(choice.toString()) } }>{ choice }</button>
                        )
                    })}
                </menu>
            </form>
        </section>
    )
}

export const ErrorDisplay:FC<{ errorDescriptor:{ calculus:string, correctAnswer:number, userWrongAnswer:number } }> = ({ errorDescriptor }) => {
    return (
        <>
            <span className={ styles['q-Results_Calculus'] }>{ errorDescriptor.calculus } </span>
            <span className={ styles['q-Results_Equal'] }>=</span>
            <span className={ styles['q-Results_Result'] }> { errorDescriptor.userWrongAnswer }</span>
        </>
    )
}

type TestResultsProps = {
    questionnaire: TestQuestionary
}

export const TestResults:FC<TestResultsProps> = ({ questionnaire }) => {
    const winRatio = Math.round(100 * questionnaire.results.filter(result => result.correctAnswer).length / questionnaire.results.length);
    const questionsCount:number = questionnaire.questions.length;
    const answeredQuestionsCount:number = questionnaire.results.length;
    const resultGlobalState:"full-win"|"partial-win"|"average-win"|"loss"|"timeout"|"abandonned-game" = (questionnaire.overallResult === "forfeit")
        ? "abandonned-game"
        : (questionnaire.overallResult === "timeout")
        ? "timeout"
        : (winRatio === 100)
        ? "full-win"
        : (winRatio >= 85)
        ? "partial-win"
        : (winRatio >= 65)
        ? "average-win"
        : "loss";

    // error descriptors
    const errorDescriptors:{ calculus:string, correctAnswer:number, userWrongAnswer:number }[] = questionnaire.questions.map((question, index) => {
        const matchingAnswer = questionnaire.results[index];

        return { calculus: `${question.mainParam} x ${question.multiplicator}`, correctAnswer: question.result, userWrongAnswer: matchingAnswer?.userAnswer }
    }).filter(errorDescriptor => (errorDescriptor.correctAnswer !== errorDescriptor.userWrongAnswer));
    const errorCount:number = errorDescriptors.length;
    const validAnswersCount:number = answeredQuestionsCount - errorCount;

    switch(resultGlobalState) {
        case "full-win":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }><p>Parfait! Tu as fait un sans fautes.</p></header>
                </section>
            );

        case "partial-win":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }><p>Bravo! C&apos;est presque parfait, seulement <span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' }.</p></header>
                    <ul className={ styles['q-Results_ErrorSummary'] }>
                        { errorDescriptors.map(error => <li key={ error.calculus }><ErrorDisplay errorDescriptor={ error } /></li>) }
                    </ul>
                </section>
            );

        case "average-win":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Pas trop mal! Encore quelques efforts, tu fais un peu trop d&apos;erreurs encore.</p>
                        <p><span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' } commises sur { questionsCount } questions.</p>
                        <p>Il te faut encore r??viser tes tables de multiplications.</p>
                    </header>
                    <ul className={ styles['q-Results_ErrorSummary'] }>
                        { errorDescriptors.map(error => <li key={ error.calculus }><ErrorDisplay errorDescriptor={ error } /></li>) }
                    </ul>
                </section>
            );

        case "abandonned-game":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Test abandonn??!</p>
                        <p>Tu peux recommencer un autre test ou r??viser tes tables si tu en as besoin.</p>
                    </header>
                </section>
            );

        case "timeout":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Test rat??!</p>
                        <p>Tu as pris trop de temps pour r??pondre c&apos;est dommage!</p>
                        <p><span className={ styles["q-Results_ValidCount"] }>{ validAnswersCount }</span> r??ponse{ (validAnswersCount > 1) ? 's' : '' } correcte{ (validAnswersCount > 1) ? 's' : '' }</p>
                        <p><span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' }</p>
                        <p>{ answeredQuestionsCount } question{ (answeredQuestionsCount > 1) ? 's' : '' } r??pondue{ (answeredQuestionsCount > 1) ? 's' : '' } sur { questionsCount }</p>
                    </header>
                    <ul className={ styles['q-Results_ErrorSummary'] }>
                        { errorDescriptors.map(error => <li key={ error.calculus }><ErrorDisplay errorDescriptor={ error } /></li>) }
                    </ul>
                </section>
            );

        default:
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Ce n&apos;est pas suffisant! Encore quelques efforts, tu fais trop d&apos;erreurs pour le moment.</p>
                        <p><span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' } commises sur { questionsCount } questions.</p>
                        <p>Il te faut encore r??viser tes tables de multiplications.</p>
                    </header>
                    <ul className={ styles['q-Results_ErrorSummary'] }>
                        { errorDescriptors.map(error => <li key={ error.calculus }><ErrorDisplay errorDescriptor={ error } /></li>) }
                    </ul>
                </section>
            );
    }
}