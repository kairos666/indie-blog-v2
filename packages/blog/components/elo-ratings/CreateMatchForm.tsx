import { Player } from 'kai-elo-rating/types/types';
import { FC, FormEvent, useCallback, useState } from 'react';

type CreateMatchFormProps = {
    onSubmit: (params:{ playerAId:number, playerBId:number, matchOutcome:number }) => void,
    players: Player[]
};

const CreateMatchForm:FC<CreateMatchFormProps> = ({ players, onSubmit }) => {
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

        onSubmit(matchDescriptor);
    }, [onSubmit]);

    return (
        <form onSubmit={ onSubmitMatch }>
            <fieldset>
                <legend>match line up</legend>
                <label htmlFor="player-a-selector">Player A</label>
                <select name="player-a" id="player-a-selector" onChange={ onPlayerSelectChange('A') } required>
                    <option value="">Choose a player for player A</option>
                    {players.map(player => {
                        return <option value={ player.id } key={ player.id } disabled={ (player.id === playerSelection[1]) }>{ player?.meta?.name } (player #{ player.id }, elo score: { player.currentRank })</option>
                    })}
                </select>
                <label htmlFor="player-b-selector">Player B</label>
                <select name="player-b" id="player-b-selector" onChange={ onPlayerSelectChange('B') } required>
                    <option value="">Choose a player for player B</option>
                    {players.map(player => {
                        return <option value={ player.id } key={ player.id } disabled={ (player.id === playerSelection[0]) }>{ player?.meta?.name } (player #{ player.id }, elo score: { player.currentRank })</option>
                    })}
                </select>
            </fieldset>
            <fieldset>
                <legend>match outcome</legend>
                <ul>
                    <li>
                        <input type="radio" value="win" id="avsb-win" name="avsb" required /> 
                        <label htmlFor="avsb-win">A wins</label>
                    </li>
                    <li>
                        <input type="radio" value="draw" id="avsb-draw" name="avsb" /> 
                        <label htmlFor="avsb-draw">draw</label>
                    </li>
                    <li>
                        <input type="radio" value="loss" id="avsb-loss"  name="avsb" /> 
                        <label htmlFor="avsb-loss">B wins</label>
                    </li>
                </ul>
            </fieldset>
            <button type="submit">create match</button>
        </form>
    )
}

export default CreateMatchForm;