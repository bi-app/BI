import React from 'react'
import styled from 'styled-components'
import { Recharts, Components } from 'react-component-echarts';
import { Empty } from 'antd';
import EmptyIma from '@/assets/Empty.svg'
import config from 'utils/config'
import numeral from 'numeral';

const { TextStyle, Label, Tooltip, Legend, Series } = Components

const StyledDiv = styled.div`
  position: relative;
  width: 600px;
`;
const EmptyWarp = styled.div`
  padding: 50px 0
`;

export default (props) => {
  const formatter = (name, data) => {
    const newArr = data.filter(_ => _.name === name)
    const len = newArr[0].name.length;
    return len === 2 ? `${newArr[0].name}         ${numeral(newArr[0].value).format('0,0')}` : len === 3 ? `${newArr[0].name}     ${numeral(newArr[0].value).format('0,0')}` : `${newArr[0].name}  ${numeral(newArr[0].value).format('0,0')}`
  }

  return (

      <StyledDiv>
        {
          props.LegendData.length === 0 ? <EmptyWarp>
              <Empty
                image={EmptyIma}
                imageStyle={{height: 120}}
                description={<span style={{color: '#2880B4', fontSize: 16}}
                >暂无相关数据</span>} />
            </EmptyWarp> :
            <Recharts
              height={300}
              color={["#2BDFA0","#A57EEC","#00A7F7","#FF8160","#FFB260","#F87B7B"]}
            >
              <Tooltip trigger="item" formatter="{a} <br/>{b}:({d}%)" extraCssText={config.pieExtraCssText}/>
              <Legend orient="vertical" top="middle" left={20} itemWidth={12} itemHeight={12} formatter={(name) => formatter(name, props.totalSeries)} data={props.LegendData}>
                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
              </Legend>
              <Series
                name="业态总销售额"
                type="pie"
                center={['60%', '50%']}
                radius={["20%","40%"]}
                itemStyle={{"normal":{"borderColor":"#090237", "borderWidth":2}}}
                data={props.totalSeries}
              >
                <Label show={false} />
              </Series>
              <Series
                name="销售额"
                type="pie"
                color={["#0FECF2","#FFDA6D"]}
                center={['60%', '50%']}
                radius={["40%","60%"]}
                labelLine={{"normal":{"show":true,"length":20,"length2":20,"lineStyle":{"type":"solid","width":1}}}}
                itemStyle={{"normal":{"borderColor":"#090237","borderWidth":2}}}
                data={props.salesSeries}
              >
                <Label normal={{ "formatter":"{b},{c}元" }} />
              </Series>
            </Recharts>
        }
      </StyledDiv>
  )
}


