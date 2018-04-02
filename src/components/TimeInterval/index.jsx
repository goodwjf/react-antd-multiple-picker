/*
api说明:
trace: 每次选择是否保留上一次的记录
control: 是否显示控制按钮
onConfirm: 确认选择事件
*/
import React, {Component} from 'react'
import { Button, message, Switch, Tooltip } from 'antd'
import css from './index.scss'

let groups = {
  'start': [24, 60, 60],
  'end': [24, 60, 60]
}

let types = {
  '0': {title: '时', key: 'H'},
  '1': {title: '分', key: 'M'},
  '2': {title: '秒', key: 'S'}
}

let record = {}
let selectClassName = css['selected']
let setSelectedState = (ele, opt) => {
  let key = `${opt.group}-${opt.type}`
  if (record[key]) {
    record[key].classList.remove(selectClassName)
  }
  ele.classList.add(selectClassName)
  record[key] = ele
}

let initSelectState = () => {
  for (var g in groups) {
    for (var t in types) {
      let key = `${g}-${t}`
      if (record[key]) {
        record[key].classList.remove(selectClassName)
      }
    }
  }
}

let initScrollTop = () => {
  var uls = document.querySelectorAll(`.${css['scroll-state']}`)
  Array.prototype.forEach.call(uls, (item) => {
    item.scrollTop = 0;
  })
}

let selectedItem = (ele, opt) => {
  let parent = ele.parentNode
  setSelectedState(ele, opt)
  // ele.parentNode.scrollTop = ele.offsetTop
  move(ele)
}

let checkTime = (start, end) => {
  let sArr = start.split(':')
  let eArr = end.split(':')
  let s = sArr[0] * 3600 + sArr[1] * 60 + sArr[2]
  let e = eArr[0] * 3600 + eArr[1] * 60 + eArr[2]
  return e - s;
}

let timer = null
let move = (li) => {
  let target = li.offsetTop
  let ul = li.parentNode
  clearInterval(timer);
  timer = setInterval(function(){
    let speed = (target - ul.scrollTop)/9;
    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
    if (ul.scrollTop >= target || ul.scrollTop >= ul.scrollHeight - 150) { // 150是滚动一屏的高度
      clearInterval(timer);
    } else {
      ul.scrollTop = ul.scrollTop + speed;
    }
  },10);
}

export default class TimeInterval extends Component {
  state = {
    startTime: '',
    endTime: '',
    trace: this.props.trace
  }
  initTimeStorage = () => {
    let val = {
      start:{
        H: '00',
        M: '00',
        S: '00'
      },
      end: {
        H: '00',
        M: '00',
        S: '00'
      }
    }
    return ({type, value, group}) => {
      val[group][types[type].key] = value
      return {
        startTime: `${val.start.H}:${val.start.M}:${val.start.S}`,
        endTime: `${val.end.H}:${val.end.M}:${val.end.S}`
      }
    }
  }
  cleanTrace() {
    initSelectState()
    initScrollTop()
    this.setState({startTime: '', endTime: ''})
    this.getTime = this.initTimeStorage()
  }

  componentDidMount() {
    this.getTime = this.initTimeStorage()
  }

  renderBox = (obj) => {
    let arr = []
    for (let key in obj) {
      arr.push(<div className={css.group} key={key}>{this.renderGroup(obj[key], key)}</div>)
    }
    return arr
  }

  renderGroup = (arr, groupKey) => {
    return arr.map((item, index) => {
      return this.renderList(item, index, groupKey)
    })
  }

  renderList = (count, index, groupKey) => {
    let arr = []
    for (let i = 0; i < count + 4 ; i++) {
      let settings = null
      let val = ''
      if (i < count) {
        val = i + ''
        val = (val.length < 2) ? '0' + val : val
        settings = {
          'data-group': groupKey,
          'data-type': index,
          'data-value': val,
          'key': index + '' + i,
          'onClick': this.onLiClick
        }
      } else {
        settings = {
          'className': css.temp,
          'key': index + '' + i
        }
      }
      arr.push(<li { ...settings }>{ val }</li>)
    }

    return (
      <div key={ index } className={ css.item }>
        <div>{ types[index].title }</div>
        <ul className={ css['scroll-state'] }>{ arr }</ul>
      </div>
    )
  }

  onLiClick = (e) => {
    let opt = e.target.dataset
    let times = this.getTime(opt)
    selectedItem(e.target, opt)
    this.setState(times)
  }

  onConfirm = (e) => {
    let startTime = this.state.startTime
    let endTime = this.state.endTime
    let msg = ['结束时间需大于开始时间', '请选择时间']

    if(startTime === '' || endTime === '') {
      message.error(msg[1])
      return
    }

    if (checkTime(startTime, endTime) > 0) {
      let value = `${startTime} - ${endTime}`
      this.props.onConfirm(value)
      // 是否清理痕迹
      !this.state.trace && this.cleanTrace()
    } else {
      message.error(msg[0])
    }
  }

  getController() {
    if (this.props.control) {
      let settings = {
        tooltip: {
          placement: "topLeft",
          title: "开启后保留上次所选记录"
        },
        switch: {
          size: "small",
          checked: this.state.trace,
          className: css['switch-but'],
          onChange: (state) => { this.setState({trace: state}) }
        }
      }
      return (
        <Tooltip { ...settings['tooltip'] }>
          <Switch { ...settings['switch'] }/>
        </Tooltip>
      )
    }
  }

  render() {
    return (
      <div>
        <div className={css['input-box']}>
          <input type="text" value={this.state.startTime} placeholder="开始时间" readOnly/>
          <input type="text" value={this.state.endTime} placeholder="结束时间" readOnly/>
        </div>
        <div className={css.box}>
          { this.renderBox(groups) }
        </div>
        <div className={css['button-box']}>
          <span>{ this.getController() }</span>
          <Button type="primary" onClick={this.onConfirm}>确定</Button>
        </div>
      </div>
    )
  }
}
