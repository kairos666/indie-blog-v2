import { FC, FormEvent, MouseEvent, useCallback } from 'react';

type CreatePlayerFormProps = {
    onSubmit: (meta:{ name:string }) => void,
    onCancel: () => void
};

const CreatePlayerForm:FC<CreatePlayerFormProps> = ({ onSubmit, onCancel }) => {
    // handle player parameters to be sent to submit function from parent component
    const onSubmitPlayer = useCallback((evt:FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const form = evt.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            "name": HTMLInputElement
        }
        const playerMetaDescriptor = { 
            name: formElements['name'].value
        };

        // execute submission
        onSubmit(playerMetaDescriptor);

        // execute follow-up based on use case
        const submitter:HTMLButtonElement = (evt as any)?.nativeEvent?.submitter;
        if(submitter && submitter.getAttribute("data-case") === "once") onCancel();

        // otherwise, rerender will directly retrigger modal
    }, [onSubmit, onCancel]);

    const onCancelPlayer = useCallback((evt:MouseEvent) => {
        evt.preventDefault();
        onCancel();
    }, [onCancel]);

    return (
        <form onSubmit={ onSubmitPlayer }>
            <fieldset>
                <legend>Nouveau joueur</legend>
                <label htmlFor="player-info-name">Nom du joueur</label>
                <input type="text" id="player-info-name" name="name" required />
            </fieldset>
            <button type="submit" data-case="once">Créer joueur et fermer</button>
            <button type="submit" data-case="multiple">Créer plusieurs joueurs à la suite</button>
            <button type="button" onClick={ onCancelPlayer }>Annuler</button>
        </form>
    )
}

export default CreatePlayerForm;