import { FC, useCallback, useEffect, useState } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
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

    const nextQuestionHandler = useCallback((answer:number) => {
        // get elapsed time since start of question
        // TODO

        // check if answer is correct
        const currentQuestion = questionnaire.questions[questionnaire.currentQuestionIndex];

        answerQuestion({ correctAnswer: (answer === currentQuestion.result), elapsedTime: Math.ceil(Math.random() * 10000) })
    }, [questionnaire, answerQuestion]);

    switch(true) {
        case (testState === "RUN_TEST" && questionnaire.questions.length > 0 && testConfig.testStyle === "DIRECT_INPUT"):
            return (<TestQuestionDirectInput questionEntry={ questionnaire.questions[questionnaire.currentQuestionIndex] } nextQuestionHandler={ nextQuestionHandler }/>)

        case (testState === "RUN_TEST" && questionnaire.questions.length > 0 && testConfig.testStyle === "MULTIPLE_CHOICES"):
            return (<TestQuestionMultiChoices questionEntry={ questionnaire.questions[questionnaire.currentQuestionIndex] } nextQuestionHandler={ nextQuestionHandler }/>)

        case (testState === "TEST_RESULTS"):
            return (
                <p>show questionnaire results: { questionnaire.results.map(result => result.correctAnswer ? 'juste' : 'faux').join(', ') }</p>
            )

        default:
            return (
                <p>configure test first and then start it!</p>
            )
    }
}

export default Questionnaire;

type TestQuestionDirectInputProps = {
    questionEntry:MTableMultipleChoicesQuestionEntry
    nextQuestionHandler: (answer:number) => void
};

export const TestQuestionDirectInput:FC<TestQuestionDirectInputProps> = ({ questionEntry, nextQuestionHandler }) => {
    const [answer, setAnswer] = useState('');

    // reset input when question change
    useEffect(() => setAnswer(''), [questionEntry]);

    return (
        <section className={ [styles['q-Question'], styles['q-Question--direct-input']].join(' ') }>
            <form onSubmit={ evt => { evt.preventDefault(); nextQuestionHandler((answer as unknown as number)) } }>
                <label htmlFor="test-question-calculus-label">{ `${ questionEntry.mainParam } X ${ questionEntry.multiplicator }` }</label>
                <input type="number" id="test-question-calculus-label" autoComplete="off" min="0" step="1" value={ answer } name="test-question-calculus-label" onChange={ evt => setAnswer(parseInt(evt.target.value)) } required />
                <button type="button" onClick={ () => { nextQuestionHandler(questionEntry.result) } }>Valider ma réponse</button>
            </form>
        </section>
    )
}

type TestQuestionMultiChoicesProps = {
    questionEntry:MTableMultipleChoicesQuestionEntry
    nextQuestionHandler: (answer:number) => void
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
                            <button type="submit" title="Je valide cette réponse" onClick={ evt => { (evt.target as HTMLButtonElement).blur(); nextQuestionHandler(choice) } }>{ choice }</button>
                        )
                    })}
                </menu>
            </form>
        </section>
    )
}