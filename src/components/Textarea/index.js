import React, { Component } from 'react'
import { Editor, EditorBlock, EditorState } from 'draft-js'
import classnames from 'classnames'
import { omit } from 'lodash'
import punycode from 'punycode'
import s from './index.css'

const Line = props => {
  const blockKey = props.block.key
  const lineNumber = props.contentState
    .getBlockMap()
    .toList()
    .findIndex(item => item.key === blockKey) + 1
  return (
    <div className={s.line} data-line-number={lineNumber}>
      <div className={s.lineText}><EditorBlock {...props} /></div>
    </div>
  )
}

const blockRendererFn = () => ({ component: Line })

export default class Textarea extends Component {
  handleChange = editorState => {
    this.setState({ editorState }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.value);
      }
    })
  }
  handleRootClick = () => this.focus()
  editorRef = c => this.editor = c

  state = { editorState: EditorState.createEmpty() }

  get containerClassName() {
    return classnames(s.root, this.props.containerClassName, {
      'placeholder-hidden': this.firstBlockType !== 'unstyled',
      focus: this.hasFocus,
    })
  }
  get currentContent() {
    return this.state.editorState.getCurrentContent()
  }
  get currentSelection() {
    return this.state.editorState.getSelection()
  }
  get firstBlock() {
    return this.currentContent.getFirstBlock()
  }
  get firstBlockType() {
    return this.firstBlock.getType()
  }
  get lineFeedCodeRegex() {
    return /(?:\r\n|\r|\n)/g
  }
  get hasFocus() {
    return this.currentSelection.getHasFocus()
  }

  decodeUnicode(str) {
    return punycode.ucs2.decode(str)
  }
  getPlainText(delimiter) {
    return this.currentContent.getPlainText(delimiter)
  }

  render() {
    return (
      <div className={this.containerClassName} onClick={this.handleRootClick}>
        <Editor
          {...omit(this.props, ['containerClassName'])}
          ref={this.editorRef}
          editorState={this.state.editorState}
          onChange={this.handleChange}
          blockRendererFn={blockRendererFn}
          stripPastedStyles
        />
      </div>
    )
  }

  // public
  focus() {
    if (this.editor) {
      this.editor.focus()
    }
  }
  get value() {
    return this.getPlainText()
  }
  get focusOffset() {
    return this.currentSelection.getFocusOffset()
  }
  get wordCount() {
    const plainText = this.getPlainText('')
    const cleanString = plainText.replace(this.lineFeedCodeRegex, ' ').trim()
    const wordArray = cleanString.match(/\S+/g)
    return wordArray ? wordArray.length : 0
  }
  get charCount() {
    const plainText = this.getPlainText('')
    const cleanString = plainText.replace(this.lineFeedCodeRegex, '').trim()
    return this.decodeUnicode(cleanString).length
  }
  get lineCount() {
    const blockArray = this.currentContent.getBlocksAsArray()
    return blockArray ? blockArray.length : 0
  }
  get currentLineIndex() {
    const currentBlockKey = this.currentSelection.getFocusKey()
    return this.currentContent
      .getBlockMap()
      .keySeq().findIndex(k => k === currentBlockKey)
  }
  get currentLineNumber() {
    return this.currentLineIndex + 1
  }
}
