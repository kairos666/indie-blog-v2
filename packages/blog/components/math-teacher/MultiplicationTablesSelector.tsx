import { FC } from 'react';
import styles from './MultiplicationTablesSelector.module.scss';

type MultiplicationTablesSelectorProps = {
    currentlySelected:number[]
    availableTables:number[]
    changeHandler: (mainParam:number) => void
};

const MultiplicationTablesSelector:FC<MultiplicationTablesSelectorProps> = ({ currentlySelected, availableTables, changeHandler }) => {
    return (
        <ol className={ styles['mts-MenuList'] }>
            { availableTables.map(entry => {
                return (
                    <li className={ styles['mts-MenuListItem'] } key={ entry }>
                        <button type="button" className={ styles['mts-SelectorBtn'] } aria-pressed={ currentlySelected.includes(entry) } onClick={ () => changeHandler(entry) } >{ entry }</button>
                    </li>
                );
            })}
        </ol>
    )
}

export default MultiplicationTablesSelector;