import React, { PureComponent } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Statistic, Icon } from 'antd';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
//导入组件
import { Recharts, Components } from 'react-component-echarts'
import styles from './index.less'
import config from 'utils/config'
import { formaterVal } from '@/utils'
const { LineStyle, AxisLine, AxisTick, Tooltip, AxisPointer, AxisLabel, NameTextStyle, SplitLine, Legend, Grid, XAxis, YAxis, Series, TextStyle } = Components
const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #ffffff;
`;

const IntroText = styled.div`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #ffffff;
`;

const ItemTitle = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
`;
const ItemCont = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

class Sales extends PureComponent {
  render() {
    const { salesData, salesChart } = this.props;
    const { OrderCount, PerCustomerPrice, SequentialValue, TotalSaleAmt } = salesData;
    const { SeriesData, XAxisData } = salesChart;

    const statusNum = (value) => {
      let initNum = 0;
      if( Number(value) >= 0 ){
        initNum = value;
      }else {
        initNum = String(value).split("-")[1];
      }
      return initNum
    };

    const statusColor = (value) => {
      let initColor = "#fff";
      if( Number(value) > 0 ){
        initColor = "#ff8160";
      }else if(Number(value) < 0){
        initColor = "#2bdfa0";
      }
      return initColor
    };

    const statusIcon = (value) => {
      let initIcon = <Icon type='minus' />;
      if( Number(value) > 0 ){
        initIcon = <Icon type='rise' />;
      }else if(Number(value) < 0){
        initIcon = <Icon type='fall' />;
      }
      return initIcon
    };

    return (
      <ReactCSSTransitionGroup
        transitionEnter={true}
        transitionLeave={true}
        transitionEnterTimeout={2500}
        transitionLeaveTimeout={1500}
        transitionName="animated"
      >
        <div key="amache" className={'animated bounceInLeft' + ' ' +styles.income_warp + ' ' + styles.four_corner_border}>
          <div className={styles['flex-left-text']}>
            <Title>销售</Title>
            {
              formaterVal(TotalSaleAmt, 2, 2, "元", "万", { fontSize: 34,color: '#fff' }, {width: '100%'})
            }
            {/*<Statistic*/}
              {/*value={TotalSaleAmt}*/}
              {/*precision={2}*/}
              {/*valueStyle={{ fontSize: 34,color: '#fff' }}*/}
              {/*suffix="万"*/}
              {/*style={{width: '100%'}}*/}
            {/*/>*/}
            <IntroText>
              <ItemTitle>环比</ItemTitle>
              <ItemCont>
                <Statistic
                  value={statusNum(SequentialValue)}
                  precision={2}
                  valueStyle={{ fontSize: 16,color: statusColor(SequentialValue) }}
                  prefix={statusIcon(SequentialValue)}
                  suffix="%"
                />
              </ItemCont>
            </IntroText>
            <IntroText>
              <ItemTitle>客单价</ItemTitle>
              <ItemCont>
                {formaterVal(PerCustomerPrice, 2, 2, "元", "万", { fontSize: 16,color: '#fff' }, null)}
                {/*<Statistic*/}
                  {/*value={PerCustomerPrice}*/}
                  {/*precision={2}*/}
                  {/*valueStyle={{ fontSize: 16,color: '#fff' }}*/}
                  {/*suffix="元"*/}
                {/*/>*/}
              </ItemCont>
            </IntroText>
            <IntroText>
              <ItemTitle>订单量</ItemTitle>
              <ItemCont>
                {formaterVal(OrderCount, 0, 0, "单", "万单", { fontSize: 16,color: '#fff' }, null)}
                {/*<Statistic*/}
                  {/*value={OrderCount}*/}
                  {/*precision={0}*/}
                  {/*valueStyle={{ fontSize: 16,color: '#fff' }}*/}
                  {/*suffix="单"*/}
                {/*/>*/}
              </ItemCont>
            </IntroText>
          </div>
          <div className={styles['flex-1']}>
            <Recharts color={["#0fecf2"]}>
              <Tooltip trigger="axis" extraCssText={config.dataExtraCssText}>
                <AxisPointer type="line" />
              </Tooltip>
              <Legend right="4%" top="2%" itemWidth={10} itemHeight={10} data={[{"name":"销售额","icon":"rect"}]} >
                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
              </Legend>
              <Grid left="4%" top="30%" bottom="10%" right="10%" containLabel={true} />
              <XAxis type="category" boundaryGap={false} data={XAxisData}>
                <AxisLine>
                  <LineStyle color="#fff" />
                </AxisLine>
                <AxisTick show={false} />
                <AxisLabel color="#fff" fontSize={10}/>
              </XAxis>
              <YAxis name="元" min={0}>
                <NameTextStyle color="#fff" fontSize={10} padding={[28, 0, 0, 0]}/>
                <SplitLine show={false} />
                <AxisLine>
                  <LineStyle color="#fff" />
                </AxisLine>
                <AxisTick show={false} />
                <AxisLabel color="#fff" fontSize={10}/>
              </YAxis>
              <Series symbolSize={0} name="销售额" smooth={true} data={SeriesData} type="line" areaStyle={{
                "color":{
                  "type":"linear","x":0,"y":0,"x2":0,"y2":1,
                  "colorStops":[
                    {"offset":0,"color":"#01a8f7"},
                    {"offset":1,"color":"#0fecf2"}
                    ],
                  "globalCoord":false
                }}}>
                <LineStyle width={0} />
              </Series>
            </Recharts>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

Sales.propTypes = {
  salesData: PropTypes.object,
  salesChart: PropTypes.object,
}
export default Sales
