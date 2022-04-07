import { FC, useCallback, useRef, useState } from 'react';
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

    /* callbacks */
    const updatePlayersRoster = useCallback(() => {
        setPlayers(eloBoardBackend.current.getAllPlayers());
    }, [eloBoardBackend, setPlayers]);

    const createPlayer = useCallback((meta:any) => {
        try {
            eloBoardBackend.current.createPlayer({ meta });
            updatePlayersRoster();
        } catch(err) {
            console.warn(err);
        }
    }, [eloBoardBackend, updatePlayersRoster]);

    const createMatch = useCallback(({ playerAId, playerBId, matchOutcome }) => {
        try {
            eloBoardBackend.current.createMatch({ playerAId, playerBId, matchOutcome });
            updatePlayersRoster();
        } catch(err) {
            console.warn(err);
        }
    }, [eloBoardBackend, updatePlayersRoster]);

    return (
        <AppFrame desktopBreakpoint={ 1000 } actionsChildren={ <button>pouet</button> }>
            <CreateMatchForm players={ players } onSubmit={ createMatch }/>
            <CreatePlayerForm onSubmit={ createPlayer }/>
            <LeaderBoard players={ players } itemHeight={ 100 } />
            <PlayerDetails/>
        </AppFrame>
    )
}

export default EloBoard;