import {
  getSales,
  getSalesChart,
  getIncome,
  getIncomeChart,
  getPassenger,
  getMember,
  getMemberChart,
  getFloorInfoList,
  getTypeIncomeInfo,
  getTypeSalesInfo,
  getFloorSale,
  getFloorTrend,
  getDegreeList,
  GetStoreSaleByFloorID,
  GetStoreEarningByFloorID,
} from 'api';
import { pathMatchRegexp, _cycleDate } from 'utils';
import moment from 'moment';
import _ from 'lodash'

export default {
  namespace: 'globalData',
  state: {
    rangeDate: [moment(), moment()],
    StartDate: _cycleDate(),
    EndDate: _cycleDate(),
    FloorID: '4fae338e-102e-457c-897c-a0b1d6b79aa3',
    FloorName: '',
    showType: '1',
    salesData: {
      TotalSaleAmt: 0,//总销售额
      SequentialValue: 0,//环比
      PerCustomerPrice: 0,//客单价
      OrderCount: 0 //订单量
    },
    salesChart: {
      XAxisData: [],
      SeriesData: []
    },
    incomeData: {
      PaidPercent: 0,//收缴率(已收/应收)
      SequentialValue: 0,//环比
      TotalNetAmt: 0,//总应收金
      UnChargeAmt: 0 //欠费金额
    },
    incomeChart: [],
    PassengerData: {
      TotalPassengerFlowCount: 0,
      SequentialValue: 0,
      PaidPercent: 0,
      CarInCount: 0
    },
    memberData: {
      TotalCustomerCount: 0,
      SequentialValue: '',
      CustPercentAmt: 0,
      CustConsumeAmt: 0
    },
    MemberChart: {
      SeriesData: [],
      XAxisData: []
    },
    TypeIncomeInfo: [],
    TypeSalesInfo: [],
    FloorSale: {
      FloorName: '',
      SortIndex: 0,
      SalePercentEveryArea: 0,
      EarnPercentEveryArea: 0,
      MainOperationTypeStoreName: '',
      OperationTypeName: ''
    },
    FloorSaleChart: {
      XAxisData: [],
      SeriesData: {
        PassengerFlow: [],
        vip: [],
        noVip: []
      }
    },
    DegreeList: [],
    GetStoreSale: [],
    GetStoreEarning: [],

  },
  subscriptions: {
    setup({ dispatch, history }) {
      //async
      history.listen(location => {
        if (pathMatchRegexp('/data', location.pathname)) {

          // const StartDate = moment().format('YYYY-MM')
          // const EndDate = moment().format('YYYY-MM')
          // const payload = location.query.StartDate ? location.query : { StartDate, EndDate }
          // dispatch({ type: 'getSalesChart', payload })
          // dispatch({ type: 'getIncome', payload })
          // dispatch({ type: 'getIncomeChart', payload })
          // dispatch({ type: 'getPassenger', payload })
          // dispatch({ type: 'getMember', payload })
          // dispatch({ type: 'getMemberChart', payload })
          // dispatch({ type: 'getFloorInfoList', payload })
        }
      })
    },
  },
  effects: {
    *getSales({ payload = {} }, { call, put }) {
      const response = yield call(getSales, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({ type: 'querySuccess', payload: { Data }, })
      } else {
        throw response
      }
    },
    *getSalesChart({ payload = {} }, { call, put }) {
      const response = yield call(getSalesChart, payload);
      const { success, Msg, Data, statusCode } = response;
      let XAxisData = [];
      let SeriesData = [];
      if(success && Data){
        Data.forEach((_) => {
          XAxisData.push(moment(_.DateValue).format("YYYY.MM.DD"))
          SeriesData.push(_.TotalSaleAmt)
        });
        yield put({
          type: 'salesChartSucc',
          payload: { Data: { XAxisData, SeriesData }}
        })
      } else {
        throw response
      }
    },
    *getIncome({ payload = {} }, { call, put }) {
      const response = yield call(getIncome, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){yield put({ type: 'IncomeSucc', payload: {Data}, })} else {
        throw response
      }
    },
    *getIncomeChart({ payload = {} }, { call, put }) {
      const response = yield call(getIncomeChart, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        const res = Data.map((_) => {
          return {name: _.ChargeType, value: _.TotalSaleAmt}
        });
        yield put({ type: 'IncomeChartSucc', payload: { Data: res }, })
      } else {
        throw response
      }
    },
    *getPassenger({ payload = {} }, { call, put }) {
      const response = yield call(getPassenger, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({ type: 'PassengerSucc', payload: { Data }})
      } else {
        throw response
      }
    },
    *getMember({ payload = {} }, { call, put }) {
      const response = yield call(getMember, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({ type: 'MemberSucc', payload: { Data }, })
      } else {
        throw response
      }
    },
    *getMemberChart({ payload = {} }, { call, put }) {
      const response = yield call(getMemberChart, payload);
      const { success, Msg, Data, statusCode } = response;
      let XAxisData = [],
        SeriesData = [];
      if(success && Data){
        Data.forEach((_) => {
          XAxisData.push(moment(_.DateValue).format("YYYY.MM.DD"))
          SeriesData.push(_.TotalCustCount)
        });
        yield put({
          type: 'MemberChartSucc',
          payload: { Data: { XAxisData, SeriesData }},
        })
      } else {
        throw response
      }
    },
    *getTypeIncomeInfo({ payload = {} }, { call, put }) {
      const response = yield call(getTypeIncomeInfo, payload);
      const { success, Msg, Data, statusCode } = response;
      let TypeIncomeInfo = [];
      if(success && Data){
        Data.forEach((_) => {
          TypeIncomeInfo.push({
            name: _.OperationTypeName,
            value: _.NetChargeAmount,
          })
        });
        yield put({ type: 'TypeIncomeSucc', payload: {Data: TypeIncomeInfo}})
      } else {
        throw response
      }
    },
    *getTypeSalesInfo({ payload = {} }, { call, put }) {
      const response = yield call(getTypeSalesInfo, payload);
      const { success, Msg, Data, statusCode } = response;
      let TypeSalesInfo = [];
      if(success && Data){
        Data.forEach((_) => {
          TypeSalesInfo.push({
            name: _.OperationTypeName,
            value: _.SaleAmt,
          })
        });
        yield put({ type: 'TypeSalesSucc', payload: {Data: TypeSalesInfo}})
      } else {
        throw response
      }
    },
    *getFloorSale({ payload = {} }, { call, put }) {
      const response = yield call(getFloorSale, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({ type: 'FloorSaleSucc', payload: {Data}})
      } else {
        throw response
      }
    },
    *getFloorTrend({ payload = {} }, { call, put }) {
      const response = yield call(getFloorTrend, payload);
      const { success, Data } = response;
      let XAxisData = [],
        PassengerFlow = [],
        vip = [],
        noVip = [];
      if(success && Data){
        Data.forEach((_) => {
          XAxisData.push(moment(_.YearMonthValue).format('YYYY.MM.DD'))
          PassengerFlow.push(_.PassengerFlowNum)
          vip.push(_.CustSaleAmt)
          noVip.push(_.NonCustSaleAmt)
        });
        yield put({
          type: 'FloorTrendSucc',
          payload: {
            Data: { XAxisData, SeriesData: {PassengerFlow, vip, noVip} }
          },
        })
      } else {
        throw response
      }
    },
    *getDegreeList({ payload = {} }, { call, put }) {
      const response = yield call(getDegreeList, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        // const newData = Object.assign([], Data)
        // const newResult = _.orderBy(newData, 'DegreeID', 'asc');
        yield put({
          type: 'DegreeListSucc',
          payload: {Data: Data},
        })
      } else {
        throw response
      }
    },
    *GetStoreSaleByFloorID({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreSaleByFloorID, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({
          type: 'GetStoreSaleSucc',
          payload: {Data},
        })
      } else {
        throw response
      }
    },
    *GetStoreEarningByFloorID({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreEarningByFloorID, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({
          type: 'GetStoreSaleSucc',
          payload: {Data},
        })
      } else {
        throw response
      }
    },


  },
  reducers: {
    floorChangeSucc(state, {payload}) {
      const { FloorID } = payload
      return {...state, ...payload, FloorID}
    },
    TypeChangeSucc(state, {payload}){
      const { showType } = payload
      return {...state, showType}
    },
    querySuccess(state, { payload }) {
      const { Data } = payload
      return {
        ...state, salesData: Data,
      }
    },
    salesChartSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, salesChart: Data,
      }
    },
    IncomeSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, incomeData: Data,
      }
    },
    IncomeChartSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, incomeChart: Data,
      }
    },
    PassengerSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, PassengerData: Data,
      }
    },
    MemberSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, memberData: Data,
      }
    },
    MemberChartSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, MemberChart: Data,
      }
    },
    TypeIncomeSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, TypeIncomeInfo: Data,
      }
    },
    TypeSalesSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, TypeSalesInfo: Data,
      }
    },
    FloorSaleSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, FloorSale: Data,
      }
    },
    FloorTrendSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, FloorSaleChart: Data,
      }
    },
    datePickerChange(state, { payload }) {
      const { value } = payload
      return {
        ...state, rangeDate: value,
      }
    },
    DegreeListSucc(state, { payload }) {
      const { Data } = payload

      return {
        ...state, DegreeList: Data,
      }
    },
    GetStoreSaleSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, GetStoreSale: Data,
      }
    },
    GetStoreEarningSucc(state, { payload }) {
      const { Data } = payload

      return {
        ...state, GetStoreEarning: Data,
      }
    },
    _updateMonthStart(state, { payload }) {
      const { StartDate } = payload
      return { ...state, StartDate }
    },
    _updateMonthEnd(state, { payload }) {
      const { EndDate } = payload
      return { ...state, EndDate }
    },
  },
}
