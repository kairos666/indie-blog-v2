import { Player } from 'kai-elo-rating/types/types';
import { FC, useCallback, MouseEvent } from 'react';
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
            <h1 className={ style['cpf-ModalTitle'] }><img src="/svg/undraw_handcrafts_user.svg" width="30" height="30" />Joueur #{ player.id }</h1>
            <p>{ player.currentRank }</p>
            <p>TODO get player data + match data and display fun stuff about it (https://popper.js.org/react-popper/v2/virtual-elements/)</p>
            <div className={ style['cmf-ModalActions'] } role="group" aria-label="Actions liées à la création de matchs">
                <button type="button" onClick={ onCancelPlayer }>Annuler</button>
            </div>
        </>
    )
}

export default PlayerDetails;