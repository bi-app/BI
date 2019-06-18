import React, { PureComponent } from 'react'
import { Exception } from 'ant-design-pro'
import { Page } from 'components'
import styles from './404.less'

class Error extends PureComponent {
  render() {
    return (
      <Page inner>
        <div className={styles.error}>
          <Exception
            type="404"
            title='访问失败'
            desc={null}
            backText='返回上一页'
          />
        </div>
      </Page>
    )
  }
}
export default Error
