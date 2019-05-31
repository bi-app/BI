import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import echarts from "echarts"
//导入组件
import { Recharts, Components } from 'react-component-echarts';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import config from 'utils/config'
import moment from 'moment'
import produce from "immer";
import numeral from 'numeral';
import { Modal } from 'antd';
import { connect } from 'dva/index';
const { XAxis, YAxis, Series, Grid, Tooltip } = Components;

@immutableRenderDecorator
@connect(({ deal }) => ({ deal }))
class FloorMap extends Component {
  timer = null;
  echartsRefs = React.createRef();
  state = {
    effect: [],
    center: [],
    source: [],
    target: [],
    storeSales: 0,
  }

  componentDidMount() {}

  _autoPlayPointForOrder = (nextProps) => {
    const { floorPoint, floorSalesVal, storesliving, dispatch, updateIndex } = nextProps;

    if(storesliving[this.props.updateIndex]){
      const { FloorId, OperationTypeId, StoreID, StoreName, TotalSaleAmt } = storesliving[this.props.updateIndex];
      const getFloorID = floorSalesVal.filter(_ => _.FloorId === FloorId);//获取楼层
      const center = floorPoint.nodes.filter(_ => _.id === '0'); //中心点
      const source = floorPoint.nodes.filter(_ => _.name === StoreName); //起点
      const target = floorPoint.nodes.filter(_ => _.name === (getFloorID && getFloorID.length !== 0 && getFloorID[0].FloorName + 'F')); //第一级
      //更新总的销售值
      const newFloorPoint = produce(floorPoint, nextData => {
        nextData.nodes[0].name = numeral(Number(nextData.nodes[0].attributes.name) + Number(TotalSaleAmt)).format('0,0');
        nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(TotalSaleAmt));

        nextData.nodes.forEach(_ => {
          if(_.FloorId === FloorId){
            _.TotalSaleAmt = _.TotalSaleAmt + TotalSaleAmt
            return _
          }
          if(_.name === StoreName){
            _.TotalSaleAmt = _.TotalSaleAmt + TotalSaleAmt
            return _
          }
          return _
        })

      });
      // console.warn("newFloorPoint", newFloorPoint)

      this.props.dispatch({type: 'deal/_setFloorCenterVal', payload: {Data: newFloorPoint}})

      if(center && center.length !== 0 && source && source.length !== 0 && target && target.length !== 0){
        const effect = [
          { "period": 1.6, "delay": 10, "data": [{"coords":[source[0].value, target[0].value]}]},
          { "period": 2, "delay": 1000, "data": [{"coords":[target[0].value, center[0].value]}]}
        ]
        this.setState((preState) => ({center, source, target, effect, storeSales: TotalSaleAmt}), () => {
          // console.log("更新成功", TotalSaleAmt)
        })
      }else {
        this.setState({center: [], source:[], target: [], effect: [], storeSales: 0})
      }
    }
  }

  setToolTipSwich = (Instance) => {
    // console.log("Instance", Instance)
    Instance.resize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    Instance._api.dispatchAction({ type: 'hideTip' });
    clearTimeout(this.timer)
    const { source, target } = this.state;
    const sourceName = source.length !== 0 && source[0].name
    const targetName = target.length !== 0 && target[0].name

    Instance._api.dispatchAction({
      type: 'showTip',
      name: sourceName,
      seriesIndex: 0,
    })
    this.timer = setTimeout(() => {
      Instance._api.dispatchAction({
        type: 'showTip',
        name: targetName,
        seriesIndex: 0,
      })
    }, 1500)
  }

  formatter = (params,p,a) => {
    const { floorSalesVal } = this.props;
    const { storeSales } = this.state;
    const floorOrStore = params.name.split("F").length;

    if(floorOrStore === 1){
      //店铺
      return `${params.name} <br/> ${storeSales}元`
    }else {
      //楼层
      const floor = floorSalesVal.filter(_ => _.FloorName === params.name.split("F")[0])
      if(floor && floor.length !== 0){
        // console.warn("params", params.data.TotalSaleAmt)
        return `${params.name} <br/> ${Number(floor[0].TotalSaleAmt)}元`
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if( this.props.updateIndex !== nextProps.updateIndex || this.props.floorPoint !== nextProps.floorPoint || this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // console.log("楼层图获取到了")
    if( this.props.updateIndex !== nextProps.updateIndex){//更新
      if(this.props.updateIndex === nextProps.storesliving.length){
        this.setState({center: [], source:[], target: [], effect: [], storeSales: 0})
        return
      }
      this._autoPlayPointForOrder(nextProps);
    }
  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer);
  }

  _getStoreInfo = (params) => {
    if(params.data.id !== '0'){
      const { StartTime, EndTime } = this.props.fetchDate
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
          // const payload = {StartTime, EndTime, StoreID: params.data.storeId.StoreId}
          // this.props.dispatch({ type: 'deal/getStoresInfo', payload })
          // console.log("params.data", params)
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
    // console.log("楼层图获取到了")
    const { floorPoint, hide } = this.props;
    const { edges, nodes } = floorPoint;
    const { effect, center, source, target } = this.state;
    const StyledDiv = styled.div`
      display: ${ hide ? "block" : "none" };
      position: relative;
      width: ${window.innerWidth};
      height: ${window.innerHeight};
      top: 0;
      left: 0;
    `;
    return (
      <StyledDiv ref={this.echartsRefs}>
        <Recharts
          devicePixelRatio={window.devicePixelRatio}
          width={window.innerWidth}
          height={window.innerHeight}
          backgroundColor={new echarts.graphic.RadialGradient(0.5, 0.4, 0.7, [
            {offset: 0, color: '#0d0369'},
            {offset: 1, color: '#090237'}
          ])}
          onEvents = {[['click',params  =>  this._getStoreInfo(params)]]}
          onLoad={(Instance) => this.setToolTipSwich(Instance)}
        >
          <Tooltip trigger="item" triggerOn="none" formatter={this.formatter} extraCssText={config.dealToolTips}/>
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
            effect.map((_, i) => (
              <Series
                key={i}
                type='lines'
                polyline={false}
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

FloorMap.propTypes = {
  hide: PropTypes.bool,
  updateIndex: PropTypes.number,
}

export default FloorMap
