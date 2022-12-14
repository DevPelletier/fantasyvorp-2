import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import MiniHero from '../components/layout/miniHero'
import FAQs from '../components/faq'
// import DashGraph from '../components/dashGraph' // To implement later - NON MVP



export default function Page() {

    let headlineText = "Changelog & Upcoming Features"

    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <MiniHero headline={headlineText} />

                <section className="copySection">
                    <h2>Upcoming Features</h2>
                    <ul>
                        <li>
                            <p>
                            Add CSV Download of your league VORP data capability
                            </p>
                        </li>
                        <li>
                            <p>
                            Add “Drafted” feature to DataTable, in order to use the table as a Live Draft Guide/Tool (ability to toggle visibility of all individual players, to show the remaining draft board, players’ available without keepers, etc.)
                            </p>
                        </li>
                        <li>
                            <p>
                            Add compatibility with ESPN and Fantrax leagues     
                            </p>                   
                        </li>
                        <li>
                        <p>
                        Add ADPs from each of the major fantasy apps, with differences relative to projected VORP ranks                        
                        </p>
                        </li>
                        <li>
                        <p>
                        Add Positional Distribution graphs for each custom league setting --- Draft Strategy visualization
                        </p>
                        </li>
                        <li>
                        <p>
                        Add schedule data and features into existing data table 
                        </p>                       
                        </li>
                        <li>
                        <p>
                        Add custom flags for players in notable situations (e.g. New Team, Off-Season Surgery, Rookie, etc)
                        </p>
                        </li>
                        <li>
                        <p>
                        Add Auction Draft values and calculation capability
                        </p>
                        </li>
                        <li>
                            <p>
                            Add Salaries
                            </p>
                        </li>
                        <li>
                            <p>
                            Add functionality for… basketball?
                            </p>
                        </li>
                        <li>
                        <p>
                            And lastly... <strong>Add User Login and Dashboard functionality to track LIVE STATS throughout the Season with VORP analysis, trends, and more!</strong>.
                            </p>
                            <p>
                            This is a big one in the works - announcement to follow...
                            </p>
                        </li>
                    </ul>
                    <h2>Changelog</h2>
                    <p>I just launched this today! Give me a break.</p>
                </section>


            </main>
        </div>

    )
}
