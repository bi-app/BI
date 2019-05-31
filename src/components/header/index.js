import styles from "./index.less";
import Link from 'umi/link';
// import router1 from 'umi/router';
import { withRouter } from 'umi'
import { router } from 'utils'
import React, {PureComponent} from "react";
import { connect } from 'dva'
import FlipClock from "./components/flipclock"
import moment from 'moment'
import {Radio, Button, DatePicker,} from 'antd'
import MyIcon from '../myicon'
import _ from 'lodash'
const { MonthPicker, RangePicker } = DatePicker;



@withRouter
@connect(({ app, globalData, loading }) => ({ app, globalData, loading }))
class Header extends PureComponent {
  state = {
    mode: ['month', 'month'],
    StartDate: null,
    EndDate: null,
    endOpen: false,
    startOpen: false,
  }

  onChange = (e) => {
    const dealBtnInit = e.target.value;
    const { dispatch } = this.props;
    dispatch({type: 'app/_dealBtnTypeChange', payload: {dealBtnInit}})

  }

  handlePanelChange = (value, mode) => {
    this.setState({
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    });
    const { dispatch, globalData } = this.props
    const { FloorID } = globalData
    const StartDate = moment(value[0]).format('YYYY-MM');
    const EndDate = moment(value[1]).format('YYYY-MM');
    const payload = { StartDate, EndDate }
    const payload1 = { StartDate, EndDate, FloorID }
    dispatch({type: 'globalData/datePickerChange', payload: {value}})
    dispatch({ type: 'globalData/getSales', payload })
    dispatch({ type: 'globalData/getSalesChart', payload })
    dispatch({ type: 'globalData/getIncome', payload })
    dispatch({ type: 'globalData/getIncomeChart', payload })
    dispatch({ type: 'globalData/getPassenger', payload })
    dispatch({ type: 'globalData/getMember', payload })
    dispatch({ type: 'globalData/getMemberChart', payload })
    dispatch({type: 'globalData/getTypeIncomeInfo', payload: payload1})
    dispatch({type: 'globalData/getTypeSalesInfo', payload: payload1})
    dispatch({type: 'globalData/getFloorSale', payload: payload1})
    dispatch({type: 'globalData/getFloorTrend', payload: payload1})

  }


  handleChange = (value) => {
    const { dispatch, globalData } = this.props
    const { FloorID, showType } = globalData
    const StartDate = moment(value[0]).format('YYYY-MM');
    const EndDate = moment(value[1]).format('YYYY-MM');

    const payload = { StartDate, EndDate }
    dispatch({
      type: 'globalData/datePickerChange',
      payload: {
        value
      }
    })
    dispatch({ type: 'globalData/getSales', payload })
    dispatch({ type: 'globalData/getSalesChart', payload })
    dispatch({ type: 'globalData/getIncome', payload })
    dispatch({ type: 'globalData/getIncomeChart', payload })
    dispatch({ type: 'globalData/getPassenger', payload })
    dispatch({ type: 'globalData/getMember', payload })
    dispatch({ type: 'globalData/getMemberChart', payload })
    dispatch({
      type: 'globalData/getTypeIncomeInfo',
      payload: {
        StartDate, EndDate, FloorID
      }
    })
    dispatch({
      type: 'globalData/getTypeSalesInfo',
      payload: {
        StartDate, EndDate, FloorID
      }
    })
    dispatch({
      type: 'globalData/getFloorSale',
      payload: {
        StartDate, EndDate, FloorID
      }
    })
    dispatch({
      type: 'globalData/getFloorTrend',
      payload: {
        StartDate, EndDate, FloorID
      }
    })

    if(showType === '1'){
      dispatch({
        type: 'globalData/GetStoreSaleByFloorID',
        payload: {StartDate, EndDate, FloorID}
      })
    }else if(showType === '2'){
      dispatch({
        type: 'globalData/GetStoreEarningByFloorID',
        payload: {StartDate, EndDate, FloorID}
      })
    }

  }

  /**
   * 首次点击时执行，连续点击且时间间隔在5s之内，不再执行，间隔在5s之外再次点击，执行。
   * */
  _switchLink = _.debounce(() => {
    router.push(this.props.to);
  }, 1000, {
    leading: true,
    trailing: false,
  })


  disabledStartDate = StartDate => {
    const { globalData, app } = this.props;
    const { EndDate,  } = globalData;
    const { Biconfig  } = app;
    const { MaxDataIntervalMonth  } = Biconfig;
    if (!StartDate || !EndDate) {
      return false;
    }
    return StartDate.valueOf() > EndDate.valueOf() || StartDate.valueOf() <= moment(EndDate).subtract(Number(MaxDataIntervalMonth),'months').valueOf();
  };

