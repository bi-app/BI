import React, { PureComponent } from 'react'
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import BaseLayout from './BaseLayout'
moment.locale('zh-cn');


@withRouter
@connect(({ loading }) => ({ loading }))
class Layout extends PureComponent {
  render() {
    const { loading, children } = this.props;
    if (loading.global) {
      NProgress.start()
      // message.loading('请求中...', 0)
    }

    if (!loading.global) {
      NProgress.done()
      // message.destroy()
    }
    // console.log("taskqueue", taskqueue())

    return (
      <LocaleProvider locale={zh_CN}>
        <BaseLayout>{children}</BaseLayout>
      </LocaleProvider>
    )
  }
}
export default Layout
