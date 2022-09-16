import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import MiniHero from '../components/layout/miniHero'
import FAQs from '../components/faq'
// import DashGraph from '../components/dashGraph' // To implement later - NON MVP



export default function Page() {

    let headlineText = "This isn't ready yet... but it's coming soon!"

    return (
        <div className={styles.container}>
            <Head>
            <title>Fantasy VORP Beta - Coming Soon!</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>

                <MiniHero headline={headlineText} />

            </main>
        </div>

    )
}