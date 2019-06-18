import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import echarts from "echarts"
import config from 'utils/config'
//导入组件
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Recharts, Components } from 'react-component-echarts';
import produce from "immer";
import numeral from 'numeral';
import { Modal, Empty } from 'antd';
import { connect } from 'dva/index';
const isEqual = require("react-fast-compare");
const { XAxis, YAxis, Series, Grid, Tooltip } = Components;
import EmptyIma from '@/assets/Empty.svg'
import { Timer } from 'utils/Timer';
import _ from 'lodash';
let initState = {
  effect: [],
  center: [],
  source: [],
  target: [],
}
let initIndex = 0;

@immutableRenderDecorator
@connect(({ deal }) => ({ deal }))
class FlightMap extends Component {
  timer = null;
  timerID = null;
  echartsRefs = React.createRef();
  state = initState

  componentDidMount() {}

  update = () => {
    const { storesliving, floorEffect, typeSalesVal, typePoint  } = this.props.deal
    const newArr = _.chunk(storesliving, 5);
    let target = [],
      source = [],
      center = [],
      effect = [],
      getfloorid = [];
    let currentOrder = newArr[initIndex]
    if(initIndex >= newArr.length){
      this.props.dispatch({
        type: "deal/_setTypeEffect",
        payload: {
          typeEffect: {
            effect: [],
            center: [],
            source: [],
            target: [],
          }
        }
      })
      return
    }

    if(currentOrder){
      _.forEach(typeSalesVal, (el, j) => {
        _.forEach(currentOrder, (e, i) => {
          if (el.OperationID === e.OperationTypeId) getfloorid.push(el)
        })
      });

      _.forEach(typePoint.nodes, (item, index) => {//匹配绑定店铺
        _.forEach(getfloorid, (e, i) => {
          if(item.name === e.OperationName) target.push({...item})
        })
        _.forEach(currentOrder, (e, i) => {
          if(item.name === e.StoreName) source.push(item)
        })
      });
      const newTarget = _.uniq(target);
      if (source.length !== 0 && target.length !== 0){
        center = typePoint.nodes.filter(_ => _.id === '0'); //中心点
        _.forEach(typePoint.edges, (el, j) => {
          _.forEach(source, (ele, i) => {
            _.forEach(target, (o, p) => {
              if(el.source === ele.id && el.target === o.id){
                effect.push(
                  { "period": 1, "delay": 10, "data": [{"coords":[ele.value, o.value]}]},
                  { "period": 1.6, "delay": 900, "data": [{"coords":[o.value, center[0].value]}]}
                );
              }
            });
          });
        });
      }

      if(center.length !== 0 && newTarget.length !== 0 && effect.length !== 0  && source.length !== 0 ){
        let NewfloorEffect = produce(floorEffect, nextData => {
          nextData.center = center
          nextData.target = newTarget
          nextData.effect = effect
          nextData.source = source
        })
        this.props.dispatch({ type: "deal/_setTypeEffect", payload: { typeEffect: NewfloorEffect }})
      }

      let sumprice = numeral(currentOrder.reduce(function (total, currentValue, currentIndex, arr) {
        return total + currentValue.TotalSaleAmt;
      }, 0)).format('0[.]00');

      let newPoint = produce(typePoint, nextData => {
        nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(sumprice))
        const newNum = nextData.nodes[0].attributes.name
        nextData.nodes[0].name = numeral(newNum).format('0[.]00')
        nextData.nodes.forEach(_ => {
          currentOrder.forEach((e) => {
            if(e.StoreName === _.name){
              _.TotalSaleAmt = numeral(Number(_.TotalSaleAmt) + Number(e.TotalSaleAmt)).format('0[.]00')
              return _
            }
            if(_.OperationID && e.OperationTypeId === _.OperationID){
              _.TotalSaleAmt = numeral(Number(_.TotalSaleAmt) + Number(e.TotalSaleAmt)).format('0[.]00')
              return _
            }
          })
        })
      });
      this.props.dispatch({ type: "deal/_setTypeCenterVal", payload: { Data: newPoint }})
    }
    ++initIndex;
  }

  componentWillReceiveProps(props){
    if(!isEqual(props.deal.storesliving, this.props.deal.storesliving)){
      if(this.timerID){
        initIndex = 0;
        return this.timerID
      }
      this.timerID = setInterval(() => {
        this.update()
      }, 3000)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return !isEqual(nextProps, this.props)
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.deal.currentOrder && !_.isEqual(nextProps.deal.currentOrder, prevState.currentOrder)){
  //     const { currentOrder, typeSalesVal, typePoint } = nextProps.deal;
  //     let target = [],
  //       source = [],
  //       center = [],
  //       effect = [],
  //       getFloorID = [];
  //     if(currentOrder.length !== 0) {
  //       _.forEach(typeSalesVal, (el, j) => {
  //         _.forEach(currentOrder, (e, i) => {
  //           if(el.OperationID === e.OperationTypeId) getFloorID.push(el)
  //         })
  //       });
  //
  //       _.forEach(typePoint.nodes, (item, index) => {
  //         _.forEach(getFloorID, (e, i) => {
  //           if(item.name === e.OperationName) target.push({...item})
  //         })
  //         _.forEach(currentOrder, (e, i) => {
  //           if(item.name === e.StoreName) source.push(item)
  //         })
  //       });
  //
  //       const newTarget = _.uniq(target);
  //       if (source.length !== 0 && target.length !== 0){
  //         center = typePoint.nodes.filter(_ => _.id === '0'); //中心点
  //         _.forEach(typePoint.edges, (el, j) => {
  //           _.forEach(source, (ele, i) => {
  //             _.forEach(target, (o, p) => {
  //               if(el.source === ele.id && el.target === o.id){
  //                 effect.push(
  //                   { "period": 1, "delay": 10, "data": [{"coords":[ele.value, o.value]}]},
  //                   { "period": 1.6, "delay": 900, "data": [{"coords":[o.value, center[0].value]}]}
  //                 );
  //               }
  //             });
  //           });
  //         });
  //       }
  //       return {
  //         currentOrder: nextProps.deal.currentOrder,
  //         target: newTarget,source, effect, center
  //       }
  //     }
  //     return initState
  //   }
  //   return null
  // }


  // componentDidUpdate(nextProps, nextState){
  //   // console.warn("nextProps", nextProps.deal.currentOrder)
  //   // console.warn("this.state", this.state.currentOrder)
  //   // console.warn("nextState", nextState.currentOrder)
  //   console.warn("nextProps.deal.currentOrder", nextProps.deal.currentOrder)
  //   console.warn("nextState", this.state.currentOrder)
  //   console.warn("nextState", !_.isEqual(this.state.currentOrder, nextProps.deal.currentOrder))
  //
  //   if(!_.isEqual(this.state.currentOrder, nextProps.deal.currentOrder)){
  //     console.log('%c 业态：当前订单不一样','background:#282C34;color:#42C02E', this.state.currentOrder);
  //   }else {
  //     if(nextProps.deal.currentOrder.length !== 0){
  //       if (this.newTimer) {
  //         clearTimeout(this.newTimer);
  //       }
  //       this.newTimer = setTimeout(() => {
  //         this.props.dispatch({ type: 'deal/_setCurrentOrder', payload: {currentOrder: []}})
  //       }, 3000)
  //       console.log('%c 业态：当前订单一样了','background:#aaa;color:#EA6F5A', this.state.currentOrder);
  //     }
  //   }
  //
  //   // if(this.state.currentOrder !== nextProps.deal.currentOrder){
  //   //   console.log('%c 业态：当前订单不一样','background:#282C34;color:#42C02E', this.state.currentOrder);
  //   // }else {
  //   //   if (this.newTimer) {
  //   //     clearTimeout(this.newTimer);
  //   //   }
  //   //   this.newTimer = setTimeout(() => {
  //   //     this.props.dispatch({ type: 'deal/_setCurrentOrder', payload: {currentOrder: []}})
  //   //   }, 3000)
  //   //   console.log('%c 业态：当前订单一样了','background:#aaa;color:#EA6F5A', this.state.currentOrder);
  //   // }
  // }

  // shouldComponentUpdate(nextProps, nextState){
  //   // console.log("nextProps", nextState)dealBtnInit
  //   if( this.props.updateIndex !== nextProps.updateIndex || this.props.typePoint !== nextProps.typePoint || this.state !== nextState){
  //     return true;
  //   }
  //   return false;
  // }


  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
    if(this.timerID){
      clearInterval(this.timerID)
    }
  }

  _getStoreInfo = (params) => {
    console.log('%c 业态：点击查询数据','background:#aaa;color:red', params);
    if(params.data.id !== '0' && params.data.TotalSaleAmt){
      const ModalBasic = {
        width: 300,
        maskClosable: true,
        mask:false,
        className: 'storeInfoWarp',
        style: {
          top: (params.event.offsetY + 205) > window.innerHeight ? 700 : params.event.offsetY,
          left: (params.event.offsetX + 300) > window.innerWidth ? (params.event.offsetX - 150) : params.event.offsetX,
          margin: 0,
          padding: 0,
        },
      }

      if(params.name === "零售" || params.name === "服务配套" || params.name === "主力店" ||  params.name === "餐饮"){
        Modal.info({
          title: `业态: ${params.name}`,
          ...ModalBasic,
          content: (
            <div>
              <p>{`销售额：${params.data.TotalSaleAmt}元`}</p>
            </div>
          ),
        });
      }else {
        if(params.data.storeId){
          Modal.info({
            title: `店铺名称: ${params.name}`,
            ...ModalBasic,
            content: (
              <div>
                <p>{`销售额：${params.data.TotalSaleAmt}元`}</p>
              </div>
            ),
          });
        }
      }
    }
  }


  render() {

    const { hide, deal } = this.props;
    const { effect, center, source, target } = deal.typeEffect;
    const { edges, nodes } = deal.typePoint;
    const StyledDiv = styled.div`
      display: ${ hide ? "block" : "none" };
      position: relative;
      width: 100%;
      height: 100%;
      bottom: 0;
      left: 0;
    `;

    const HlodCont = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      display: ${ hide ? "flex" : "none" };
    `;

    /**
     * Recharts 参数：
     * notMerge:
     * */
    if (nodes.length === 1){
      return <HlodCont>
        <Empty image={EmptyIma} description={<span style={{color: '#2880B4', fontSize: 16}}>暂无相关业态点位数据，请在管理后台设置</span>} />
      </HlodCont>
    }
    return (
      <StyledDiv ref={this.echartsRefs} >
        <Recharts
          devicePixelRatio={window.devicePixelRatio}
          width={window.innerWidth}
          height={window.innerHeight}
          lazyUpdate={false}
          backgroundColor={new echarts.graphic.RadialGradient(0.5, 0.4, 0.7, [
            {offset: 0, color: '#0d0369'},
            {offset: 1, color: '#090237'}
            ])}
          onEvents = {[['click',params  =>  this._getStoreInfo(params)]]}
        >
          <Tooltip trigger="item" triggerOn="none" extraCssText={config.dealToolTips}/>
          <YAxis type="value" show={false}/>
          <XAxis type="value" show={false}/>
          <Grid left={0} right={210} bottom={0} top={120} containLabel={false}/>
          <Series
            type='graph'
            layout='none'
            coordinateSystem='cartesian2d'
            hoverAnimation={false}
            focusNodeAdjacency={false}
            z={3}
            label={{normal: {show: true, fontSize: 14, position: 'inside',}}}
            itemStyle={{normal: {shadowColor: 'none'}}}
            lineStyle={{width: 0.5, color: '#0d76a7', curveness: 0.3}}
            // emphasis={{lineStyle: {width: 4}}}
            links={edges}
            data={nodes}
            animation={false}
          />
          {
              effect.map((_, i) =>
                <Series
                  key={i}
                  type='lines'
                  coordinateSystem='cartesian2d'
                  zlevel={2}
                  effect={{
                    show: true,
                    period: _.period,
                    trailLength: 0.3,
                    color: '#fff',
                    symbolSize: 5,
                    delay: _.delay,
                    loop: false
                  }}
                  symbol='none'
                  animation={false}
                  lineStyle={{normal: {width: 0, curveness: 0.3}}}
                  data={_.data}
                />
              )
          }
          <Series
            type={'effectScatter'}
            coordinateSystem={ 'cartesian2d'}
            zlevel={2}
            rippleEffect={{period: 2, scale: 1.6, brushType: 'fill'}}
            label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
            symbolSize={20}
            itemStyle={{normal: {color: "#6fdfff"}}}
            data={center}
            animation={false}
          />
          <Series
            type={'effectScatter'}
            coordinateSystem={ 'cartesian2d'}
            zlevel={2}
            rippleEffect={{period: 2, scale: 4, brushType: 'fill'}}
            label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
            symbolSize={20}
            itemStyle={{normal: {color: "#6fdfff"}}}
            data={source}
            animation={false}
          />
          <Series
            type={'effectScatter'}
            coordinateSystem={ 'cartesian2d'}
            zlevel={2}
            rippleEffect={{period: 2, scale: 1.6, brushType: 'fill'}}
            label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
            symbolSize={20}
            itemStyle={{normal: {color: "#6fdfff"}}}
            data={target}
            animation={false}
          />
        </Recharts>
      </StyledDiv>

    )
  }
}

FlightMap.propTypes = {
  hide: PropTypes.bool,
  dispatch: PropTypes.func,
  updateIndex: PropTypes.number,
  typeSalesVal: PropTypes.array,
  storesliving: PropTypes.array,
  typePoint: PropTypes.object,
}

export default FlightMap
