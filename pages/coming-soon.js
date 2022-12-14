import Head from 'next/head'
import styles from '../styles/Home.module.scss'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { supabase } from '../utils/supabaseClient'


import MiniHero from '../components/layout/miniHero'
import FAQs from '../components/faq'
// import DashGraph from '../components/dashGraph' // To implement later - NON MVP



export default function Page() {
    const { watch, control, handleSubmit, errors, setValue } = useForm();

    const submitUserEmail = async (formData) => {
        let userEmail = formData.lsRequestEmail
        const { data, error } = await supabase
            .from('UserList')
            .insert([{ email: userEmail }])
        if (error) {
          console.log('error')
          console.log(error.message)
          alert("Uh oh, looks there was an issue with submitting your email. Try refreshing the page and submitting again. If the issue persists, please submit the issue to hello@fantasyvorp.com")
          return // abort
        }
        console.log('email submitted')
        alert("Thanks for signing up for updates from FantasyVORP.com! We'll send you updates on new features over the coming weeks leading up to the 22-23 season. Cheers!")
        return data;
      }
    

    let headlineText = "This isn't ready yet... but it's coming soon!"
    let form = (
        <form onSubmit={handleSubmit(submitUserEmail)}>
            <div className="form_group_container miniHeroForm">
            <p><strong>I&apos;m working on adding a ton of new features as quickly as I can to be used in the approaching 22-23 season!</strong><br /><br />
            If you&apos;d like to be notified of new features going live, submit your email below 🤠
            </p>
            <Controller
            name="lsRequestEmail"
            control={control}
            defaultValue=""
            required
            type="email"
            render={({ field: { onChange, value }, fieldState: { errors } }) => (
                <TextField 
                id="outlined-basic" 
                label="Email" 
                variant="outlined" 
                value={value}
                onChange={onChange}
                className="mui_textfield"
                type="email"
                />
            )}
            />

                <Button 
                variant="contained" 
                type="submit" 
                value="Submit">
                Submit
                </Button>

            </div>
        </form>

    )

    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <MiniHero headline={headlineText} form={form} />

            </main>
        </div>

    )
}
