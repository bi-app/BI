import React, { PureComponent, Component } from 'react'
import { withRouter } from 'umi'
import style from './sider.less';
import spring, { toString } from 'css-spring'
import styled, { keyframes } from 'styled-components'
const keyframeString = toString(spring(
  { right: '-80px', opacity: 0 },
  { right: '6px', opacity: 1 },
  { preset: 'custom', precision: 5 }
));

const StyledDiv = styled.div`
  position: relative;
  right: 6px;
  background-color: #090237;
  animation: ${keyframes`${keyframeString}`} 1s linear;
`;

@withRouter
class Sider extends Component {
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.activeKey === '1' || this.props.activeKey !== nextProps.activeKey){
      return true
    }
    return false
  }
  render() {
    // console.log(1)
    const { children, onChange, activeKey } = this.props;
    return (
      <div className={style['tab-warp']}>
        {
          React.Children.map(children, (ele) => {
            // console.log("ele",ele)
            return (
              <div key={ele.key} className={style['tab-warp-list']}>
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
                {/*{*/}
                  {/*activeKey === ele.key ? <StyledDiv>*/}
                    {/*<div className={style['tab-cont']} >*/}
                      {/*<i className={style['tab-extra-top']} />*/}
                      {/*<i className={style['tab-extra-left']} />*/}
                      {/*<i className={style['tab-extra-right']} />*/}
                      {/*<div className={style['tab-cont-inner']}>{ele.props.children}</div>*/}
                    {/*</div>*/}
                  {/*</StyledDiv> : null*/}
                {/*}*/}
                {/*{*/}
                  {/*//style={{display: `${activeKey !== ele.key ? 'none' : 'block'}`}}*/}
                  {/*//className={style[`${activeKey !== ele.key ? 'slideIn' : 'slideOut'}`]}*/}
                  {/*<StyledDiv style={{display: `${activeKey !== ele.key ? 'none' : 'block'}`}} >*/}
                    {/*<div className={style['tab-cont']} >*/}
                      {/*<i className={style['tab-extra-top']} />*/}
                      {/*<i className={style['tab-extra-left']} />*/}
                      {/*<i className={style['tab-extra-right']} />*/}
                      {/*<div className={style['tab-cont-inner']}>{ele.props.children}</div>*/}
                    {/*</div>*/}
                  {/*</StyledDiv>*/}
                {/*}*/}
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Sider
