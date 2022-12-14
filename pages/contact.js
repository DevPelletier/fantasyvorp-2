import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import MiniHero from '../components/layout/miniHero'
import FAQs from '../components/faq'
// import DashGraph from '../components/dashGraph' // To implement later - NON MVP



export default function Page() {

    let headlineText = "Contact Me"

    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <MiniHero headline={headlineText} />
                <section className="copySection">
                    <p>Have a feature request? Found a bug? Want to know who you should draft at X position? I may not have all the answers, but come on down!</p>
                    <p>Contact me at: <br />
                    <strong>hello@fantasyvorp.com</strong></p>
                    <p>This is a one man project, so please be patient with response times ❤️</p>
                </section>

            </main>
        </div>

    )
}
