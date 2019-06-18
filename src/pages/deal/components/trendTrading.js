import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'dva'
import { Empty } from 'antd'
import { Recharts, Components } from 'react-component-echarts'
import EmptyIma from 'assets/Empty.svg'
import config from "utils/config";
const {
  AxisPointer,
  TextStyle,
  LineStyle,
  AxisTick,
  AxisLine,
  AxisLabel,
  NameTextStyle,
  SplitLine,
  Tooltip,
  Legend,
  Grid,
  XAxis,
  YAxis,
  Series } = Components
const StyledDiv = styled.div`
  position: relative;
  width: 700px;
`;
const EmptyWarp = styled.div`
  padding: 50px 0
`;

export default (props) => {
  return (
    <StyledDiv>
      {
        props.BizDate.length === 0 ? <EmptyWarp>
            <Empty
              image={EmptyIma}
              imageStyle={{height: 120,}}
              description={<span style={{color: '#2880B4', fontSize: 16}}
              >暂无相关数据</span>} />
          </EmptyWarp> :
          <Recharts
            height={300}
            color={["#0FECF2","#FFDA6D","#D06958"]}>
            <Tooltip trigger="axis" extraCssText={config.dataExtraCssText}>
              <AxisPointer type="shadow" />
            </Tooltip>
            <Legend x="center" itemWidth={10} itemHeight={10} icon='rect'>
              <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
            </Legend>
            <Grid left="4%" right="4%" bottom="3%" containLabel={true} />
            <XAxis type="category" data={props.BizDate}>
              <AxisTick show={false} alignWithLabel={true} />
              <AxisLine>
                <LineStyle color="#fff" />
              </AxisLine>
              <AxisLabel color="#fff" fontSize={10} />
            </XAxis>
            <YAxis type="value" name="（万元）" nameGap={16} min={0}>
              <NameTextStyle padding={[0,45,5,0]} />
              <AxisTick show={false} />
              <AxisLine show={true}>
                <LineStyle color="#fff" />
              </AxisLine>
              <SplitLine show={false} />
              <AxisLabel color="#fff" fontSize={10} />
            </YAxis>
            <YAxis type="value" name="（人）" nameGap={16} position="right" min={0} color="#fff">
              <NameTextStyle padding={[0,0,5,40]} />
              <AxisTick show={false} />
              <AxisLine show={true}>
                <LineStyle color="#fff" />
              </AxisLine>
              <SplitLine show={false} />
              <AxisLabel color="#fff" fontSize={10} />
            </YAxis>
            <Series z={3} name="客流" type="line" yAxisIndex={1} smooth={true} symbol="circle" symbolSize={6} showSymbol={true} data={props.GuestCount} />
            <Series z={2} stack="销售" name="会员销售" barGap="-100%" type="bar"  data={props.CustSaleAmt} />
            <Series z={1} stack="销售" name="非会员销售" barGap="-100%" type="bar"  data={props.NoCustSaleAmt} />
          </Recharts>
      }

    </StyledDiv>
  )
}
