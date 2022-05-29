import { FC } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import { testConfigLabels } from '../../utils/Enum2LabelConverters';
import MultiplicationTablesSelector from './MultiplicationTablesSelector';
import styles from './QuestionnaireConfigurator.module.scss';

type QuestionnaireConfiguratorProps = {
    onCancelConfigurator: () => void
};

const QuestionnaireConfigurator:FC<QuestionnaireConfiguratorProps> = ({ onCancelConfigurator }) => {
    const { currentlySelectedTables, testStyle, testMode, availableTables, toggleSelectedTable, changeTestConfig } = useMathTeacherState(state => ({
        currentlySelectedTables: state.test.testConfig.selectedTables,
        testStyle: state.test.testConfig.testStyle,
        testMode: state.test.testConfig.testMode,
        availableTables: state.test.availableTables,
        toggleSelectedTable: state.test.toggleSelectedTable,
        changeTestConfig: state.test.changeTestConfig
    }));

    return (
        <form className={ styles['qcf-Form'] } onSubmit={ evt => evt.preventDefault() }>
            <h1 className={ styles['qcf-ModalTitle'] }>Configurer le test</h1>
            <div data-wrapper="form-control">
                <section className={ styles['qcf-FormSection'] }>
                    <h4 id="test-tables-selector">Tables à tester</h4>
                    <MultiplicationTablesSelector currentlySelected={ currentlySelectedTables } availableTables={ availableTables } changeHandler={ toggleSelectedTable } />
                    <p className={ styles['qcf-TextMuted'] }>Il faut choisir au moins une table dans la liste ci-dessus</p>
                </section>
                <section role="radiogroup" aria-labelledby="test-style-selector" className={ [styles['qcf-FormSection'], styles['qcf-CustomRadioGroup']].join(' ') }>
                    <h4 id="test-style-selector">Style de questionnaire</h4>
                    <button type="button" className={ styles['qcf-SelectorBtn'] } role="radio" aria-checked={ (testStyle === "MULTIPLE_CHOICES") } aria-labelledby="choice-MULTIPLE_CHOICES" onClick={ () => changeTestConfig({ testStyle: "MULTIPLE_CHOICES" }) }><span id="choice-MULTIPLE_CHOICES">{ testConfigLabels("MULTIPLE_CHOICES") }</span></button>
                    <button type="button" className={ styles['qcf-SelectorBtn'] } role="radio" aria-checked={ (testStyle === "DIRECT_INPUT") } aria-labelledby="choice-DIRECT_INPUT" onClick={ () => changeTestConfig({ testStyle: "DIRECT_INPUT" }) }><span id="choice-DIRECT_INPUT">{ testConfigLabels("DIRECT_INPUT") }</span></button>
                </section>
                <section role="radiogroup" aria-labelledby="test-mode-selector" className={ [styles['qcf-FormSection'], styles['qcf-CustomRadioGroup']].join(' ') }>
                    <h4 id="test-mode-selector">Limite de temps du questionnaire</h4>
                    <button type="button" className={ styles['qcf-SelectorBtn'] } role="radio" aria-checked={ (testMode === "NO_TIME_LIMIT") } aria-labelledby="choice-NO_TIME_LIMIT" onClick={ () => changeTestConfig({ testMode: "NO_TIME_LIMIT" }) }><span id="choice-NO_TIME_LIMIT">{ testConfigLabels("NO_TIME_LIMIT") }</span></button>
                    <button type="button" className={ styles['qcf-SelectorBtn'] } disabled role="radio" aria-checked={ (testMode === "SOFT_TIME_LIMIT") } aria-labelledby="choice-SOFT_TIME_LIMIT" onClick={ () => changeTestConfig({ testMode: "SOFT_TIME_LIMIT" }) }><span id="choice-SOFT_TIME_LIMIT">{ testConfigLabels("SOFT_TIME_LIMIT") }</span></button>
                    <button type="button" className={ styles['qcf-SelectorBtn'] } disabled role="radio" aria-checked={ (testMode === "HARD_TIME_LIMIT") } aria-labelledby="choice-HARD_TIME_LIMIT" onClick={ () => changeTestConfig({ testMode: "HARD_TIME_LIMIT" }) }><span id="choice-HARD_TIME_LIMIT">{ testConfigLabels("HARD_TIME_LIMIT") }</span></button>
                </section>
            </div>
            <div className={ styles['qcf-ModalActions'] } role="group" aria-label="Actions liées à la configuration du test">
                <button type="button" onClick={ onCancelConfigurator }>Fermer le configurateur</button>
            </div>
        </form>
    )
}

export default QuestionnaireConfigurator;