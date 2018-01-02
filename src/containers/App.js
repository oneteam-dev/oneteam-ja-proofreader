import React, { Component } from 'react'
import { Alert, Button, Container, Row, Col } from 'reactstrap'
import Ansi from 'components/Ansi'
import Header from 'components/Header'
import Footer from 'components/Footer'
import Textarea from 'components/Textarea'
import DelayedSpinner from 'components/DelayedSpinner'
import s from './App.css'

export default class App extends Component {
  state = {
    result: null,
    error: null,
    requesting: false,
    focusOffset: 0,
    charCount: 0,
    lineCount: 0,
    focusLineNumber: 1,
  }
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
    this.lint(this.textarea.value)
  }
  componentDidMount() {
    if (this.textarea) {
      this.textarea.focus()
    }
  }
  handleValueChange = () => {
    const { focusOffset, charCount, lineCount, currentLineNumber } = this.textarea
    this.setState({ focusOffset, charCount, lineCount, focusLineNumber: currentLineNumber })
  }
  render() {
    return (
      <div className='app'>
        <Header />
        {this.renderError()}
        <Container fluid className={s.meta}>
          <Row><Col xa='12'>{this.renderMetadata()}</Col></Row>
        </Container>
        <Container fluid className={s.container}>
          <Row noGutters className={s.row}>
            <Col xs='6' className={s.secLeft}>
              <Textarea
                ref={c => this.textarea = c}
                containerClassName={s.textarea}
                placeholder='校正したい文章を入力してください'
                onChange={this.handleValueChange}
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
  renderMetadata() {
    const { focusOffset, charCount, lineCount, focusLineNumber } = this.state
    return (
      <div>{focusLineNumber}行：{focusOffset}字目{'　'}
        総数： {charCount}字 , {lineCount}行
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
