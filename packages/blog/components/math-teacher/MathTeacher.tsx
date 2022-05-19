import { FC } from 'react';
import { useMathTeacherState } from '../../state-managers-hooks/match-teacher/useMathTeacherState';
import AppFrame, { ActionMenu } from '../ui-elements/AppFrame';
import MultiplicationTablesSelector from './MultiplicationTablesSelector';
import TableViewer from './TableViewer';
//import style from './MathTeacher.module.scss'; stylesheet already created

type MathTeacherProps = {};

const MathTeacher:FC<MathTeacherProps> = () => {
    const { activityState, learn, changeGlobalState } = useMathTeacherState();

    return (
        <AppFrame desktopBreakpoint={ 1000 }>
            <ActionMenu>
                <button type="button" aria-pressed={ (activityState === "LEARN") } disabled={ (activityState === "LEARN") } onClick={ () => changeGlobalState("LEARN") }>Réviser mes tables</button>
                <button type="button" aria-pressed={ (activityState === "TEST") } disabled={ (activityState === "TEST") } onClick={ () => changeGlobalState("TEST") } >Tester mes tables</button>
            </ActionMenu>
            {(activityState === "TEST")
                ?   <TestView>
                        <p>contenu bears: { activityState }</p>
                        <p>contenu bears: { learn.selectedTables.join(', ') }</p>
                        <p>contenu bears: { learn.availableTables.join(', ') }</p>
                    </TestView>
                :   <LearnView currentlySelected={ learn.selectedTables } availableTables={ learn.availableTables } changeHandler={ learn.toggleSelectedTable } />
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

/**
 * TEST VIEW SUB COMPONENT
 */
type TestViewProps = {}

export const TestView:FC<TestViewProps> = ({ children }) => (
    <>
        <p>TEST VIEW</p>
        { children }
    </>
);