/*
api说明:
value： 需要绑定的值
placeholder: 参考input
onChange: 供外部form验证调用
disabled: 是否只读
*/
import React, {Component} from 'react'
import { Icon, Tag } from 'antd'
import css from './index.scss'

class MyTagsInput extends Component {
  state = {
    tags: this.props.tags || []
  }

  componentWillReceiveProps(nextProps){
    let tags = nextProps.tags
    if ([...this.state.tags].sort().toString() !== [...tags].sort().toString()) {
      this.setState({tags})
    }
  }

  onChange = (tags) => {
    const onChange = this.props.onChange
    if(onChange) {
      onChange(tags)
    }
  }

  onClick = (e) => {
    if (e.target.className == css['my-input'] || e.target.className == css.placeholder) {
      this.props.onClick(e)
    }
    e.preventDefault()
  }

  removeTag = (_tag) => {
    let tags = this.state.tags.filter(tag => tag !== _tag)
    this.onChange(tags)
  }

  addTag = (_tag) => {
    if (this.state.tags.indexOf(_tag) === -1 ) {
      let tags = [...this.state.tags]
      tags.push(_tag)
      this.onChange(tags)
    }
  }

  renderValue() {
    let { tags } = this.state
    if (tags.length > 0) {
      return this.renderTags(tags)
    } else {
      return (<span className={css.placeholder}>{this.props.placeholder}</span>)
    }
  }

  renderTags(tags) {
    return tags.map((tag, index) => {
      const tagElem = (
        <Tag key={tag}  style={{margin: 3}} closable afterClose={() => this.removeTag(tag)}>
          {tag}
        </Tag>
      );
      return tagElem;
    })
  }

  render() {
    let arr = [css['my-input']]
    this.props.disabled && arr.push(css['my-input-disabled'])
    let settings = {
      disabled: this.props.disabled,
      className: arr.join(' '),
      onClick: this.onClick
    }
    return (
      <div { ...settings }>
        { this.renderValue() }
      </div>
    )
  }
}

class MyPicker extends Component {
  state = {
    show: this.props.show || false
  }

  show() {
    this.setState({show: true})
  }

  hide() {
    this.setState({show: false})
  }

  docEvent = (e) => {
    if (this.mouseout) {
      this.setState({show: false})
    }
  }

  componentWillReceiveProps(nextProps){
    let newValue = nextProps.show
    this.setState({show : newValue})
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.docEvent, false)
  }

  componentDidMount() {
    this.mouseout = true
    document.documentElement.addEventListener('click', this.docEvent, false)
    this.boxNode.addEventListener('mouseout', (e) => {
      this.mouseout = true
    }, false)

    this.boxNode.addEventListener('mouseup', (e) => {
      this.mouseout = false
    }, false)
  }

  render() {
    let settings = {
       className: css['my-picker'],
       ref: (node) => { this.boxNode = node },
       style: {
         display: this.state.show ? 'block' : 'none'
       }
    }
    return (
      <div { ...settings }>
         { this.props.children }
      </div>
    )
  }
}

export default class MultiplePicker extends Component {
  // 给外部调用
  hidePicker = (e) => {
    this.myPicker.hide()
  }
  // 给外部调用
  addValue(tag) {
    this.myTagsInput.addTag(tag)
  }

  render() {
    let settings = {
      myTagsInput: {
        name: this.props.name,
        tags: this.props.value,
        disabled: this.props.disabled,
        placeholder: this.props.placeholder,
        onChange: this.props.onChange,
        onClick: (e) => {
          this.myPicker.show()
        }
      }
    }
    return (
      <div className={ css['multiple-datepicker'] }>
        <MyTagsInput { ...settings['myTagsInput'] } ref={(ref)=>{this.myTagsInput = ref}}/>
        <MyPicker ref={(ref)=>{this.myPicker = ref}}>
          {this.props.children(this)}
        </MyPicker>
      </div>
    )
  }
}
