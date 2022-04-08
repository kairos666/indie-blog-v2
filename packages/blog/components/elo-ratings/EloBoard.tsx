import { FC, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import CreateMatchForm from './CreateMatchForm';
import CreatePlayerForm from './CreatePlayerForm';
import LeaderBoard from './LeaderBoard';
import PlayerDetails from './PlayerDetails';
import { EloRankingBoardInMemory, fixedKFactorRuleMaker } from 'kai-elo-rating';
import AppFrame from '../ui-elements/AppFrame';

type EloBoardProps = {
    initialRank: number,
    kFactor: number
};

const EloBoard:FC<EloBoardProps> = ({ initialRank, kFactor }) => {
    // instance of in memory elo board class
    const eloBoardBackend = useRef(new EloRankingBoardInMemory(initialRank, fixedKFactorRuleMaker(kFactor)));
    // players roster collection
    const [players, setPlayers] = useState(eloBoardBackend.current.getAllPlayers());
    // modals/drawer state (null if closed)
    const [modalElement, setModalElement] = useState((null as ReactNode|null))

    /************** callbacks *************/
    const updatePlayersRoster = useCallback(() => {
        setPlayers(eloBoardBackend.current.getAllPlayers());
    }, [eloBoardBackend, setPlayers]);

    // player handling
    const createPlayer = useCallback((meta:any) => {
        try {
            eloBoardBackend.current.createPlayer({ meta });
            updatePlayersRoster();
        } catch(err) {
            console.warn(err);
        }
    }, [eloBoardBackend, updatePlayersRoster]);

    const createPlayerTriggerCb = useCallback(() => {
        setModalElement(<CreatePlayerForm onSubmit={ createPlayer }/>);
    }, [createPlayer]);

    // match handling
    const createMatch = useCallback(({ playerAId, playerBId, matchOutcome }) => {
        try {
            eloBoardBackend.current.createMatch({ playerAId, playerBId, matchOutcome });
            updatePlayersRoster();
        } catch(err) {
            console.warn(err);
        }
    }, [eloBoardBackend, updatePlayersRoster]);

    const createMatchTriggerCb = useCallback(() => {
        setModalElement(<CreateMatchForm players={ players } onSubmit={ createMatch }/>);
    }, [players, createMatch]);

    /************** pre render data *************/
    const appFrameProps = useMemo(() => ({
        desktopBreakpoint: 1000, // breakpoint switch between mobile / desktop RWD style
        actionsChildren: <ActionMenu createPlayerTriggerCb={ createPlayerTriggerCb } createMatchTriggerCb={ createMatchTriggerCb } />,
        modal: modalElement
    }), [modalElement, createPlayerTriggerCb, createMatchTriggerCb]);

    return (
        <AppFrame {...appFrameProps}>
            <LeaderBoard players={ players } itemHeight={ 100 } />
            <PlayerDetails/>
        </AppFrame>
    )
}

export default EloBoard;

type ActionMenuProps = {
    createPlayerTriggerCb: () => void,
    createMatchTriggerCb: () => void
};

/* sub components */
const ActionMenu:FC<ActionMenuProps> = ({ createPlayerTriggerCb, createMatchTriggerCb }) => {
    return (
        <>
            <button type="button" onClick={ createPlayerTriggerCb }>create player</button>
            <button type="button" onClick={ createMatchTriggerCb }>create match</button>
        </>
    )
}