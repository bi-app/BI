import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Statistic, Icon } from 'antd';
import WaterBall from '@/components/waterBall';
import styles from './index.less';
// import { WaterWave } from 'ant-design-pro/lib/Charts';
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

const PassflowText = styled.div`
    width: 50.9%;
    height: 100%;
    padding: 14px 0 14px 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: flex-start;
`;

const PassflowChart = styled.div`
    width: 49.1%;
    height: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;


class Passflow extends PureComponent {
  getCircleProps = () =>{
    let props = {
      idDom: 'circleWaterBall2',
      width: 120,
      height: 120,
      textColor: "#fff",
      waveTextColor: "#333",
      textSize: .9,
      title: '提袋率',
      outerCircle:{
        r: 60,
        fillColor: '#02c7ff'
      },
      innerCircle:{
        r: 58,
        fillColor: '#00AFF6'
      }
    };
    return props;
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(this.props !== nextProps){
  //     return true;
  //   }
  //   return false;
  // }



  render() {
    const { CarInCount, PaidPercent, SequentialValue, TotalPassengerFlowCount } = this.props;
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
      <div className={styles.div1_text + ' ' + styles.four_corner_border}>
        <PassflowText>
          <Title>客流</Title>
          <Statistic
            value={TotalPassengerFlowCount}
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
            <ItemTitle>提袋率</ItemTitle>
            <Result>
              <Statistic
                value={statusNum(PaidPercent)}
                precision={2}
                valueStyle={{ fontSize: 16,color: statusColor(PaidPercent) }}
                prefix={statusIcon(PaidPercent)}
                suffix="%"
              />
            </Result>
          </IntroText>
          <IntroText>
            <ItemTitle>车流</ItemTitle>
            <Result>
              <Statistic
                value={CarInCount}
                precision={2}
                valueStyle={{ fontSize: 16,color: '#fff' }}
                suffix="车次"
              />
            </Result>
          </IntroText>
        </PassflowText>
        <PassflowChart>
          <WaterBall data={{id: 1, value: PaidPercent/100}} config={this.getCircleProps()}/>
          {/*<WaterWave*/}
            {/*height={120}*/}
            {/*title="提袋率"*/}
            {/*percent={PaidPercent}*/}
          {/*/>*/}
          {/*<ProgressBall value={PaidPercent} size={120} />*/}
          {/*<div className={styles['waterWave_cont']}>*/}
            {/*<WaterWave height={120} title="提袋率" percent={PaidPercent} color='#00B2F6' />*/}
          {/*</div>*/}
        </PassflowChart>
      </div>
    )
  }
}

export default Passflow
