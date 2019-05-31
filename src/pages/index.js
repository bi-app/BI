/**
 * authority:admin
 *
 *
 *
 * */
import React, { PureComponent } from 'react'
import Redirect from 'umi/redirect'


class Index extends PureComponent {
  render() {
    return <Redirect to={`/data`} />
  }
}

export default Index
