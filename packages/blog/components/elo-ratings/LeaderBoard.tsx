import { Player } from 'kai-elo-rating/types/types';
import styles from './LeaderBoard.module.scss';
import { FC, MouseEvent, useCallback } from 'react';
import { useTransition, animated } from '@react-spring/web';
import Image from '../ui-elements/Image';

type LeaderBoardProps = {
    players: Player[],
    selectedPlayer: null|number,
    onPlayerSelect: (playerId:number) => void,
    itemHeight: number
};

const LeaderBoard:FC<LeaderBoardProps> = ({ players, selectedPlayer, onPlayerSelect, itemHeight }) => {
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
        onPlayerSelect(playerId);
    }, [onPlayerSelect]);
    
    // empty roster case
    if(!players || players.length === 0) return (
        <aside className={ styles["lb-EmptyList"] }>
            <h1>Aucun participant enregistré</h1>
            <Image src="/svg/undraw_handcrafts_cat.svg" alt="" width="150" height="150" />
            <ol className={ styles["lb-EmptyList_StarterSteps"] }>
                <li>Pour commencer, cliquez sur <strong>ajouter un joueur</strong> pour créer votre liste de participants</li>
                <li>Ensuite, cliquez sur <strong>ajouter un match</strong> pour créer un match entre vos participants</li>
                <li>Et voilà, à chaque fois qu&apos;un nouveaux match entre participants est enregistré, leur score ELO est modifié en conséquence et le classement des participants évolue</li>
            </ol>
        </aside>
    )

    // nominal case with players in roster
    return (
        <ol style={ { height: `${ listHeight }px` } } className={ styles["lb-CardList"] }>
            {transitions((style, player, t, index) => {
                const isSelectedPlayer = (player.id === selectedPlayer);
                const cardClasses = `${ styles["lb-Card"] } ${ isSelectedPlayer ? styles["lb-Card--selected"] : '' }`;
                const onClickHandler = isSelectedPlayer
                    ? () => {}
                    : onPlayerDetailCb(player.id);

                return (
                    <animated.li style={{ position: 'absolute', willChange: 'transform, height, opacity', width: '100%', height: `${ itemHeight }px`, zIndex: players.length - index, ...style }}>
                        <button type="button" onClick={ onClickHandler } className={ cardClasses }>
                            <h2 className={ styles["lb-Card_Title"] }>{ player?.meta?.name }</h2>
                            {(player.matches.length === 0)
                                ? <p className={ styles["lb-Card_Subtext"] }>no match yet</p>
                                : (player.matches.length === 1)
                                ? <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } match played on <span>{ player.lastPlayed }</span></p>
                                : <p className={ styles["lb-Card_Subtext"] }>{ player.matches.length } matchs played, lastest on <span>{ player.lastPlayed }</span></p>
                            }
                            <span className={ styles["lb-Card_Score"] }>{ player.currentRank }<span>elo</span></span>
                        </button>
                    </animated.li>
                )
            })}
        </ol>
    );
}

export default LeaderBoard;