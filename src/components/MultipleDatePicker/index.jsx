/*
api说明:
value： 需要绑定的值
placeholder: 参考input
disabled: 是否只读
*/

// @ppt 如何自定义一个form表单项
import React, {Component} from 'react'
import { Calendar } from 'antd'
import MultiplePicker from '../MultiplePicker'
import './overwrite.css'

export default class MultipleDatePicker extends Component {

  handleSelect = (date, wrapper) => {
    let dateFormat = 'YYYY/MM/DD'
    let value = date.format(dateFormat)
    wrapper.addValue(value)
    wrapper.hidePicker()
  }

  render() {
    const { value, onChange, placeholder, disabled } = this.props
    return (
      <MultiplePicker value={ value.concat() } onChange={ onChange } placeholder={ placeholder } disabled={ disabled }>
        {
          (wrapper) => <Calendar fullscreen={ false } onSelect={ (date) => { this.handleSelect(date, wrapper) } } style={ { width:300 } }/>
        }
      </MultiplePicker>
    )
  }
}
