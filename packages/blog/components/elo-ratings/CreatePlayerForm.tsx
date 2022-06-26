import { FC, FormEvent, MouseEvent, useCallback } from 'react';
import Image from '../ui-elements/Image';
import style from './CreatePlayerForm.module.scss';

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
        <form className={ style['cpf-Form'] } onSubmit={ onSubmitPlayer }>
            <h1 className={ style['cpf-ModalTitle'] }><Image alt="" src="/svg/undraw_handcrafts_user.svg" width="30" height="30" />Création d&apos;un nouveau joueur</h1>
            <div data-wrapper="form-control">
                <label htmlFor="player-info-name">Nom du joueur</label>
                <input type="text" id="player-info-name" name="name" required />
            </div>
            <div className={ style['cpf-ModalActions'] } role="group" aria-label="Actions liées à la création de joueurs">
                <button type="submit" data-case="once">Créer le joueur</button>
                <button type="submit" data-case="multiple">Créer le joueur et recommencer</button>
                <button type="button" onClick={ onCancelPlayer }>Annuler</button>
            </div>
        </form>
    )
}

export default CreatePlayerForm;