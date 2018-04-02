/*
api说明:
value： 需要绑定的值
placeholder: 参考input
trace: 每次选择是否保留上一次的记录
control: 是否显示控制按钮
disabled: 是否只读
*/

import React, {Component} from 'react'
import { Button, message, Switch } from 'antd'
import MultiplePicker from '../MultiplePicker'
import TimeInterval from '../TimeInterval'

export default class MultipleTimePicker extends Component {

  handleConfirm = (value, wrapper) => {
    wrapper.addValue(value)
    wrapper.hidePicker()
  }

  render() {
    const { value, onChange, placeholder, trace, control, disabled } = this.props
    return (
      <MultiplePicker value={ value.concat() } onChange={ onChange } placeholder={ placeholder } disabled={ disabled }>
        {
          (wrapper) => <TimeInterval onConfirm={ (e) => { this.handleConfirm(e, wrapper) } } trace={ trace } control={ control }/>
        }
      </MultiplePicker>
    )
  }
}