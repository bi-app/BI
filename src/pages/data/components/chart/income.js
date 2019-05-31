import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
// import echarts from 'echarts'
import { Statistic, Icon } from 'antd';
//导入组件
import { Recharts, Components } from 'react-component-echarts'
import styles from './index.less'
import config from 'utils/config'
const { TextStyle, Label, Legend, Tooltip, Series } = Components

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

const IncomeText = styled.div`
    width: 49.2%;
    height: 100%;
    padding: 14px 0 14px 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: flex-start;
`;

const IncomeChart = styled.div`
    width: 50.8%;
    height: 100%;
`;

class Income extends PureComponent {
  render() {
    const {
      incomeData:{TotalNetAmt, SequentialValue, PaidPercent, UnChargeAmt},
      incomeChart
    } = this.props;

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
      <div className={styles.income_warp + ' ' + styles.four_corner_border}>
        <IncomeText>
          <Title>收益</Title>
          <Statistic
            value={TotalNetAmt}
            precision={2}
            valueStyle={{ fontSize: 34,color: '#fff' }}
            suffix="万"
            style={{width: '100%'}}
          />
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
            <ItemTitle>收缴率</ItemTitle>
            <Result>
              <Statistic
                value={statusNum(PaidPercent)}
                precision={2}
                valueStyle={{ fontSize: 16,color: '#fff' }}
                suffix="%"
              />
            </Result>
          </IntroText>
          <IntroText>
            <ItemTitle>欠费金额</ItemTitle>
            <Result>
              <Statistic
                value={UnChargeAmt}
                precision={0}
                valueStyle={{ fontSize: 16,color: '#0fecf2' }}
              />
            </Result>
          </IntroText>
        </IncomeText>
        <IncomeChart>
          <Recharts color={["#2BDFA0","#FF8160","#FDD96D","#0FECF2","#00A5F7", "#C12E34", "#E6B600", "#0098D9", "#2B821D", "#005EAA", "#339CA8", "#CDA819"]}>
            <Legend icon="circle"  orient="horizontal" x="center" show={true} itemGap={4} itemWidth={7} itemHeight={7} bottom="9%">
              <TextStyle color="#fff" fontSize={10} padding={[2,0,0,0]}/>
            </Legend>
            <Tooltip show={true} formatter="{c}元" extraCssText={config.pieExtraCssText} />
            <Series
              itemStyle={{
                "borderWidth":2,
                "borderColor":"#13153e"
              }}
              type="pie" radius="50%"
              center={["50%","34%"]}
              data={incomeChart}
            >
              <Label show={false} />
            </Series>
          </Recharts>
        </IncomeChart>
      </div>
    )
  }
}

export default Income
