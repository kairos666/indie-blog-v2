import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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
                <Link href='/mini-app/elo-board'><a>app de gestion de ranking elo</a></Link>
                <Link href='/mini-app/multiplication-table-teacher'><a>app pour apprendre les tables de multiplications</a></Link>
            </main>
        </div>
    )
}

export default Home;
