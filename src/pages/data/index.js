/**
 * title: 数据屏-中铁建BI决策分析系统
 */
import React, {PureComponent} from 'react'
import styles from './index.less'
import Svg from './components/svg' //svg组件
import Modal from './components/modal'
import { Row, Col, Button } from 'antd';
import { connect } from 'dva'
import moment from 'moment'
import { withRouter } from 'umi'
import MyIcon from '../../components/myicon'
import { Sales, Income, Passflow, Member, FloorAnalysis, TypeAnalysis} from "@/pages/data/components/chart";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "animate.css";

@withRouter
@connect(({ app, globalData, data }) => ({ app, globalData, data }))
class Data extends PureComponent {
  state = {
    visible: false,
  };
  componentDidMount(){
    const { location, dispatch, globalData, app } = this.props;
    const { query, pathname } = location;
    const { FloorID, StartDate, EndDate } = globalData;
    const { showType } = app;
    const Start = moment(StartDate).format('YYYY-MM');
    const End = moment(EndDate).format('YYYY-MM');
    const payloadTime = { StartDate: Start, EndDate: End };
    const payloadTimeAndFid = { StartDate: Start, EndDate: End, FloorID };

    dispatch({ type: 'data/getFloorInfoList'}).then((res) => {
      //楼层数据为空时，不请求
      if(res.length !== 0){
        dispatch({ type: 'globalData/getDegreeList', payload: { DegreeType: showType } })
      }
    });
    //初始化ajax
    dispatch({ type: 'globalData/getSales', payload: payloadTime })
    dispatch({ type: 'globalData/getSalesChart', payload: payloadTime })
    dispatch({ type: 'globalData/getIncome', payload: payloadTime })
    dispatch({ type: 'globalData/getIncomeChart', payload: payloadTime })
    dispatch({ type: 'globalData/getPassenger', payload: payloadTime })
    dispatch({ type: 'globalData/getMember', payload: payloadTime })
    dispatch({ type: 'globalData/getMemberChart', payload: payloadTime })
    dispatch({ type: 'globalData/getTypeIncomeInfo', payload: payloadTimeAndFid})
    dispatch({ type: 'globalData/getTypeSalesInfo', payload: payloadTimeAndFid})
    dispatch({ type: 'globalData/getFloorSale', payload: payloadTimeAndFid})
    dispatch({ type: 'globalData/getFloorTrend', payload: payloadTimeAndFid})
    if(showType === '1'){
      dispatch({ type: 'globalData/GetStoreSaleByFloorID', payload: payloadTimeAndFid})
    }else if(showType === '2'){
      dispatch({ type: 'globalData/GetStoreEarningByFloorID', payload: payloadTimeAndFid})
    }
  }

  showTrend = () => {//点击按钮请求默认数据
    const { globalData} = this.props;
    const { rangeDate, FloorID, StartDate, EndDate } = globalData;
    const Start = moment(StartDate).format('YYYY-MM');
    const End = moment(EndDate).format('YYYY-MM');
    this.modalFetch(Start, End, 5, FloorID)
    this.setState({ visible: true });
  }

  /**店铺排行数据*/
  modalFetch = (StartDate, EndDate, SearchNum = 5, FloorID) => {
    const { dispatch} = this.props;
    //项目
    dispatch({//项目排行 红榜
      type: 'data/projectRankYes',
      payload: {StartDate, EndDate, SearchType: 1, SearchNum}
    })
    dispatch({//项目排行 黑榜
      type: 'data/projectRankNO',
      payload: {StartDate, EndDate, SearchType: 2, SearchNum}
    })
    dispatch({//项目排行 黑榜
      type: 'data/projectStoreRankYes',
      payload: {StartDate, EndDate, SearchType: 1, SearchNum}
    })
    dispatch({//项目排行 黑榜
      type: 'data/projectIncomeRankYes',
      payload: {StartDate, EndDate, SearchType: 1, SearchNum}
    })
    //楼层
    dispatch({//楼层排行 红榜
      type: 'data/floorSalesStoreRankYes',
      payload: {StartDate, EndDate, SearchType: 1, FloorID, SearchNum}
    })
    dispatch({//楼层排行 黑榜
      type: 'data/floorSalesStoreRankNo',
      payload: {StartDate, EndDate, SearchType: 2, FloorID, SearchNum}
    })
    dispatch({//商铺销售坪效排行榜 红榜
      type: 'data/GetStoreSalePerAreaRankInFloor',
      payload: {StartDate, EndDate, SearchType: 1, FloorID, SearchNum}
    })
    dispatch({//商铺销售坪效排行榜 红榜
      type: 'data/GetStoreEarningRankInFloor',
      payload: {StartDate, EndDate, SearchType: 1, FloorID, SearchNum}
    })
    //业态

    //获取一级业态列表
    dispatch({type: 'data/GetStoreTypeList'}).then(res => {
      res.forEach(ele => {
        if(ele.OperationTypeName === '餐饮'){
          dispatch({
            type: 'data/GetStoreTypeFoodRank',
            payload: {StartDate, EndDate, SearchType: 1, OperationTypeID: ele.OperationTypeID, SearchNum}
          })
        }
        if(ele.OperationTypeName === '零售'){
          dispatch({
            type: 'data/GetStoreTypeRetailRank',
            payload: {StartDate, EndDate, SearchType: 1, OperationTypeID: ele.OperationTypeID, SearchNum}
          })
        }
        if(ele.OperationTypeName === '服务配套'){
          dispatch({
            type: 'data/GetStoreTypeFunRank',
            payload: {StartDate, EndDate, SearchType: 1, OperationTypeID: ele.OperationTypeID, SearchNum}
          })
        }
        if(ele.OperationTypeName === '主力店'){
          dispatch({
            type: 'data/GetStoreTypeMainRank',
            payload: {StartDate, EndDate, SearchType: 1, OperationTypeID: ele.OperationTypeID, SearchNum}
          })
        }
      })
    })
  }

