import { FC } from 'react';

type CreatePlayerFormProps = {
    onSubmit: Function
};

const CreatePlayerForm:FC<CreatePlayerFormProps> = ({ onSubmit }) => {
    return (
        <form onSubmit={ evt => { evt.preventDefault(); onSubmit() } }>
            <button type="submit">create player</button>
        </form>
    )
}

export default CreatePlayerForm;