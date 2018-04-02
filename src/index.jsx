import React, {Component} from 'react'
import { render } from 'react-dom'
import { Layout, Radio, Form, Row, Col, Button } from 'antd'
import MultipleDatePicker from './components/MultipleDatePicker'
import MultipleTimePicker from './components/MultipleTimePicker'
import css from './index.scss'

const { Header, Footer, Content } = Layout
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item


var data = {
  date: ["2018/01/01","2018/01/02","2018/01/03"],
  time: ["10:30-11:33", "10:30-11:32","10:30-11:31"]
}

class Root extends Component {
  state = {
    plan: 'a'
  }

  getRadioPlan() {
    return (
      <RadioGroup size="small" defaultValue={this.state.plan} onChange={(e)=>{this.setState({plan: e.target.value})}}>
        <RadioButton value="a">MultipleDatePicker</RadioButton>
        <RadioButton value="b">MultipleTimePicker</RadioButton>
      </RadioGroup>
    )
  }
  getPlan() {
    const { getFieldDecorator } = this.props.form
    let plan = {
      a: (
        <FormItem>
         {getFieldDecorator('date', {
           initialValue: data.date,
           rules: [{ required: true, message: '该字段不能为空', type: 'array'}]
         })(
           <MultipleDatePicker placeholder='date'/>
         )}
        </FormItem>
      ),
      b: (
       <FormItem>
         {getFieldDecorator('time', {
           initialValue: data.time,
           rules: [{ required: true, message: '该字段不能为空', type: 'array'}]
         })(
           <MultipleTimePicker placeholder='time' trace={true} control={true}/>
         )}
       </FormItem>
      )
    }
    return plan[this.state.plan]
  }
  render() {
    const settings = {
      cancelButton: {
        onClick: () => {
          this.props.form.resetFields();
        }
      },
      saveButton: {
        htmlType: "submit",
        type: "primary"
      }
    }
    return (
      <div>
         <Layout>
          <Header className={css.header}>
            <div>
              <span>reac-and-multiple-picker</span>
              {this.getRadioPlan()}
            </div>
          </Header>
          <Content>
            <Form>
              <Row gutter={24}>
                <Col span={12}  push={5}>
                {this.getPlan()}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24} push={12}>
                  <FormItem>
                    <Button { ...settings.cancelButton } className={css.button}>重置</Button>
                    <Button { ...settings.saveButton } className={css.button}>保存</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Content>
          <Footer></Footer>
        </Layout>
      </div>
    )
  }
}

Root = Form.create({})(Root)
render(
  <Root/>,
  document.getElementById('root')
)
