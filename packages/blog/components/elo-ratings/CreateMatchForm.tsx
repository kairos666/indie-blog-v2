import { FC, FormEvent, useCallback } from 'react';

type CreateMatchFormProps = {
    onSubmit: (params:{ playerAId:number, playerBId:number, matchOutcome:number }) => void
};

const CreateMatchForm:FC<CreateMatchFormProps> = ({ onSubmit }) => {
    const onSubmitMatch = useCallback((evt:FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const form = evt.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            "avsb-win": HTMLInputElement,
            "avsb-draw": HTMLInputElement,
            "avsb-loss": HTMLInputElement
        }
        const matchDescriptor = { 
            playerAId: 0, 
            playerBId: 1, 
            matchOutcome: (formElements['avsb-win'].checked)
                ? 1
                : (formElements['avsb-draw'].checked)
                ? 0.5
                : 0
        };

        console.log(formElements['avsb-win'].checked, formElements['avsb-draw'].checked, formElements['avsb-loss'].checked);
        onSubmit(matchDescriptor);
    }, [onSubmit]);

    return (
        <form onSubmit={ onSubmitMatch }>
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