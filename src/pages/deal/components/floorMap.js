import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import echarts from "echarts"
//导入组件
import { Recharts, Components } from 'react-component-echarts';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import config from 'utils/config'
import produce from "immer";
import numeral from 'numeral';
import { Modal, Empty } from 'antd';
import { connect } from 'dva/index';
import _ from 'lodash'
import moment from "moment"
import { Timer } from 'utils/Timer';
import EmptyIma from '@/assets/Empty.svg'
const isEqual = require("react-fast-compare");
const { XAxis, YAxis, Series, Grid, Tooltip } = Components;

let initState = {
  effect: [],
  center: [],
  source: [],
  target: [],
}
let initIndex = 0;

// @immutableRenderDecorator
@connect(({ deal }) => ({ deal }))
class FloorMap extends Component {
  timer = null;
  Time = null;
  newTimer = null;
  timerID = null;
  echartsRefs = React.createRef();
  state = initState

  componentDidMount() {}

  update = () => {
    const { storesliving, floorEffect, floorSalesVal, floorPoint  } = this.props.deal
    const newArr = _.chunk(storesliving, 5);
    let target = [],
      source = [],
      center = [],
      effect = [],
      getfloorid = [];
      let currentOrder = newArr[initIndex]
    if(initIndex >= newArr.length){
      this.props.dispatch({
        type: "deal/_setFloorEffect",
        payload: {
          floorEffect: {
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
      _.forEach(floorSalesVal, (el, j) => {
        _.forEach(currentOrder, (e, i) => {
          if (el.FloorId === e.FloorId) getfloorid.push(el)
        })
      });

      _.forEach(floorPoint.nodes, (item, index) => {//匹配绑定店铺
        _.forEach(getfloorid, (e, i) => {
          if (item.name === e.FloorName + 'F') target.push({ ...item })
        })
        _.forEach(currentOrder, (e, i) => {
          if (item.name === e.StoreName) source.push(item)
        })
      });
      const newTarget = _.uniq(target);
      if (source.length !== 0 && target.length !== 0){
        center = floorPoint.nodes.filter(_ => _.id === '0'); //中心点
        _.forEach(floorPoint.edges, (el, j) => {
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
        this.props.dispatch({ type: "deal/_setFloorEffect", payload: { floorEffect: NewfloorEffect }})
      }

      let sumprice = numeral(currentOrder.reduce(function (total, currentValue, currentIndex, arr) {
        return total + currentValue.TotalSaleAmt;
      }, 0)).format('0[.]00');

      let newPoint = produce(floorPoint, nextData => {
        nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(sumprice))
        const newNum = nextData.nodes[0].attributes.name
        nextData.nodes[0].name = numeral(newNum).format('0[.]00')
        nextData.nodes.forEach(_ => {
          currentOrder.forEach((e) => {
            if(e.StoreName === _.name){
              _.TotalSaleAmt = numeral(Number(_.TotalSaleAmt) + Number(e.TotalSaleAmt)).format('0[.]00')
              return _
            }
            if(_.FloorId && e.FloorId === _.FloorId){
              _.TotalSaleAmt = numeral(Number(_.TotalSaleAmt) + Number(e.TotalSaleAmt)).format('0[.]00')
              return _
            }
          })
        })
      });
      this.props.dispatch({ type: "deal/_setFloorCenterVal", payload: { Data: newPoint }})
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

  // componentDidUpdate(props, state){
  //   if(!isEqual(props.deal.currentOrder, this.props.deal.currentOrder)){
  //
  //
  //
  //
  //   }
  //
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if(!isEqual(nextProps.deal.floorEffect, prevState)){
  //     if(nextProps.deal.floorEffect.effect.length !== 0 &&
  //       nextProps.deal.floorEffect.target.length !== 0 &&
  //       nextProps.deal.floorEffect.source.length !== 0 &&
  //       nextProps.deal.floorEffect.center.length !== 0
  //     ){
  //       return produce(prevState, dra => {
  //         dra.effect = nextProps.deal.floorEffect.effect
  //         dra.target = nextProps.deal.floorEffect.target
  //         dra.source = nextProps.deal.floorEffect.source
  //         dra.center = nextProps.deal.floorEffect.center
  //       })
  //     }
  //     return initState
  //   }
  //   return initState
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.error("nextProps", nextProps.deal.storesliving)
  //
  //   if (nextProps.deal.currentOrder && !_.isEqual(nextProps.deal.currentOrder, prevState.currentOrder)){
  //     const { currentOrder, floorSalesVal, floorPoint } = nextProps.deal;
  //     let target = [],
  //       source = [],
  //       center = [],
  //       effect = [],
  //       getFloorID = [];
  //
  //     if(currentOrder.length !== 0) {
  //       _.forEach(floorSalesVal, (el, j) => {
  //         _.forEach(currentOrder, (e, i) => {
  //           if (el.FloorId === e.FloorId) getFloorID.push(el)
  //         })
  //       });
  //
  //       _.forEach(floorPoint.nodes, (item, index) => {//匹配绑定店铺
  //
  //         _.forEach(getFloorID, (e, i) => {
  //           if (item.name === e.FloorName + 'F') target.push({ ...item })
  //         })
  //
  //         _.forEach(currentOrder, (e, i) => {
  //           if (item.name === e.StoreName) source.push(item)
  //         })
  //
  //       });
  //       const newTarget = _.uniq(target);
  //       if (source.length !== 0 && target.length !== 0){
  //         center = floorPoint.nodes.filter(_ => _.id === '0'); //中心点
  //         _.forEach(floorPoint.edges, (el, j) => {
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
  //
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
  //   console.warn("nextProps", nextProps.deal.currentOrder)
  //   console.warn("this.state", this.state.currentOrder)
  //   console.warn("nextState", nextState.currentOrder)
  //
  //   if(this.state.currentOrder !== nextProps.deal.currentOrder){
  //     console.warn("不一样了")
  //
  //   }else {
  //     if (this.newTimer) {
  //       clearTimeout(this.newTimer);
  //     }
  //     this.newTimer = setTimeout(() => {
  //       this.props.dispatch({ type: 'deal/_setCurrentOrder', payload: {currentOrder: []}})
  //     }, 3000)
  //     console.warn("一样了")
  //   }
  // }

  componentWillUnmount() {
    // this.newTimer && clearTimeout(this.newTimer);
    if(this.timerID){
      clearInterval(this.timerID)
    }
  }

  _getStoreInfo = (params) => {
    console.log('%c 楼层：点击查询数据','background:#aaa;color:red', params);
    if(params.data.id !== '0' && params.data.TotalSaleAmt){
      const ModalBasic = {
        width: 300,
        maskClosable: true,
        mask:false,
        className: 'storeInfoWarp',
        style: {
          top: (params.event.offsetY + 205) > window.innerHeight ? 700 : params.event.offsetY,
          left: params.event.offsetX,
          margin: 0,
          padding: 0,
        },
      }

      if(params.name.split("F").length === 2){
        Modal.info({
          title: `楼层: ${params.name}`,
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
    const { effect, center, source, target } = deal.floorEffect;
    const { edges, nodes } = deal.floorPoint;
    const StyledDiv = styled.div`
      display: ${ hide ? "block" : "none" };
      position: relative; 
      width: ${window.innerWidth};
      height: ${window.innerHeight};
      top: 0;
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

    if (nodes.length === 1){
      return <HlodCont>
        <Empty image={EmptyIma} description={<span style={{color: '#2880B4', fontSize: 16}}>暂无相关楼层点位数据，请在管理后台设置</span>} />
      </HlodCont>
    }
    return (
        <StyledDiv ref={this.echartsRefs}>
          <Recharts
            devicePixelRatio={window.devicePixelRatio}
            renderer={'canvas'}
            width={window.innerWidth}
            height={window.innerHeight}
            backgroundColor={new echarts.graphic.RadialGradient(0.5, 0.4, 0.7, [
              {offset: 0, color: '#0d0369'},
              {offset: 1, color: '#090237'}
            ])}
            onEvents = {[['click',params  =>  this._getStoreInfo(params)]]}
          >
            <Tooltip trigger="item" triggerOn={"none"} extraCssText={config.dealToolTips}/>
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
              label={{normal: {show: true, fontSize: 14, color: '#090237', position: 'inside',}}}
              itemStyle={{normal: {shadowColor: 'none'}}}
              lineStyle={{width: 0.5, color: '#0d76a7', curveness: 0.3}}
              // emphasis={{lineStyle: {width: 4}}}
              links={edges}
              data={nodes}
              animation={false}
            />
            {
              effect.map((_, i) => (
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
              ))
            }
            {
              center.length !== 0 ? <Series
                type={'effectScatter'}
                coordinateSystem={ 'cartesian2d'}
                zlevel={2}
                rippleEffect={{period: 2, scale: 1.6, brushType: 'fill'}}
                label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
                symbolSize={20}
                itemStyle={{normal: {color: "#090237"}}}
                data={center}
                animation={false}
              /> : null
            }
            {
              source.length !== 0 ? <Series
                type={'effectScatter'}
                coordinateSystem={ 'cartesian2d'}
                zlevel={2}
                rippleEffect={{period: 2, scale: 4, brushType: 'fill'}}
                label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
                symbolSize={20}
                itemStyle={{normal: {color: "#6fdfff"}}}
                data={source}
                animation={false}
              /> : null
            }
            {
              target.length !== 0 ? <Series
                type={'effectScatter'}
                coordinateSystem={ 'cartesian2d'}
                zlevel={2}
                rippleEffect={{period: 2, scale: 1.6, brushType: 'fill'}}
                label={{normal: {show: true, position: 'inside', formatter: '{b}', fontSize: 14}}}
                symbolSize={20}
                itemStyle={{normal: {color: "#6fdfff"}}}
                data={target}
                animation={false}
              /> : null
            }
          </Recharts>
        </StyledDiv>
    )
  }
}

FloorMap.propTypes = {
  hide: PropTypes.bool,
  dispatch: PropTypes.func,
  updateIndex: PropTypes.number,
  floorSalesVal: PropTypes.array,
  storesliving: PropTypes.array,
  floorPoint: PropTypes.object,
}

export default FloorMap
