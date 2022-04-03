import type { NextPage } from 'next';
import Head from 'next/head';
import EloBoard from '../../components/elo-ratings/EloBoard';
import styles from '../../styles/EloBoardPage.module.scss';

const EloBoardApp: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>ELO ranking</title>
                <meta name="description" content="mini application de score ELO" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <EloBoard initialRank={ 1000 } kFactor={ 32 } />
        </div>
    )
}

export default EloBoardApp;
