/**
 * title: 交易屏-中铁建BI决策分析系统
 */

import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment';
import styles from './index.less'
import Sider from "./components/sider"
import FloorTrading from "./components/floorTrading"
import LiveTrading from "./components/liveTrading"
import RankTrading from "./components/rankTrading"
import TimesTrading from "./components/timesTrading"
import TrendTrading from "./components/trendTrading"
import TypeTrading from "./components/typeTrading"
import FlightMap from "./components/flightMap"
import FloorMap from "./components/floorMap"
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Timer } from 'utils/Timer'

@immutableRenderDecorator
@connect(({ app, deal, loading }) => ({ app, deal, loading }))
class Deal extends Component {
  newTimer = null;
  Time = null;
  state = {
    fetchDate: {
      StartTime: '',
      EndTime: ''
    }
  }

  componentDidMount() {
    const { dispatch, app, deal } = this.props
    const { Biconfig, dealRange } = app
    const { TransDataUpdateFrequency } = Biconfig
    const { StartTime, EndTime } = dealRange
    const getTime = TransDataUpdateFrequency * 60000
    let payload = dealRange
    let rankData = { StartTime, EndTime, TakeCount: 10 }
    // dispatch({type: 'deal/getDealTimeInterval'});//销售时段
    // dispatch({type: 'deal/getSalesTrend'});//销售趋势
    // dispatch({type: 'deal/GetFloorSaleAnalysisData', payload })//楼层销售分析统计数据
    // dispatch({type: 'deal/GetTypeSaleAnalysis', payload })//楼层销售分析统计数据

    this._fetchData();
    // this.Time = setInterval(() => this._fetchData(), getTime);
    this.newTimer = new Timer();
    this.Time = this.newTimer.interval(getTime, () => {
      this._fetchData();
    })


  }

  _fetchData = () => {
    const { dispatch, app, deal } = this.props
    const { dealRange, dealBtnInit, Biconfig } = app
    const { StartTime, EndTime } = dealRange
    const { TransDataUpdateFrequency } = Biconfig
    let payload = dealRange
    let rankData = { StartTime, EndTime, TakeCount: 10 }
    let initDataForm = { NowDate: moment().format("YYYY-MM-DD HH:mm:ss") }; //获取初始数据
    let livingDataForm = { StartTime: moment().subtract(TransDataUpdateFrequency, "minute").format("YYYY-MM-DD HH:mm:ss"), EndTime: moment().format("YYYY-MM-DD HH:mm:ss") }; //获取初始数据
    let livingDataForm1 = { StartTime: '2019-05-10 13:30:00', EndTime: moment().format("YYYY-MM-DD HH:mm:ss") }; //获取初始数据
    let AnalysisForm = { StartDate: StartTime, EndDate: EndTime}
    this.setState({fetchDate: livingDataForm})
    // console.warn("时间处理", payload)
    /**侧边栏数据请求*/
    dispatch({type: 'deal/getDealTimeInterval'});//销售时段
    dispatch({type: 'deal/getSalesTrend'});//销售趋势
    dispatch({type: 'deal/GetFloorSaleAnalysisData', payload: AnalysisForm })//楼层销售分析统计数据
    dispatch({type: 'deal/GetTypeSaleAnalysis', payload: AnalysisForm })//业态统计数据
    dispatch({type: 'deal/GetStoresRankInfo', payload: rankData })//楼层销售排行
    dispatch({type: 'deal/GetStoreslivingInfo', payload: livingDataForm }); //订单实时数据
    /**交易数据请求*/
    // dispatch({type: 'deal/GetFloorStoreSale',payload: initDataForm})
    // dispatch({type: 'deal/GettypeStoreSale',payload: initDataForm})

    if(dealBtnInit === '1'){
      dispatch({type: 'deal/GetFloorStoreSale',payload: initDataForm})
    }else if(dealBtnInit === '2'){
      dispatch({type: 'deal/GettypeStoreSale',payload: initDataForm})
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.app.dealBtnInit !== nextProps.app.dealBtnInit){
      let initDataForm = { NowDate: moment().format("YYYY-MM-DD HH:mm:ss") }; //获取初始数据
      if(nextProps.app.dealBtnInit === '1'){
        this.props.dispatch({type: 'deal/GetFloorStoreSale',payload: initDataForm})
      }else {
        this.props.dispatch({type: 'deal/GettypeStoreSale',payload: initDataForm})
      }
    }
  }



  onChange = (e) => {
    const { dispatch, app } = this.props
    const currentKey = e.target.getAttribute("data-key");
    dispatch({
      type: 'app/siderChange',
      payload: {
        key: currentKey === app.dealsiderKey ? 999 : currentKey,
      },
    })
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(nextProps !== this.props){
  //     return true
  //   }
  //   return false
  // }



  componentWillUnmount() {
    // this.Time && clearInterval(this.Time)
    this.newTimer && this.newTimer.removeSchedule(this.Time);
  }

  render() {
    const { fetchDate } = this.state;
    const { deal, app, dispatch } = this.props;
    const { dealsiderKey, dealBtnInit, Biconfig } = app
    const { TransDataUpdateFrequency } = Biconfig
    const {
      typeSaleAnalysis,
      storesRank,
      FloorSaleAnalysis,
      TimeInterval,
      SalesTrend,
      storesliving,
      floorPoint,
      typePoint,
      updateIndex,
      typeSalesVal,
      floorSalesVal,
      currentOrder,
    } = deal;

    const livingProps = {storesliving, dispatch, updateIndex, typeSalesVal, floorSalesVal};
    const flightMapProps = {
      typePoint,
      typeSalesVal,
      storesliving,
      dispatch,
      dealBtnInit,
      updateIndex,
      TransDataUpdateFrequency,
      currentOrder,
      fetchDate
    };
    const floorMapProps = {
      floorPoint,
      floorSalesVal,
      storesliving,
      dispatch,
      dealBtnInit,
      updateIndex,
      TransDataUpdateFrequency,
      currentOrder,
      fetchDate
    };

    return (
      <Fragment>
        <div className={styles.container}>
          <div className={styles['menu-sider-right']}>
            <Sider onChange={this.onChange} activeKey={dealsiderKey}>
              <div data-tab="销售实时数据" key="1" data-init={1}><LiveTrading {...livingProps}/></div>
              <div data-tab="销售排行TOP10" key="2" data-init={0}><RankTrading {...storesRank}/></div>
              <div data-tab="业态销售分析" key="3" data-init={0}><TypeTrading {...typeSaleAnalysis}/></div>
              <div data-tab="楼层销售分析" key="4" data-init={0}><FloorTrading {...FloorSaleAnalysis}/></div>
              <div data-tab="销售时段分析" key="5" data-init={0}><TimesTrading {...TimeInterval}/></div>
              <div data-tab="销售趋势分析" key="6" data-init={0}><TrendTrading {...SalesTrend}/></div>
            </Sider>
          </div>
          {
            dealBtnInit === '1' ?
              <FloorMap
                hide={dealBtnInit !== '2'}
                {...floorMapProps}
              /> :
              <FlightMap
                hide={dealBtnInit !== '1'}
                {...flightMapProps}
              />
          }
          {/*<FloorMap hide={dealBtnInit !== '2'} {...floorMapProps}/>*/}
          {/*<FlightMap hide={dealBtnInit !== '1'} {...flightMapProps} />*/}

        </div>
      </Fragment>
    )
  }
}

Deal.propTypes = {
  deal: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Deal
