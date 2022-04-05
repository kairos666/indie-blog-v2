import { Player } from 'kai-elo-rating/types/types';
import styles from '../../styles/LeaderBoard.module.scss';
import { FC } from 'react';
import { useTransition, animated } from '@react-spring/web';

type LeaderBoardProps = {
    players: Player[],
    itemHeight: number
};

const LeaderBoard:FC<LeaderBoardProps> = ({ players, itemHeight }) => {
    // empty roster case
    if(!players || players.length === 0) return (
        <p>empty leader board, register players first</p>
    )

    // list height (all items have the same height)
    const listHeight = itemHeight * players.length;

    // sort players by rank
    const sortedPlayers = players.sort((a, b) => {
        return (a.currentRank > b.currentRank)
            ? -1
            : (a.currentRank < b.currentRank)
            ? 1
            : 0;
    });

    const transitions = useTransition(
        sortedPlayers.map((item, index) => ({ ...item, y: index * itemHeight })),
        {
            keys: (item:any) => item.id,
            from: { opacity:0 },
            leave: { opacity:0 },
            enter: (extendedPlayer:any) => ({ y: extendedPlayer.y, opacity: 1 }),
            update: (extendedPlayer:any) => ({ y: extendedPlayer.y })
        }
    );

    // nominal case with players in roster
    return (
        <ol style={ { height: `${ listHeight }px` } } className={ styles["lb-CardList"] }>
            {transitions((style, player, t, index) => (
                <animated.li style={{ position: 'absolute', willChange: 'transform, height, opacity', width: '100%', height: `${ itemHeight }px`, zIndex: players.length - index, ...style }}>
                    <div className={ styles["lb-Card"] }>
                        <h2 className={ styles["lb-Card_Title"] }>{ player?.meta?.name }<span className={ styles["lb-Card_Score"] }>{ player.currentRank }<span>elo</span></span></h2>
                        {(player.matches.length === 0)
                            ? <p className={ styles["lb-Card_Subtext"] }>no match yet</p>
                            : (player.matches.length === 1)
                            ? <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } match played on <span>{ player.lastPlayed }</span></p>
                            : <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } matchs played, lastest on <span>{ player.lastPlayed }</span></p>
                        }
                    </div>
                </animated.li>
            ))}
        </ol>
    );
}

export default LeaderBoard;