  disabledEndDate = EndDate => {
    const { globalData, app } = this.props;
    const { StartDate } = globalData;
    const { Biconfig  } = app;
    const { MaxDataIntervalMonth  } = Biconfig;
    if (!EndDate || !StartDate) {
      return false;
    }
    return EndDate.valueOf() < StartDate.valueOf() || EndDate.valueOf() > moment().valueOf();
  };


  onStartChange = value => {
    const { dispatch, globalData } = this.props;
    const { EndDate, FloorID, showType } = globalData;
    dispatch({
      type: 'globalData/_updateMonthStart',
      payload: {StartDate: value}
    })
    this._getDataByRangeTimes(value, EndDate, FloorID, showType)
  };

  onEndChange = value => {
    const { dispatch, globalData, app } = this.props;
    const { StartDate, FloorID } = globalData;
    const { showType } = app;
    dispatch({
      type: 'globalData/_updateMonthEnd',
      payload: {EndDate: value}
    });
    this._getDataByRangeTimes(StartDate, value, FloorID, showType)
  };

  handleStartOpenChange = open => {
    this.setState({ startOpen: open });
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  _getDataByRangeTimes = (startDate, endDate, FloorID, showType) => {
    const { dispatch, globalData } = this.props;
    const Start = moment(startDate).format('YYYY-MM');
    const End = moment(endDate).format('YYYY-MM');
    const payload = { StartDate: Start, EndDate: End }
    const payloadOther = { StartDate: Start, EndDate: End, FloorID }

    dispatch({ type: 'globalData/getSales', payload })
    dispatch({ type: 'globalData/getSalesChart', payload })
    dispatch({ type: 'globalData/getIncome', payload })
    dispatch({ type: 'globalData/getIncomeChart', payload })
    dispatch({ type: 'globalData/getPassenger', payload })
    dispatch({ type: 'globalData/getMember', payload })
    dispatch({ type: 'globalData/getMemberChart', payload })
    dispatch({type: 'globalData/getTypeIncomeInfo', payload: payloadOther})
    dispatch({type: 'globalData/getTypeSalesInfo', payload: payloadOther})
    dispatch({type: 'globalData/getFloorSale', payload: payloadOther})
    dispatch({type: 'globalData/getFloorTrend', payload: payloadOther})
    if(showType === '1'){
      dispatch({type: 'globalData/GetStoreSaleByFloorID', payload: payloadOther})
    }else if(showType === '2'){
      dispatch({type: 'globalData/GetStoreEarningByFloorID', payload: payloadOther})
    }
  }

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  _setRangeTimeByFoot = (e) => {
    const { dispatch, globalData, app } = this.props;
    const { FloorID } = globalData;
    const { showType } = app;
    const currentKey = e.target.getAttribute("data-key");

    this.setState({endOpen: false, startOpen: false});//关闭时间选择面板

    switch (currentKey){
      case '1':
        const StartDate = moment().startOf('month');
        const EndDate = moment().endOf('month');
        dispatch({type: 'globalData/_updateMonthStart', payload: {StartDate}})
        dispatch({type: 'globalData/_updateMonthEnd', payload: {EndDate}});
        this._getDataByRangeTimes(StartDate, EndDate, FloorID, showType)

        break;
      case '2':
        const Start = moment().subtract(1, 'month').startOf('month');
        const End = moment().subtract(1, 'month').endOf('month');
        dispatch({type: 'globalData/_updateMonthStart', payload: {StartDate: Start}})
        dispatch({type: 'globalData/_updateMonthEnd', payload: {EndDate: End}});
        this._getDataByRangeTimes(Start, End, FloorID, showType)
        break;
      case '3':
        const todayStart = moment().startOf('year').startOf('month');
        const todayEnd = moment();
        dispatch({type: 'globalData/_updateMonthStart', payload: {StartDate: todayStart}})
        dispatch({type: 'globalData/_updateMonthEnd', payload: {EndDate: todayEnd}});
        this._getDataByRangeTimes(todayStart, todayEnd, FloorID, showType)
        break;
      case '4':
        const lastYearStart = moment().subtract(1, 'year').startOf('year');
        const lastYearEnd = moment().subtract(1, 'year').endOf('year');
        dispatch({type: 'globalData/_updateMonthStart', payload: {StartDate: lastYearStart}})
        dispatch({type: 'globalData/_updateMonthEnd', payload: {EndDate: lastYearEnd}});
        this._getDataByRangeTimes(lastYearStart, lastYearEnd, FloorID, showType)
        break;
    }

  }

  render() {
    const { to, app, globalData } = this.props;
    const { mode } = this.state;
    const { StartDate, EndDate, } = globalData;
    const { endOpen, startOpen } = this.state;
    const { dealBtnInit, Biconfig } = app;
    const { MaxDataIntervalMonth } = Biconfig;
    //快捷时间选择
    const rangesRender = (MonthNum) => {
          const Num = Number(MonthNum);
          if(Num === 1){
            return {
              '本月': [moment().startOf('month'), moment().endOf('month')],
              '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
          }else if(Num >= 12){
            return {
              '本月': [moment().startOf('month'), moment().endOf('month')],
              '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
              '今年': [moment().startOf('year').startOf('month'), moment()],
              '去年': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
            }
          }

    };

    const rangesFootRender = (MonthNum) => {
      const Num = Number(MonthNum);
      if(Num === 1){
        return <div className={styles['range-foot-btn']} onClick={this._setRangeTimeByFoot}>
          <Button type="link" ghost data-key="1">本月</Button>
          <Button type="link" ghost data-key="2">上月</Button>
        </div>
      }else if(Num >= 12){
        return <div className={styles['range-foot-btn']} onClick={this._setRangeTimeByFoot}>
          <Button type="link" ghost data-key="1" >本月</Button>
          <Button type="link" ghost data-key="2" >上月</Button>
          <Button type="link" ghost data-key="3" >今年</Button>
          <Button type="link" ghost data-key="4" >去年</Button>
        </div>
      }

    };


    return (
      <div className={styles['tool-bar']}>
        <div className={styles['tool-bar-flex']}>
          <div className={styles['bar-flex-left']}>
            {
              to === '/deal' ?
                <div className={styles.range_picker_div}>
                  <MyIcon className={styles['btn-switch-angle1']} style={{ color: '#0FECF2' }} type="icon-guaijiao"/>
                  <MyIcon className={styles['btn-switch-angle2']} style={{ color: '#0FECF2' }} type="icon-guaijiao"/>
                  <MyIcon className={styles['btn-switch-angle3']} style={{ color: '#0FECF2' }} type="icon-guaijiao"/>
                  <MyIcon className={styles['btn-switch-angle4']} style={{ color: '#0FECF2' }} type="icon-guaijiao"/>
                  <div className={styles.range_picker_warp}>
                    <MonthPicker
                      disabledDate={this.disabledStartDate}
                      format="YYYY-MM"
                      value={StartDate}
                      placeholder="开始月份"
                      size='large'
                      onChange={this.onStartChange}
                      open={startOpen}
                      onOpenChange={this.handleStartOpenChange}
                      allowClear={false}
                      renderExtraFooter={() => rangesFootRender(MaxDataIntervalMonth) }
                    />
                    <span className={styles.separator}>~</span>
                    <MonthPicker
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM"
                      value={EndDate}
                      placeholder="截止月份"
                      size='large'
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                      allowClear={false}
                      renderExtraFooter={() => rangesFootRender(MaxDataIntervalMonth)}
                    />
                  </div>
                    {/*<RangePicker*/}
                      {/*ranges={rangesRender(MaxDataIntervalMonth)}*/}
                      {/*placeholder={['开始日期', '截止日期']}*/}
                      {/*format="YYYY-MM"*/}
                      {/*allowClear={false}*/}
                      {/*value={rangeDate}*/}
                      {/*mode={mode}*/}
                      {/*size="large"*/}
                      {/*onChange={this.handleChange}*/}
                      {/*onPanelChange={this.handlePanelChange}*/}
                      {/*className={styles.range_picker}*/}
                      {/*dropdownClassName={styles.range_extra_picker}*/}
                    {/*/>*/}
                </div>
                :
                null
            }
            {
              to === '/data' ?
                <Radio.Group
                  value={dealBtnInit}
                  buttonStyle="solid"
                  size="large"
                  style={{marginLeft: 60}}
                  onChange={this.onChange}
                >
                  <Radio.Button value="1">楼层</Radio.Button>
                  <Radio.Button value="2">业态</Radio.Button>
                </Radio.Group>
                :
                null
            }
          </div>
          <div>
            <h3 className={styles['title-text']}>
              <span className={styles['title-text-label']}>{to === '/deal' ? '数据屏' : '交易屏'}</span>
            </h3>
          </div>
          <div className={styles['bar-flex-right']}>
            <div className={styles['btn-switch']}>
              <MyIcon className={styles['btn-switch-angle1']} type="icon-guaijiao"/>
              <MyIcon className={styles['btn-switch-angle2']} type="icon-guaijiao"/>
              <MyIcon className={styles['btn-switch-angle3']} type="icon-guaijiao"/>
              <MyIcon className={styles['btn-switch-angle4']} type="icon-guaijiao"/>
              {/* <Button type="primary" icon="swap" size='large' href={this.props.to}>{`切换至${to === '/deal' ? '交易屏' : '数据屏'}`}</Button> */}
              <Button type="primary" icon="swap" size='large' onClick={this._switchLink}>
                {`切换至${to === '/deal' ? '交易屏' : '数据屏'}`}
              </Button>
            </div>
            <div className={styles['live-time']}>
              <div className={styles['live-time-format']}>{moment().format("YYYY-MM-DD")}</div>
              <FlipClock/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
