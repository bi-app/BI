import React, { Component, PureComponent } from 'react'
import style from './sider.less';
import spring, { toString } from 'css-spring'
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
const keyframeString = toString(spring(
  { right: '-80px', opacity: 0 },
  { right: '6px', opacity: 1 },
  { preset: 'custom', precision: 5 }
));

const StyledDiv = styled.div`
  position: absolute;
  right: 6px;
  background-color: #090237;
  animation: ${keyframes`${keyframeString}`} 1s linear;
`;

class Sider extends Component {

  // shouldComponentUpdate(nextProps, nextState){
  //   console.warn("nextProps", nextProps)
  //   if(this.props.activeKey === '1' || this.props.activeKey !== nextProps.activeKey){
  //     return true
  //   }
  //   return false
  // }

  render() {
    const { children, onChange, activeKey } = this.props;

    const _setHeight = (key, ele) => {
        if(key === ele){
          switch (key){
            case "1":
              return '292px';
            case "2":
              return '420px';
            case "3":
              return '390px';
            case "4":
              return '390px';
            case "5":
              return '390px';
            case "6":
              return '390px';
          }
        }else {
          return "64px"
        }
    }

    return (
      <div className={style['tab-warp']}>
        {
          React.Children.map(children, (ele) => {
            return (
              <div key={ele.key} className={style['tab-warp-list']} style={{height: _setHeight(activeKey, ele.key)}}>
                <div className={style['list-title']}>
                  <div data-key={ele.key} onClick={onChange} style={{backgroundPosition: `${activeKey === ele.key ? '7px -41px' : '7px 1px'}`}} className={style['nav-tab']}>{ele.props["data-tab"]}</div>
                </div>
                {
                  ele.key === '1' ? <StyledDiv style={{display: `${activeKey !== ele.key ? 'none' : 'block'}`}}>
                    <div className={style['tab-cont']} >
                      <i className={style['tab-extra-top']} />
                      <i className={style['tab-extra-left']} />
                      <i className={style['tab-extra-right']} />
                      <div className={style['tab-cont-inner']}>{ele.props.children}</div>
                    </div>
                  </StyledDiv> : activeKey === ele.key ? <StyledDiv>
                    <div className={style['tab-cont']} >
                      <i className={style['tab-extra-top']} />
                      <i className={style['tab-extra-left']} />
                      <i className={style['tab-extra-right']} />
                      <div className={style['tab-cont-inner']}>{ele.props.children}</div>
                    </div>
                  </StyledDiv> : null
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

Sider.propTypes = {
  onChange: PropTypes.func,
  activeKey: PropTypes.string,
}

export default Sider
