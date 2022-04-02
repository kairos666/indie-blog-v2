import { FC, FormEvent, useCallback } from 'react';

type CreatePlayerFormProps = {
    onSubmit: (meta:{ name:string }) => void
};

const CreatePlayerForm:FC<CreatePlayerFormProps> = ({ onSubmit }) => {
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

        onSubmit(playerMetaDescriptor);
    }, [onSubmit]);

    return (
        <form onSubmit={ onSubmitPlayer }>
            <fieldset>
                <legend>Player info</legend>
                <label htmlFor="player-info-name">name</label>
                <input type="text" id="player-info-name" name="name" required />
            </fieldset>
            <button type="submit">create player</button>
        </form>
    )
}

export default CreatePlayerForm;