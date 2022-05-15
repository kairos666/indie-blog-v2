import type { NextPage } from 'next';
import Head from 'next/head';
import MathTeacher from '../../components/math-teacher/MathTeacher';
import styles from '../../styles/page-layouts/EloBoardPage.module.scss';

const MathTeacherApp: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Apprendre les tables de multiplication</title>
                <meta name="description" content="facilitateur d'apprentissage des tables de multiplication" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MathTeacher />
        </div>
    )
}

export default MathTeacherApp;
