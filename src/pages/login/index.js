/**
 * title: 欢迎登录-中铁建BI决策分析系统
 */
import React, {PureComponent, Fragment} from 'react';
/**
 * Fragment: 将一些子元素添加到 DOM tree 上且不需要为这些元素提供额外的父节点
 * */
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {Button, Row, Form, Input} from 'antd';
import styles from './index.less';
import logo from 'assets/logo.png';
import Mobility1 from '@/assets/Mobility-1.png';
import Mobility2 from '@/assets/Mobility2.png';
const FormItem = Form.Item;

@connect(({loading, login}) => ({loading, login}))
@Form.create()
class Login extends PureComponent {
  handleOk = () => {
    const { dispatch, form } = this.props;
    console.log("form", form)
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {

        return
      }
      dispatch({type: 'login/login', payload: values})
    })
  };

  render() {
    const { loading, form } = this.props;
    const isLoading = loading.effects['login/login'];
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <div className={styles.login_warp}>
          <i className={styles.login_warp_hole_img} />
          <div className={styles.login_form_inner}>
            <div className={styles.login_form_img}>
              <img src={Mobility1} alt=""/>
              <img className={styles.breathingLampImage} src={Mobility2} alt=""/>
            </div>
            <div className={styles.form}>
              <div className={styles.logo}>
                <img alt="logo" src={logo} />
                <h3>中铁建BI决策分析系统</h3>
              </div>
              <form >
                <FormItem hasFeedback>
                  {getFieldDecorator('Code', {
                    rules: [
                      {
                        required: true,
                        message: '用户编码不能为空'
                      },
                    ],
                  })(
                    <Input
                      onPressEnter={this.handleOk}
                      size='large'
                      placeholder='请输入用户编码'
                    />
                  )}
                </FormItem>
                <FormItem hasFeedback>
                  {getFieldDecorator('Password', {
                    rules: [
                      {
                        required: true,
                        message: '密码不能为空'
                      },
                    ],
                  })(
                    <Input
                      type="password"
                      onPressEnter={this.handleOk}
                      size='large'
                      placeholder='请输入密码'
                    />
                  )}
                </FormItem>
                <Row>
                  <Button
                    type="primary"
                    onClick={this.handleOk}
                    size='large'
                    loading={isLoading}
                  >
                    登 录
                  </Button>
                </Row>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
