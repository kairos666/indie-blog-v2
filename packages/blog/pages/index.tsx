import type { NextPage } from 'next';
import Head from 'next/head';
import CreateMatchForm from '../components/elo-ratings/CreateMatchForm';
import CreatePlayerForm from '../components/elo-ratings/CreatePlayerForm';
import LeaderBoard from '../components/elo-ratings/LeaderBoard';
import PlayerDetails from '../components/elo-ratings/PlayerDetails';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Blog</title>
                <meta name="description" content="Le blog de Kaïros" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Bienvenu dans le blog de Kaïros</h1>
                <CreateMatchForm/>
                <CreatePlayerForm/>
                <LeaderBoard/>
                <PlayerDetails/>
            </main>
        </div>
    )
}

export default Home;
