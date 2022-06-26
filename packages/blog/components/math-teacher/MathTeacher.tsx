import { FC, ReactNode, useCallback, useState } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import shallow from 'zustand/shallow';
import AppFrame, { ActionMenu, Detail } from '../ui-elements/AppFrame';
import MultiplicationTablesSelector from './MultiplicationTablesSelector';
import TableViewer from './TableViewer';
import TestView from './TestView';
import styles from './MathTeacher.module.scss';

type MathTeacherProps = {};

const MathTeacher:FC<MathTeacherProps> = () => {
    const { activityState, learn, changeGlobalState, testState } = useMathTeacherState(state => ({
        activityState: state.activityState, 
        learn: state.learn, 
        testState: state.test.testState,
        changeGlobalState: state.changeGlobalState
    }), shallow);

    // centralize modal details from test view
    const [modal, setModal] = useState((null as ReactNode|null));
    const displayDetailHandler = useCallback((modalChildren:ReactNode|null) => { setModal(modalChildren) }, [setModal]);

    return (
        <AppFrame desktopBreakpoint={ 1000 }>
            <ActionMenu>
                <button type="button" className={ styles["nav-NavBtn"] } title={ (testState === 'RUN_TEST') ? "test en cours, impossible de tricher" : "Afficher les tables de multiplication" } aria-pressed={ (activityState === "LEARN") } disabled={ (activityState === "LEARN") || (testState === 'RUN_TEST') } onClick={ () => changeGlobalState("LEARN") }>Réviser mes tables</button>
                <button type="button" className={ styles["nav-NavBtn"] } title="Tester mes connaissances sur les tables de multiplication" aria-pressed={ (activityState === "TEST") } disabled={ (activityState === "TEST") } onClick={ () => changeGlobalState("TEST") } >Tester mes tables</button>
            </ActionMenu>
            {(activityState === "TEST")
                ?   <TestView displayDetailHandler={ displayDetailHandler } />
                :   <LearnView currentlySelected={ learn.selectedTables } availableTables={ learn.availableTables } changeHandler={ learn.toggleSelectedTable } />
            }
            {(modal !== null)
                ?   <Detail>{ modal }</Detail>
                :   null
            }
        </AppFrame>
    )
}

export default MathTeacher;

/**
 * LEARN VIEW SUB COMPONENT
 */
type LearnViewProps = {
    currentlySelected:number[]
    availableTables:number[]
    changeHandler: (mainParam:number) => void
}

export const LearnView:FC<LearnViewProps> = ({ currentlySelected, availableTables, changeHandler }) => (
    <>
        <MultiplicationTablesSelector currentlySelected={ currentlySelected } availableTables={ availableTables } changeHandler={ changeHandler } />
        <TableViewer viewTables={ currentlySelected } />
    </>
);