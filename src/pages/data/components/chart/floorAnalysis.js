import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import echarts from 'echarts'
import { Row, Col, Statistic, Icon, Button } from 'antd';
//导入组件
import { Recharts, Components } from 'react-component-echarts'
import styles from './index.less'
import config from "utils/config";
const { TextStyle, Tooltip, AxisPointer, LineStyle, SplitLine, AxisTick, AxisLine, AxisLabel, NameTextStyle, Grid, Legend, XAxis, YAxis, Series } = Components

const IntroText = styled.div`
  margin: 0;
  margin-bottom: 12px;
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
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
const Itemtext = styled.div`
  display: inline-block;
  vertical-align: middle;
  flex: 1;
`;

class FloorAnalysis extends PureComponent {
  componentDidMount(){

  }
  render() {
    const {
      FloorSale: {SortIndex, SalePercentEveryArea, EarnPercentEveryArea, MainOperationTypeStoreName, OperationTypeName},
      FloorSaleChart: {XAxisData, SeriesData: { PassengerFlow, vip, noVip }}
    } = this.props;

    return (
      <div className={styles['right-slider-chart-1']}>
        <div className={styles.chart_list_title}>
          <div className={styles.list_title_text}>
            楼层销售分析
            <i className={styles['border-top']}/>
            <i className={styles['border-oblique']}/>
          </div>
        </div>
        <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
          <div className={styles['flex-left-text']}>
            <IntroText>
              <ItemTitle>综合排名:</ItemTitle>
              <Result>
                <Statistic
                  value={SortIndex}
                  precision={0}
                  valueStyle={{ color: '#ff8160' }}
                  prefix="NO."
                />
              </Result>
            </IntroText>
            <IntroText>
              <ItemTitle>销售坪效:</ItemTitle>{SalePercentEveryArea}
            </IntroText>
            <IntroText>
              <ItemTitle>收益坪效:</ItemTitle>{EarnPercentEveryArea}
            </IntroText>
            {
              MainOperationTypeStoreName ? <IntroText>
                <ItemTitle>主力店:</ItemTitle>
                <Itemtext>{MainOperationTypeStoreName}</Itemtext>
              </IntroText> : null
            }

            <IntroText>
              <ItemTitle>业态:</ItemTitle>
              <Itemtext>{OperationTypeName}</Itemtext>
            </IntroText>
          </div>
          <div className={styles['flex-1']}>
            <Recharts color={["#ff8160","#ffda6d","#0fecf2"]}>
              <Tooltip
                trigger="axis"
                extraCssText={config.dataExtraCssText}
              >
                <AxisPointer type="line" />
              </Tooltip>
              <Grid left="16%" top="30%" bottom="10%" right="10%" />
              <Legend top="0" x='right' icon="rect" itemWidth={9} itemHeight={9}>
                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
              </Legend>
              <XAxis type="category" data={XAxisData}>
                <SplitLine show={false} />
                <AxisTick show={false} />
                <AxisLine>
                  <LineStyle color="#fff"/>
                </AxisLine>
                <AxisLabel color="#fff" fontSize={10}/>
              </XAxis>
              <YAxis type="value" name="金额（万元）" min={0}>
                <AxisLine>
                  <LineStyle color="#fff" />
                </AxisLine>
                <AxisLabel color="#fff" fontSize={10}/>
                <SplitLine show={false} />
                <AxisTick show={false} />
                <NameTextStyle color="#fff" fontSize={10}/>
              </YAxis>
              <YAxis type="value" name="客流（人）" min={0}>
                <AxisLine>
                  <LineStyle color="#fff" />
                </AxisLine>
                <AxisLabel color="#fff" fontSize={10}/>
                <SplitLine show={false} />
                <AxisTick show={false} />
                <NameTextStyle color="#fff" fontSize={10}/>
              </YAxis>
              <Series z={3} name="客流" type="line" yAxisIndex={1} symbolSize={0} smooth={true} data={PassengerFlow} />
              <Series z={2} barWidth={6} barGap="-100%" name="会员销售" type="bar" data={vip} />
              <Series z={1} barWidth={6} barGap="-100%" name="非会员销售" type="bar" data={noVip} />
            </Recharts>
          </div>
        </div>
      </div>
    )
  }
}

export default FloorAnalysis
