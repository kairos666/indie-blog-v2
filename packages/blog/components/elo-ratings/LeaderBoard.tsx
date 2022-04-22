import { Player } from 'kai-elo-rating/types/types';
import styles from './LeaderBoard.module.scss';
import { FC, MouseEvent, useCallback } from 'react';
import { useTransition, animated } from '@react-spring/web';

type LeaderBoardProps = {
    players: Player[],
    onPlayerDetail: (playerId:number) => void,
    itemHeight: number
};

const LeaderBoard:FC<LeaderBoardProps> = ({ players, onPlayerDetail, itemHeight }) => {
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

    const onPlayerDetailCb = useCallback((playerId:number) => (evt:MouseEvent) => {
        evt.preventDefault();
        onPlayerDetail(playerId);
    }, [onPlayerDetail]);
    
    // empty roster case
    if(!players || players.length === 0) return (
        <aside className={ styles["lb-EmptyList"] }>
            <h1>Aucun participant enregistré</h1>
            <img src="/svg/undraw_handcrafts_cat.svg" width="150" height="150" />
            <ol className={ styles["lb-EmptyList_StarterSteps"] }>
                <li>Pour commencer, cliquez sur <strong>ajouter un joueur</strong> pour créer votre liste de participants</li>
                <li>Ensuite, cliquez sur <strong>ajouter un match</strong> pour créer un match entre vos participants</li>
                <li>Et voilà, à chaque fois qu'un nouveaux match entre participants est enregistré, leur score ELO est modifié en conséquence et le classement des participants évolue</li>
            </ol>
        </aside>
    )

    // nominal case with players in roster
    return (
        <ol style={ { height: `${ listHeight }px` } } className={ styles["lb-CardList"] }>
            {transitions((style, player, t, index) => (
                <animated.li style={{ position: 'absolute', willChange: 'transform, height, opacity', width: '100%', height: `${ itemHeight }px`, zIndex: players.length - index, ...style }}>
                    <button type="button" onClick={ onPlayerDetailCb(player.id) } className={ styles["lb-Card"] }>
                        <h2 className={ styles["lb-Card_Title"] }>{ player?.meta?.name }<span className={ styles["lb-Card_Score"] }>{ player.currentRank }<span>elo</span></span></h2>
                        {(player.matches.length === 0)
                            ? <p className={ styles["lb-Card_Subtext"] }>no match yet</p>
                            : (player.matches.length === 1)
                            ? <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } match played on <span>{ player.lastPlayed }</span></p>
                            : <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } matchs played, lastest on <span>{ player.lastPlayed }</span></p>
                        }
                    </button>
                </animated.li>
            ))}
        </ol>
    );
}

export default LeaderBoard;