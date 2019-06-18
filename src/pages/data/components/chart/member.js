import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Statistic, Icon } from 'antd';
//导入组件
import { Recharts, Components } from 'react-component-echarts';
import styles from './index.less';
import config from "utils/config";
import PropTypes from 'prop-types';
import { formaterVal } from '@/utils'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
const { Tooltip, AxisPointer, LineStyle, AxisLine, AxisTick, AxisLabel, TextStyle, NameTextStyle, SplitLine, Legend, Grid, XAxis, YAxis, Series } = Components;

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

const Result = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const ItemTitle = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
`;
class Member extends PureComponent {
  render() {
    const { memberData, MemberChart } = this.props;
    const { TotalCustomerCount, SequentialValue, CustPercentAmt, CustConsumeAmt } = memberData;
    const { SeriesData, XAxisData } = MemberChart;

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
        <div key="amache" className={'animated bounceInRight' + ' ' +styles.div1_text + ' ' + styles.four_corner_border}>
          <div className={styles['flex-left-text']}>
            <Title>会员</Title>
            {formaterVal(TotalCustomerCount, 0, 0, "人", "万人", { fontSize: 34,color: '#fff' }, {width: '100%'})}
            {/*<Statistic*/}
              {/*value={TotalCustomerCount}*/}
              {/*precision={2}*/}
              {/*valueStyle={{ fontSize: 34,color: '#fff' }}*/}
              {/*suffix="万"*/}
              {/*style={{width: '100%'}}*/}
            {/*/>*/}
            <IntroText>
              <ItemTitle>环比</ItemTitle>
              <Result>
                <Statistic
                  value={statusNum(SequentialValue)}
                  precision={2}
                  valueStyle={{ fontSize: 16,color: statusColor(SequentialValue) }}
                  prefix={statusIcon(SequentialValue)}
                  suffix="%"
                />
              </Result>
            </IntroText>
            <IntroText>
              <ItemTitle>客单价</ItemTitle>
              <Result>
                {formaterVal(CustPercentAmt, 2, 2, "元", "万", { fontSize: 16,color: '#fff' }, null)}
                {/*<Statistic*/}
                  {/*value={CustPercentAmt}*/}
                  {/*precision={2}*/}
                  {/*valueStyle={{ fontSize: 16,color: '#fff' }}*/}
                  {/*suffix=""*/}
                {/*/>*/}
              </Result>
            </IntroText>
            <IntroText>
              <ItemTitle>会员消费</ItemTitle>
              <Result>
                {formaterVal(CustConsumeAmt, 2, 2, "元", "万", { fontSize: 16,color: '#fff' }, null)}
                {/*<Statistic*/}
                  {/*value={CustConsumeAmt}*/}
                  {/*precision={0}*/}
                  {/*valueStyle={{ fontSize: 16,color: '#fff' }}*/}
                  {/*suffix="万"*/}
                {/*/>*/}
              </Result>
            </IntroText>
          </div>
          <div className={styles['flex-1']}>
            <Recharts color={["#0fecf2"]}>
              <Tooltip trigger="axis" extraCssText={config.dataExtraCssText}>
                <AxisPointer type="line" />
              </Tooltip>
              <Legend right="4%" top="2%" itemWidth={10} itemHeight={10} data={[{"name":"会员数","icon":"rect"}]} >
                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
              </Legend>
              <Grid left="4%" top="30%" bottom="10%" right="10%" containLabel={true} />
              <XAxis type="category" boundaryGap={false} data={XAxisData}>
                <AxisLine>
                  <LineStyle color="#fff" />
                </AxisLine>
                <AxisTick show={false} />
                <AxisLabel color="#fff" fontSize={10} />
              </XAxis>
              <YAxis name="人" min={0}>
                <NameTextStyle color="#fff" fontSize={10}/>
                <SplitLine show={false} />
                <AxisLine>
                  <LineStyle color="#fff" />
                </AxisLine>
                <AxisTick show={false} />
                <AxisLabel color="#fff" fontSize={10}/>
              </YAxis>
              <Series
                symbolSize={0}
                name="会员数"
                smooth={true}
                data={SeriesData}
                type="line"
                areaStyle={{
                    "color":{"type":"linear","x":0,"y":0,"x2":0,"y2":1,
                      "colorStops": [
                        {"offset":0,"color":"#02ABF7"},
                        {"offset":1,"color":"#0ff8ff"}
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
Member.propTypes = {
  memberData: PropTypes.object,
  MemberChart: PropTypes.object,
}

export default Member
