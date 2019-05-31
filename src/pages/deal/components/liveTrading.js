import React, { PureComponent, Component } from 'react'
import style from './liveTrading.less';
import { Ellipsis } from "ant-design-pro";
import { Spin, Empty } from "antd";
import styled, { keyframes } from 'styled-components'
import * as utils from './raf'
import _ from 'lodash';
import produce from "immer";
import EmptyIma from 'assets/Empty.svg';
import { Timer } from 'utils/Timer'
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'dva/index';
//补丁可以较好的兼容支持该特性的浏览器
utils.raf();
const EmptyWarp = styled.div`
  padding: 24px 0
`;

@immutableRenderDecorator
@connect(({ deal }) => ({ deal }))
class Trading extends Component {
  domMw = React.createRef();
  domMi = React.createRef();
  timerMarquee = null;
  newTimer = null;
  Time = null;
  state = {
    listData: [],
  }

  /**
   * _verticalMarquee = () => {
    this.domMw.scrollTop === this.domMi.offsetHeight  ? (this.domMw.scrollTop -= this.domMi.offsetHeight) :  this.domMw.scrollTop++;
    // console.warn("this.domMw.scrollTop", test)
    this.timerMarquee = requestAnimationFrame(this._verticalMarquee);
  };
   * */

  //竖向滚动
  _verticalMarquee = () => {
    this.domMw.current.scrollTop === this.domMi.current.offsetHeight  ? (this.domMw.current.scrollTop -= this.domMi.current.offsetHeight) :  this.domMw.current.scrollTop++;
    // console.warn("this.domMw.scrollTop", test)
    this.timerMarquee = requestAnimationFrame(this._verticalMarquee);
  };

  //暂停
  stopMarquee = () => {
    this.timerMarquee && cancelAnimationFrame(this.timerMarquee)
  }

  componentDidMount() {
    this.domMw.current && this.domMi.current && this._verticalMarquee();
  }

  autoPlay = (lastProps, nextProps) => {
    const Len = nextProps.storesliving.length;
    // console.warn("be.updateIndex", be.updateIndex)
    // console.warn("最新序号：", nextProps.deal.updateIndex)
    // console.error("Len", Len)
    if(this.props.updateIndex >= Len){
      this.props.dispatch({type: 'deal/_updateIndexHandle', payload: { updateIndex: 0}});
      this.newTimer && this.newTimer.removeSchedule(this.Time);
      return
    }
    const currentOrder = nextProps.storesliving[this.props.updateIndex]; //当前订单信息
    // let initFloorSalesVal = [];
    // let initTypeSalesVal = [];

    if(currentOrder){
      // const { FloorId, TotalSaleAmt, StoreName, OperationTypeId } = currentOrder;
      this.setState((preState) => this._AddItemList(preState, currentOrder),
        () => {
          const newIndex = Object.assign({}, lastProps.deal)
          newIndex.updateIndex += 1;
          lastProps.dispatch({type: 'deal/_updateIndexHandle', payload: { updateIndex: newIndex.updateIndex}});
          lastProps.dispatch({type: 'deal/updateFatherVal', payload: { Data: currentOrder}});

          if(this.state.listData.length > 6){
            this.domMw.current.scrollTop = 0;
            this.setState(produce(draft => {
              draft.listData.shift()
              return draft;
            }))
          }
        })
    }



    // _.forEach(be.floorSalesVal, (e, i) => {
    //   if(e.FloorId === FloorId){
    //     e.TotalSaleAmt = Number((e.TotalSaleAmt + TotalSaleAmt).toFixed(2));
    //     // console.log("新的e", e)
    //     initFloorSalesVal.push(e)
    //   }else {
    //     // console.log("新的就", e)
    //     initFloorSalesVal.push(e)
    //   }
    // })
    // _.forEach(be.typeSalesVal, (e, i) => {
    //   if(e.OperationID === OperationTypeId){
    //     e.TotalSaleAmt = Number((e.TotalSaleAmt + TotalSaleAmt).toFixed(2));
    //     initTypeSalesVal.push(e)
    //   }else {
    //     initTypeSalesVal.push(e)
    //   }
    // })
    // console.log("initFloorSalesVal", initFloorSalesVal)
    // console.log("initTypeSalesVal", initTypeSalesVal)

    // af.dispatch({
    //   type: 'deal/_addFloorSalesVal',
    //   payload: {
    //     floorSalesVal: initFloorSalesVal,
    //     typeSalesVal: initTypeSalesVal,
    //   }});

    // lastProps.dispatch({ type: 'deal/_setCurrentOrder', payload: {currentOrder} });//当前订单



  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.listData !== nextState.listData){
      return true;
    }
    return false;
  }

  _AddItemList = (state, item) => {
    return produce(state, draft => {
      draft.listData.push(item)
    });
  };

  componentWillReceiveProps(nextProps) {
    // console.log("获取序号=====this.props", this.props)
    // console.log("获取序号=====nextProps", nextProps)
    // const { dispatch } = nextProps
    if(this.props.storesliving !== nextProps.storesliving){
      // const Len = nextProps.storesliving.length;//最新的长度
      this.newTimer = new Timer();
      this.Time = this.newTimer.interval(3000, () => {
        // console.warn("获取序号=====nextProps", this.props.updateIndex)
        this.autoPlay(this.props, nextProps);
        // if(this.props.updateIndex > Len){
        //   // dispatch({type: 'deal/_updateIndexHandle', payload: { updateIndex: 0}});
        //   // dispatch({ type: 'deal/_setCurrentOrder', payload: {currentOrder: {}} });//当前订单
        //
        // }
      })
    }
  }

  componentWillUnmount() {
    this.stopMarquee();
    // disconnect()
    this.newTimer && this.newTimer.removeSchedule(this.Time);
  }

  render() {
    const { listData } = this.state;
    // console.warn("我渲染了:", listData)

    return (
      <div className={style.liveTrading} ref={this.domMw}>
        <div
          className={style['liveTrading-scroll']}
          ref={this.domMi}
        >
          {
            listData.length === 0 ? <EmptyWarp>
                <Empty
                  image={EmptyIma}
                  imageStyle={{height: 120,}}
                  description={<span style={{color: '#2880B4', fontSize: 16}}
                  >暂无相关数据</span>} />
              </EmptyWarp> :
              listData.map((_, index) => (
                  <div
                    key={index}
                    className={style.live_list}
                  >
                    <div className={style.store_img}><img src={""} alt=""/></div>
                    <div className={style.store_text_label_name}><Ellipsis tooltip lines={1}>{_.StoreName}</Ellipsis></div>
                    <div className={style.store_text_label_sale}>{`${_.TotalSaleAmt}元`}</div>
                    <div className={style.store_text_label}>{_.BillTime}</div>
                  </div>
              ))
          }
        </div>
      </div>
    )
  }
}

export default Trading
