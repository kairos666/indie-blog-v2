import { Player } from 'kai-elo-rating/types/types';
import styles from '../../styles/LeaderBoard.module.scss';
import { FC } from 'react';

type LeaderBoardProps = {
    players: Player[]
};

const LeaderBoard:FC<LeaderBoardProps> = ({ players }) => {
    // empty roster case
    if(!players || players.length === 0) return (
        <p>empty leader board, register players first</p>
    )

    // sort players by rank
    const sortedPlayers = players.sort((a, b) => {
        return (a.currentRank > b.currentRank)
            ? -1
            : (a.currentRank < b.currentRank)
            ? 1
            : 0;
    });

    // nominal case with players in roster
    return (
        <ol className={ styles["lb-CardList"] }>
            { sortedPlayers.map(player => {
                return (
                    <li key={ player.id }>
                        <div className={ styles["lb-Card"] }>
                            <h2 className={ styles["lb-Card_Title"] }>{ player?.meta?.name }<span className={ styles["lb-Card_Score"] }>{ player.currentRank }<span>elo</span></span></h2>
                            {(player.matches.length === 0)
                                ? <p className={ styles["lb-Card_Subtext"] }>no match yet</p>
                                : (player.matches.length === 1)
                                ? <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } match played on <span>{ player.lastPlayed }</span></p>
                                : <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } matchs played, lastest on <span>{ player.lastPlayed }</span></p>
                            }
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export default LeaderBoard;