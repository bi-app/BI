import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Empty } from 'antd';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
//导入组件
import { Recharts, Components } from 'react-component-echarts';
import PropTypes from 'prop-types'
import styles from './index.less';
import EmptyIma from '@/assets/Empty.svg';
import config from 'utils/config';
const { TextStyle, Label, Tooltip, Title, Series } = Components;

const HlodCont = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

class TypeAnalysis extends PureComponent {
  render() {
    const { TypeIncomeInfo, TypeSalesInfo } = this.props;
    return (
      <ReactCSSTransitionGroup
        transitionEnter={true}
        transitionLeave={true}
        transitionEnterTimeout={2500}
        transitionLeaveTimeout={1500}
        transitionName="animated"
      >
        <div key="amache" className={'animated bounceInRight' + ' ' + styles['right-slider-chart-2']}>
          <div className={styles.chart_list_title}>
            <div className={styles.list_title_text}>
              业态数据分析
              <i className={styles['border-top']}/>
              <i className={styles['border-oblique']}/>
            </div>
          </div>
          <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
            {
              TypeIncomeInfo.length === 0 || TypeSalesInfo.length === 0 ? <HlodCont>
                <Empty
                  image={EmptyIma}
                  imageStyle={{height: 60,}}
                  description={<span style={{color: '#2880B4', fontSize: 16}}
                  >暂无相关数据</span>} />
              </HlodCont> : <Recharts color={["#ffda6d","#0fecf2","#00a5f7","#2bdfa0", "#7874df"]}>
                <Tooltip
                  show={true}
                  formatter="{c}元"
                  extraCssText={config.pieExtraCssText}
                />
                <Title top="0" left="18%" text="业态销售比">
                  <TextStyle color="#fff" fontSize={14} />>
                </Title>
                <Title top="0" right="18%" text="业态收益比">
                  <TextStyle color="#fff" fontSize={14} />
                </Title>
                <Series
                  type="pie"
                  radius={['34%', '60%']}
                  center={['25%', '60%']}
                  labelLine={{"show":true}}
                  itemStyle={{"borderWidth":2,"borderColor":"#13153e"}}
                  data={TypeSalesInfo}>
                  <Label formatter={(param) => `${param.name} ${param.percent}%`} />
                </Series>
                <Series
                  type="pie"
                  radius={['34%', '60%']}
                  center={['75%', '60%']}
                  labelLine={{"show":true}}
                  itemStyle={{"borderWidth":2,"borderColor":"#13153e"}}
                  data={TypeIncomeInfo}>
                  <Label formatter={(param) => `${param.name} ${param.percent}%`} />
                </Series>
              </Recharts>
            }
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}
TypeAnalysis.propTypes = {
  TypeIncomeInfo: PropTypes.array,
  TypeSalesInfo: PropTypes.array,
};

export default TypeAnalysis;
