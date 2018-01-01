import React from 'react'
import Delay from 'react-delay'
import Spinner from 'react-spinner'
import classnames from 'classnames'
import s from './index.css'

const DelayedSpinner = props => <Delay wait={400}><Spinner {...props} className={classnames(s.spinner, props.className)} /></Delay>

export default DelayedSpinner
