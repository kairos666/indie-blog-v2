import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TestQuestionary, useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import { MTableMultipleChoicesQuestionEntry } from 'kai-multiplication-table-teacher/types/types';
import styles from './Questionnaire.module.scss';

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
        // get elapsed time since start of question
        // TODO

        // check if answer is correct
        const currentQuestion = questionnaire.questions[questionnaire.currentQuestionIndex];

        answerQuestion({ correctAnswer: (parsedAnswer === currentQuestion.result), elapsedTime: Math.ceil(Math.random() * 10000), userAnswer: parsedAnswer });
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
                    <p>Configure ton test avant de démarrer!<br />Clic sur le bouton "Configurer"</p>
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
                <button type="submit">Valider ma réponse</button>
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
                            <button key={ `question-choice-${ choice }` } type="submit" title="Je valide cette réponse" onClick={ evt => { (evt.target as HTMLButtonElement).blur(); nextQuestionHandler(choice) } }>{ choice }</button>
                        )
                    })}
                </menu>
            </form>
        </section>
    )
}

type TestResultsProps = {
    questionnaire: TestQuestionary
}

export const TestResults:FC<TestResultsProps> = ({ questionnaire }) => {
    const isAbandonnedGame:boolean = (questionnaire.results.length < questionnaire.questions.length);
    const winRatio = Math.round(100 * questionnaire.results.filter(result => result.correctAnswer).length / questionnaire.results.length);
    const errorCount:number = questionnaire.results.filter(result => !result.correctAnswer).length;
    const questionsCount:number = questionnaire.results.length;
    const resultGlobalState:"full-win"|"partial-win"|"average-win"|"loss"|"abandonned-game" = (isAbandonnedGame)
        ? "abandonned-game"
        : (winRatio === 100)
        ? "full-win"
        : (winRatio >= 85)
        ? "partial-win"
        : (winRatio >= 65)
        ? "average-win"
        : "loss";

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
                    <header className={ styles["q-Results_Head"] }><p>Bravo! C'est presque parfait, seulement <span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' }.</p></header>
                </section>
            );

        case "average-win":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Pas trop mal! Encore quelques efforts, tu fais un peu trop d'erreurs encore.</p>
                        <p><span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' } commises sur { questionsCount } questions.</p>
                        <p>Il te faut encore réviser te tables de multiplications.</p>
                    </header>
                </section>
            );

        case "abandonned-game":
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Test abandonné!</p>
                        <p>Tu peux recommencer un autre test ou réviser tes tables si tu en as besoin.</p>
                    </header>
                </section>
            );

        default:
            return (
                <section className={ [styles['q-Results'], styles[`q-Results--${ resultGlobalState }`]].join(' ') }>
                    <header className={ styles["q-Results_Head"] }>
                        <p>Ce n'est pas suffisant! Encore quelques efforts, tu fais trop d'erreurs pour le moment.</p>
                        <p><span className={ styles["q-Results_ErrorCount"] }>{ errorCount }</span> erreur{ (errorCount > 1) ? 's' : '' } commises sur { questionsCount } questions.</p>
                        <p>Il te faut encore réviser tes tables de multiplications.</p>
                    </header>
                </section>
            );
    }
}