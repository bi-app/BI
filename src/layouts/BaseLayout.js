import React, { Fragment, PureComponent } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import styles from './index.less';
import Header from "../components/header";
import Error from '../pages/404';
import { Loader } from 'components';

@withRouter
@connect(({ app, loading }) => ({ app, loading }))
class Layout extends PureComponent {
  render() {
    const { location, children, app, loading } = this.props;
    const { hasPermission } = app;
    const { pathname } = location;
    if (pathname === '/login') {
      return <Fragment>{children}</Fragment>
    }
    return (
      <Fragment>
        {
          hasPermission ? <Header to={pathname === '/data' ? '/deal' : '/data'} /> : null
        }
        {/*<Loader fullScreen spinning={loading.global} />*/}
        {
          hasPermission ? <TransitionGroup className={styles["trans-cont"]}>
            <CSSTransition
              key={pathname}
              classNames="fade"
              timeout={1000}
              appear={true}
              unmountOnExit
            >
              {children}
            </CSSTransition>
          </TransitionGroup> : <Error />
        }
      </Fragment>
    )
  }
}

export default Layout
