import { FC } from 'react';
import styles from './MultiplicationTablesSelector.module.scss';

type MultiplicationTablesSelectorProps = {
    currentlySelected:number[]
    availableTables:number[]
    changeHandler: (mainParam:number) => void
};

const MultiplicationTablesSelector:FC<MultiplicationTablesSelectorProps> = ({ currentlySelected, availableTables, changeHandler }) => {
    const instanceID:number = 12; // TODO replace with useId (react 18)

    return (
        <>
            <span id={ `table-selector-${ instanceID }` } className={ styles['sr-only'] }>Sélection des tables de multiplication</span>
            <ol role="radiogroup" aria-labelledby={ `table-selector-${ instanceID }` } className={ styles['mts-MenuList'] }>
                { availableTables.map(entry => {
                    const isOn:boolean = currentlySelected.includes(entry);

                    return (
                        <li className={ styles['mts-MenuListItem'] } key={ entry }>
                            <button 
                                type="button" 
                                role="radio" 
                                className={ styles['mts-SelectorBtn'] }
                                aria-checked={ isOn } 
                                onClick={ () => changeHandler(entry) }
                                aria-labelledby={ `table-selector-${ instanceID }-entry-${ entry }` }
                            >
                                <span id={ `table-selector-${ instanceID }-entry-${ entry }` }>{ entry }</span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </>
    )
}

export default MultiplicationTablesSelector;