import React from 'react'
import ReactAnsi from 'ansi-to-react'
import classnames from 'classnames'
import s from './index.css'

const Ansi = ({ children, className, ...other }) => {
  return <pre className={classnames(s.root, className)} {...other}>
    <ReactAnsi>{children}</ReactAnsi>
  </pre>
}

export default Ansi
