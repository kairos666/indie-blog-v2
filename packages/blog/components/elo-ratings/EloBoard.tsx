import { FC } from 'react';
import CreateMatchForm from './CreateMatchForm';
import CreatePlayerForm from './CreatePlayerForm';
import LeaderBoard from './LeaderBoard';
import PlayerDetails from './PlayerDetails';

type EloBoardProps = {};

const EloBoard:FC<EloBoardProps> = () => {
    return (
        <article>
            <CreateMatchForm/>
            <CreatePlayerForm/>
            <LeaderBoard/>
            <PlayerDetails/>
        </article>
    )
}

export default EloBoard;