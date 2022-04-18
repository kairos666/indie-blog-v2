import { Player } from 'kai-elo-rating/types/types';
import { FC, FormEvent, useCallback, useState, MouseEvent } from 'react';
import style from './CreateMatchForm.module.scss';

type CreateMatchFormProps = {
    onSubmit: (params:{ playerAId:number, playerBId:number, matchOutcome:number }) => void,
    onCancel: () => void
    players: Player[]
};

const CreateMatchForm:FC<CreateMatchFormProps> = ({ players, onSubmit, onCancel }) => {
    // ensure player A & B are different
    const [playerSelection, setPlayerSelection] = useState(([null, null] as [number|null, number|null]));
    const onPlayerSelectChange = useCallback((playerSide:"A"|"B") => (evt:FormEvent<HTMLSelectElement>) => {
        const playerIndex = (playerSide === "A") ? 0 : 1;
        const playerValue = (evt?.currentTarget?.value !== "")
            ? parseInt(evt.currentTarget.value)
            : null;

        let newPlayerSelection = [...playerSelection];
        newPlayerSelection[playerIndex] = playerValue;
        
        setPlayerSelection((newPlayerSelection as [number|null, number|null]));
    }, [playerSelection, setPlayerSelection]);

    // handle match parameters to be sent to submit function from parent component
    const onSubmitMatch = useCallback((evt:FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const form = evt.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            "player-a": HTMLSelectElement,
            "player-b": HTMLSelectElement,
            "avsb-win": HTMLInputElement,
            "avsb-draw": HTMLInputElement,
            "avsb-loss": HTMLInputElement
        }
        const matchDescriptor = { 
            playerAId: parseInt(formElements['player-a'].value), 
            playerBId: parseInt(formElements['player-b'].value),
            matchOutcome: (formElements['avsb-win'].checked)
                ? 1
                : (formElements['avsb-draw'].checked)
                ? 0.5
                : 0
        };

        // execute submission
        onSubmit(matchDescriptor);

        // execute follow-up based on use case
        const submitter:HTMLButtonElement = (evt as any)?.nativeEvent?.submitter;
        if(submitter && submitter.getAttribute("data-case") === "once") onCancel();

        // otherwise, rerender will directly retrigger modal
    }, [onSubmit]);

    const onCancelMatch = useCallback((evt:MouseEvent) => {
        evt.preventDefault();
        onCancel();
    }, [onCancel]);

    return (
        <form className={ style['cmf-Form'] } onSubmit={ onSubmitMatch }>
            <h1 className={ style['cmf-ModalTitle'] }><img src="/svg/undraw_handcrafts_exclamation_mark.svg" width="30" height="30" />Création d'un nouveau match</h1>
            <fieldset>
                <legend>Joueurs du match</legend>
                <div data-wrapper="form-control">
                    <label htmlFor="player-a-selector">Participant A</label>
                    <select name="player-a" id="player-a-selector" onChange={ onPlayerSelectChange('A') } required>
                        <option value="">Choisir un participant</option>
                        {players.map(player => {
                            return <option value={ player.id } key={ player.id } disabled={ (player.id === playerSelection[1]) }>{ player?.meta?.name } (player #{ player.id }, elo score: { player.currentRank })</option>
                        })}
                    </select>
                </div>
                <div data-wrapper="form-control">
                    <label htmlFor="player-b-selector">Participant B</label>
                    <select name="player-b" id="player-b-selector" onChange={ onPlayerSelectChange('B') } required>
                        <option value="">Choisir un participant</option>
                        {players.map(player => {
                            return <option value={ player.id } key={ player.id } disabled={ (player.id === playerSelection[0]) }>{ player?.meta?.name } (player #{ player.id }, elo score: { player.currentRank })</option>
                        })}
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <legend>Résultat du match</legend>
                <ul className={ style['cmf-Form_RadioGroup'] }>
                    <li>
                        <div data-wrapper="form-control">
                            <input type="radio" value="win" id="avsb-win" name="avsb" required /> 
                            <label htmlFor="avsb-win">A wins</label>
                        </div>
                    </li>
                    <li>
                        <div data-wrapper="form-control">
                            <input type="radio" value="draw" id="avsb-draw" name="avsb" /> 
                            <label htmlFor="avsb-draw">draw</label>
                        </div>
                    </li>
                    <li>
                        <div data-wrapper="form-control">
                            <input type="radio" value="loss" id="avsb-loss"  name="avsb" /> 
                            <label htmlFor="avsb-loss">B wins</label>
                        </div>
                    </li>
                </ul>
            </fieldset>
            <div className={ style['cmf-ModalActions'] } role="group" aria-label="Actions liées à la création de matchs">
                <button type="submit" data-case="once">Créer le match</button>
                <button type="submit" data-case="multiple">Créer le match et recommencer</button>
                <button type="button" onClick={ onCancelMatch }>Annuler</button>
            </div>
        </form>
    )
}

export default CreateMatchForm;