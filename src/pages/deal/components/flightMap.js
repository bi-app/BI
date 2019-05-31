import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import ReactEcharts from 'echarts-for-react'
import echarts from "echarts"
import config from 'utils/config'
//导入组件
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Recharts, Components } from 'react-component-echarts';
import produce from "immer";
import numeral from 'numeral';
import { Modal } from 'antd';
const { XAxis, YAxis, Series, Grid, Tooltip } = Components;


@immutableRenderDecorator
class FlightMap extends Component {
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

  setToolTipSwich = (Instance) => {
    Instance._api.dispatchAction({ type: 'hideTip' });
    clearTimeout(this.timer);
    const { source, target } = this.state;
    const sourceName = source.length !== 0 && source[0].name;
    const targetName = target.length !== 0 && target[0].name;
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
    const { typeSalesVal } = this.props;
    const { storeSales } = this.state;
    const typeName = params.name;
    if(typeName === '零售' || typeName === '餐饮' || typeName === '服务配套' || typeName === '主力店'){
      const getType = typeSalesVal.filter(_ => _.OperationName === typeName);
      if(getType && getType.length !== 0){
        return `${params.name} <br/> ${Number(getType[0].TotalSaleAmt)}元`
      }
    }else {
      return `${params.name} <br/> ${storeSales}元`
    }
  }

  _autoPlayPointForOrder = (nextProps) => {
    const { storesliving, typePoint, typeSalesVal, dispatch } = nextProps;
    if(storesliving[this.props.updateIndex]){
      const { OperationTypeId, StoreName, TotalSaleAmt } = storesliving[this.props.updateIndex];
      const getFloorID = typeSalesVal.filter(_ => _.OperationID === OperationTypeId);//获取楼层
      // console.warn("getFloorID", getFloorID)
      const center = typePoint.nodes.filter(_ => _.id === '0'); //中心点
      const source = typePoint.nodes.filter(_ => _.name === StoreName); //起点
      const target = typePoint.nodes.filter(_ => _.name === (getFloorID && getFloorID.length !== 0 && getFloorID[0].OperationName)); //第一级
      // console.warn("获取到的楼层数据：", center, source, target)
      const newTypePoint = produce(typePoint, nextData => {
        nextData.nodes[0].name = numeral(Number(nextData.nodes[0].attributes.name) + Number(TotalSaleAmt)).format('0,0')
        nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(TotalSaleAmt))
        nextData.nodes.forEach(_ => {
          if(_.OperationID === OperationTypeId){
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
      // console.warn("------------newFloorPoint|||||||||||", newTypePoint)
      this.props.dispatch({type: 'deal/_setTypeCenterVal', payload: {Data: newTypePoint}})

      if(center && center.length !== 0 && source && source.length !== 0 && target && target.length !== 0){
        const effect = [
          {"period": 1.6, "delay": 10, "data": [{"coords":[source[0].value, target[0].value]}]},
          {"period": 2, "delay": 1000, "data": [{"coords":[target[0].value, center[0].value]}]}
        ]
        this.setState((preState) => ({center, source, target, effect, storeSales: TotalSaleAmt}))
        dispatch({type: 'deal/updateFloorCenterSales', payload: {sales: TotalSaleAmt}})
      }else {
        this.setState({center: [], source:[], target: [], effect: [], storeSales: 0})
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log("nextProps", nextState)dealBtnInit
    if( this.props.updateIndex !== nextProps.updateIndex || this.props.typePoint !== nextProps.typePoint || this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // console.log("this.props.updateIndex", this.props.currentOrder)
    // console.log("nextProps.currentOrder", nextProps.currentOrder)
    // console.log("之前", this.props.updateIndex)
    // console.log("-----------------------------")

    if(this.props.updateIndex !== nextProps.updateIndex){//更新
      //清除动画
      // console.log("当前序号1：", this.props.updateIndex)
      // console.log("当前2", nextProps.updateIndex)
      if(this.props.updateIndex === nextProps.storesliving.length){
        this.setState({center: [], source:[], target: [], effect: [], storeSales: 0})
        return
      }
      this._autoPlayPointForOrder(nextProps);
    }
  }


  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  _getStoreInfo = (params) => {
    if(params.data.id !== '0'){
      console.warn("params", params)
      const { StartTime, EndTime } = this.props.fetchDate
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
          const payload = {StartTime, EndTime, StoreID: params.data.storeId.StoreId}
          this.props.dispatch({ type: 'deal/getStoresInfo', payload })
          console.log("params.data", params)
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
    // console.warn("===========类型图渲染一次==============")
    const { hide, typePoint } = this.props;
    const { edges, nodes } = typePoint;
    const { center, effect, source, target } = this.state;

    const StyledDiv = styled.div`
      display: ${ hide ? "block" : "none" };
      position: relative;
      width: 100%;
      height: 100%;
      bottom: 0;
      left: 0;
    `;

    /**
     * Recharts 参数：
     * notMerge:
     * */
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
}

export default FlightMap
