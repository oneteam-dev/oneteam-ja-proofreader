import React, { Component } from 'react'
import { Alert, Button, Input, Container, Row, Col } from 'reactstrap'
import Ansi from 'components/Ansi'
import Header from 'components/Header'
import Footer from 'components/Footer'
import DelayedSpinner from 'components/DelayedSpinner'
import s from './App.css'

export default class App extends Component {
  state = { result: null, error: null, value: '', requesting: false }
  async lint(text) {
    const res = await fetch('/lint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const m  = res.ok ? 'json' : 'text'
    const resBody = await res[m]()
    if (res.ok) {
      this.setState({ result: resBody.result, requesting: false, error: null })
    } else {
      console.error(resBody)
      this.setState({ result: null, requesting: false, error: resBody })
    }
  }
  handleClick = () => {
    this.setState({ requesting: true })
    this.lint(this.input.value)
  }
  handleValueChange = e => {
    this.setState({ value: e.target.value })
  }
  componentDidMount() {
    if (this.input) {
      this.input.focus()
    }
  }
  render() {
    return (
      <div className='app'>
        <Header />
        {this.renderError()}
        <Container fluid className={s.container}>
          <Row noGutters className={s.row}>
            <Col xs='6' className={s.secLeft}>
              <Input
                type='textarea'
                value={this.state.value}
                onChange={this.handleValueChange}
                innerRef={c => this.input = c}
                className={s.textarea}
                placeholder='校正したい文章を入力してください'
              />
            </Col>
            <Col xs='1' className={s.secCenter}>
              {this.renderSpinner()}
              <Button size='sm' onClick={this.handleClick}>校正</Button>
            </Col>
            <Col xs='5' className={s.secRight}>{this.renderResult()}</Col>
          </Row>
        </Container>
        <Footer />
      </div>
    )
  }
  renderError() {
    return this.state.error ? <Alert color='danger'>{this.state.error}</Alert> : null
  }
  renderSpinner() {
    return this.state.requesting ? <DelayedSpinner className={s.spinner} /> : null
  }
  renderResult() {
    if (this.state.result === null) return null
    if (this.state.result === '') return <div className={s.passed}>👌</div>
    return <Ansi>{this.state.result}</Ansi>
  }
}
