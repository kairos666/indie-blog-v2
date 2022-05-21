import { Player } from 'kai-elo-rating/types/types';
import { FC, useCallback, MouseEvent } from 'react';
import Image from '../ui-elements/Image';
import style from './PlayerDetails.module.scss';

type PlayerDetailsProps = {
    player: Player
    onCancel: () => void
};

const PlayerDetails:FC<PlayerDetailsProps> = ({ player, onCancel }) => {
    const onCancelPlayer = useCallback((evt:MouseEvent) => {
        evt.preventDefault();
        onCancel();
    }, [onCancel]);

    return (
        <>
            <h1 className={ style['pdtl-ModalTitle'] }><Image alt="" src="/svg/undraw_handcrafts_man.svg" width="30" height="30" />{ player?.meta?.name }</h1>
            <p>rang: #2</p>
            <p>elo score: { player.currentRank }</p>
            <section>
                <h2>Résultats des matchs</h2>
                <p>8 victoires</p>
                <p>3 défaites</p>
                <p>1 match nul</p>
                <p><b>12 matchs joués</b></p>
            </section>
            <section>
                <h2>Evolution du score elo</h2>
                <p>graph chronologique du score elo</p>
            </section>
            <section>
                <h2>Evolution du rang</h2>
                <p>graph chronologique du rang par rapport ux autres joueurs</p>
            </section>
            <section>
                <h2>Chances de succès face aux autres joueurs</h2>
                <p>Lister les stats de succès comparé aux autres joueurs</p>
            </section>
            <section>
                <h2>Chronologie de matchs</h2>
                <ol>
                    {player.matches.map(matchId => {
                        const fakeResult = Math.round(Math.random() * 2);
                        return (
                            <li key={ matchId }>
                                <p>{ fakeResult < 1 ? 'gagné' : fakeResult > 1 ? 'perdu' : 'match nul' }</p>
                                <p>Opposant: Rick Petulante</p>
                                <p>Joué le: 12/04/2022</p>
                            </li>
                        );
                    })}
                </ol>
            </section>
            <div className={ style['pdtl-ModalActions'] } role="group" aria-label="Actions liées à la création de matchs">
                <button type="button" onClick={ onCancelPlayer }>Annuler</button>
            </div>
        </>
    )
}

export default PlayerDetails;