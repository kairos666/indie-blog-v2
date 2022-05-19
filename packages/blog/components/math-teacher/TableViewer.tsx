import { FC } from 'react';
import { multiplicationTableBuilder } from 'kai-multiplication-table-teacher';
import styles from './TableViewer.module.scss';

type TableViewerProps = {
    viewTables:number[]
};

const TableViewer:FC<TableViewerProps> = ({ viewTables }) => {
    const tables = multiplicationTableBuilder(viewTables);

    return (
        <article className={ styles['tv-TablesContainer'] }>
            { tables.map((table, index) => {

                // evaluate mainParam & multiplicator characters count (to fine tune alignements)
                const maxMainParamCharacterCount:number = Math.max(...table.reduce((acc:number[], curr) => [...acc, curr.mainParam.toString().length], []));
                const maxMultiplicatorCharacterCount:number = Math.max(...table.reduce((acc:number[], curr) => [...acc, curr.multiplicator.toString().length], []));
                const maxResultChracterCount:number = Math.max(...table.reduce((acc:number[], curr) => [...acc, curr.result.toString().length], []));

                return (
                    <section className={ styles['tv-TableCard'] } key={ `learn-table-${ index + 1 }` }>
                        <header className={ styles['tv-TableCard_Header'] }>
                            <h1>Table de { table[0].mainParam }</h1>
                        </header>
                        <ol className={ styles['tv-TableCard_List'] }>
                            { table.map((entry, index, array) => {
                                const halfCaseClass:string = (index < array.length/2)
                                    ? `${ styles['tv-TableCard_ListEntry'] } ${ styles['tv-TableCard_ListEntry--first-half'] }`
                                    : `${ styles['tv-TableCard_ListEntry'] } ${ styles['tv-TableCard_ListEntry--second-half'] }`;

                                return (
                                    <li key={ `lear-multiplication-${ entry.mainParam }x${ entry.multiplicator }` } className={ halfCaseClass }>
                                        <span className={ styles['tv-TableCard_Calculus'] }>{ `${ offsetSpaces(entry.mainParam, maxMainParamCharacterCount, true) } X ${ offsetSpaces(entry.multiplicator, maxMultiplicatorCharacterCount, false) }` } </span>
                                        <span className={ styles['tv-TableCard_Equal'] }>=</span>
                                        <span className={ styles['tv-TableCard_Result'] }> { offsetSpaces(entry.result, maxResultChracterCount, true) }</span>
                                    </li>
                                );
                            })}
                        </ol>
                    </section>
                );
            })}
        </article>
    )
}

export default TableViewer;

/**
 * UTILITIES
 */
function offsetSpaces(originalValue:number|string, stringLength:number, preffixOffset:boolean):string {
    const originalString:string = String(originalValue);
    const originalStringLength:number = originalString.length;

    // check if offset is possible
    if(originalStringLength > stringLength) throw new Error(`offsetSpaces - impossible to offset string is to big, offset target is ${ stringLength }, value given is: ${ originalString } (length = ${ originalStringLength })`);
    
    return (preffixOffset)
        ? [...new Array(stringLength - originalStringLength).fill(' '), originalString].join('')
        : [originalString, ...new Array(stringLength - originalStringLength).fill(' ')].join('');
}