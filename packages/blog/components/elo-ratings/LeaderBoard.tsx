import { Player } from 'kai-elo-rating/types/types';
import { FC } from 'react';

type LeaderBoardProps = {
    players: Player[]
};

const LeaderBoard:FC<LeaderBoardProps> = ({ players }) => {
    // empty roster case
    if(!players || players.length === 0) return (
        <p>register players first</p>
    )

    // sort players by rank
    const sortedPlayers = players.sort((a, b) => {
        return (a.currentRank > b.currentRank)
            ? -1
            : (a.currentRank < b.currentRank)
            ? 1
            : 0;
    })

    return (
        <ol>
            { sortedPlayers.map(player => {
                return (
                    <li key={ player.id }>
                        <dl>
                            <dt>player #</dt><dd>{ player.id }</dd>
                            <dt>elo score</dt><dd>{ player.currentRank }</dd>
                            <dt>match played</dt><dd>{ player.matches.length }</dd>
                            <dt>last played</dt><dd>{ player.lastPlayed }</dd>
                        </dl>
                    </li>
                );
            })}
        </ol>
    );
}

export default LeaderBoard;