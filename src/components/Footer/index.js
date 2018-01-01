import React from 'react'
import s from './index.css'

const Footer = () => {
  return (
    <footer className={s.root}>
      <a
        href='https://one-team.com'
        target='_blank'
      >©Oneteam Inc.</a>
      <span className={s.separater}>|</span>
      <a
        href='https://github.com/oneteam-dev/oneteam-ja-proofreader'
        target='_blank'
      >Source code</a>
    </footer>
  )
}

export default Footer
