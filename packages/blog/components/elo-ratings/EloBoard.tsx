import { FC, useCallback, useRef, useState } from 'react';
import CreateMatchForm from './CreateMatchForm';
import CreatePlayerForm from './CreatePlayerForm';
import LeaderBoard from './LeaderBoard';
import PlayerDetails from './PlayerDetails';
import { EloRankingBoardInMemory, fixedKFactorRuleMaker } from 'kai-elo-rating';

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

    const createPlayer = useCallback(() => {
        try {
            const player = eloBoardBackend.current.createPlayer();
            updatePlayersRoster();
            console.log('create player', player);
        } catch(err) {
            console.warn(err);
        }
    }, [eloBoardBackend, updatePlayersRoster]);

    const createMatch = useCallback(({ playerAId, playerBId, matchOutcome }) => {
        try {
            const match = eloBoardBackend.current.createMatch({ playerAId, playerBId, matchOutcome });
            updatePlayersRoster();
            console.log('create match', match);
        } catch(err) {
            console.warn(err);
        }
    }, [eloBoardBackend, updatePlayersRoster]);

    return (
        <article>
            <CreateMatchForm players={ players } onSubmit={ createMatch }/>
            <CreatePlayerForm onSubmit={ createPlayer }/>
            <LeaderBoard players={ players }/>
            <PlayerDetails/>
        </article>
    )
}

export default EloBoard;