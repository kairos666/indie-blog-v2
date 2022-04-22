import { FC, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import CreateMatchForm from './CreateMatchForm';
import CreatePlayerForm from './CreatePlayerForm';
import LeaderBoard from './LeaderBoard';
import PlayerDetails from './PlayerDetails';
import { EloRankingBoardInMemory, fixedKFactorRuleMaker } from 'kai-elo-rating';
import AppFrame, { ActionMenu, Detail } from '../ui-elements/AppFrame';

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

    // cancel modal
    const cancelModal = useCallback(() => {
        setModalElement(null);
    }, []);

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
        setModalElement(<CreatePlayerForm onSubmit={ createPlayer } onCancel={ cancelModal }/>);
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
        setModalElement(<CreateMatchForm players={ players } onSubmit={ createMatch } onCancel={ cancelModal }/>);
    }, [players, createMatch]);

    // see player detail
    const createPlayerDetailTriggerCb = useCallback(playerId => {
        const playerData = eloBoardBackend.current.getPlayer(playerId);

        // only trigger modal when player data exists
        if(playerData !== null) setModalElement(<PlayerDetails player={ playerData } onCancel={ cancelModal } />);
    }, [eloBoardBackend]);

    return (
        <AppFrame desktopBreakpoint={ 1000 }>
            <ActionMenu>
                <button type="button" onClick={ createPlayerTriggerCb }>Ajouter un joueur</button>
                <button type="button" onClick={ createMatchTriggerCb }>Ajouter un match</button>
            </ActionMenu>
            <LeaderBoard players={ players } onPlayerDetail={ createPlayerDetailTriggerCb } itemHeight={ 100 } />
            { modalElement ? <Detail>{ modalElement }</Detail> : null }
        </AppFrame>
    )
}

export default EloBoard;