  handleOk = (e) => {
    this.setState({ visible: false, });
  }
  handleCancel = (e) => {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    const { data, globalData } = this.props;
    const {
      FloorInfoList,
      projectRankYes,
      projectRankNO,
      projectStore,
      projectIncome,
      floorSalesRankYes,
      floorSalesRankNo,
      StoreSalePerAreaRankYes,
      StoreEarningRankYes,
      StoreTypeFood,
      StoreTypeRetail,
      StoreTypeFun,
      StoreTypeMain,
    } = data;

    const {
      FloorSale,
      FloorSaleChart,
      TypeIncomeInfo,
      TypeSalesInfo,
      salesData,
      salesChart,
      incomeData,
      incomeChart,
      PassengerData,
      memberData,
      MemberChart
    } = globalData;

    const RankModal = {
      projectRankYes,
      projectRankNO,
      projectStore,
      projectIncome,
      floorSalesRankYes,
      floorSalesRankNo,
      StoreSalePerAreaRankYes,
      StoreEarningRankYes,
      StoreTypeFood,
      StoreTypeRetail,
      StoreTypeFun,
      StoreTypeMain
    }
    const salesProps = {
      salesData,
      salesChart
    }
    const incomeProps = {
      incomeData,
      incomeChart
    }

    const memberProps = {
      memberData,
      MemberChart
    }
    const FloorAnalysisProps = {
      FloorSale,
      FloorSaleChart
    }

    const TypeAnalysisProps = {
      TypeIncomeInfo,
      TypeSalesInfo
    }


    return (
      <div className={styles.whole}>
        <div className={styles['flex-warp-cont']}>
          <Row gutter={24}>
            <Col span={7}><Sales {...salesProps}/></Col>
            <Col span={5}><Income {...incomeProps}/></Col>
            <Col span={5}><Passflow {...PassengerData}/></Col>
            <Col span={7}><Member {...memberProps}/></Col>
          </Row>
          <Row gutter={16}>
            <Col span={14}>
              <ReactCSSTransitionGroup
                transitionEnter={true}
                transitionLeave={true}
                transitionEnterTimeout={2500}
                transitionLeaveTimeout={1500}
                transitionName="animated"
              >
                <div key="amache" className={'animated bounceInLeft' + ' ' +styles.div1_main}>
                  <div className={styles.div1_chart}>
                    {
                      FloorInfoList.length !== 0 ? <div className={styles['btn-switch']}>
                        <div className={styles['btn-switch-in']}>
                          <MyIcon style={{ color: '#0FECF2' }} className={styles['btn-switch-angle1']} type="icon-guaijiao"/>
                          <MyIcon style={{ color: '#0FECF2' }} className={styles['btn-switch-angle2']} type="icon-guaijiao"/>
                          <MyIcon style={{ color: '#0FECF2' }} className={styles['btn-switch-angle3']} type="icon-guaijiao"/>
                          <MyIcon style={{ color: '#0FECF2' }} className={styles['btn-switch-angle4']} type="icon-guaijiao"/>
                          <Button type="primary" size='large' onClick={this.showTrend} >
                            <MyIcon style={{fontSize: 20}} type="icon-chart"/>
                          </Button>
                        </div>
                      </div> : null
                    }
                    <Modal
                      visible={visible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      width={1200}
                      {...RankModal}
                    />
                    <Svg />
                  </div>
                </div>
              </ReactCSSTransitionGroup>
            </Col>
            <Col span={10}>
              <div className={styles.div1_main}>
                <div className={styles.div1_chart}>
                  <FloorAnalysis {...FloorAnalysisProps}/>
                  <TypeAnalysis {...TypeAnalysisProps} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Data
