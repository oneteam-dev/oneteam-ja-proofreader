import 'bootstrap/dist/css/bootstrap.css'
import 'bootswatch/dist/yeti/bootstrap.css'
import 'react-spinner/react-spinner.css'
import 'draft-js/dist/Draft.css'
import 'styles/index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from 'containers/App'

const render = Component => {
  ReactDOM.render(
    <AppContainer><Component /></AppContainer>,
    document.getElementById('app-root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(App)
  })
}
