import {
  GetStoreInfo,
  GetStoreCircle,
  getFloorInfoList,
  GetStoreSaleRankInMall,
  GetStoreSalePerAreaRankInMall,
  GetStoreEarningRankInMall,
  GetStoreSaleRankInFloor,
  GetStoreSalePerAreaRankInFloor,
  GetStoreEarningRankInFloor,
  GetStoreTypeList,
  GetStoreTypeRank,
  GetStoreSale,
  GetStoreSequential,

} from 'api'
import { pathMatchRegexp, router, getSession } from 'utils'
import moment from 'moment'


export default {
  namespace: 'data',
  state: {
    FloorInfoList: [],//楼层信息
    GetStoreInfo: {//查询店铺信息返回结果
      StoreName: '',
      OperationName: '',
      SaleRank: 0,
      EarningRank: 0,
      OpenDate: '',
      StoreArea: '',
      RentCollectMethod: '',
      RentEarning: 0,
      StoreCode: '',
      FloorName: '',
      DoorNumber: '',
      UnChargeAmt: 0,
    },
    StoreCompare: {//店铺数据比较
      SaleAmt: 0,
      SaleSequentialValue: 0,
      EarningAmt: 0,
      EarningSequentialValue: 0,
      CustomerPerOrder: 0,
      SaleAmtPerArea: 0,
      SaleAmtPerAreaSequentialValue: 0,
      RentEarningPerArea: 0,
      EarningPerAreaSequentialValue: 0,
      CustomerSaleAmtPercent: 0,
      CustomerSaleAmtSequentialValue: 0,
    },
    projectRankYes: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    projectRankNO: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    projectStore: {
      YAxis: [],
      store: []
    },
    projectIncome: {
      YAxis: [],
      store: []
    },
    floorSalesRankYes: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    floorSalesRankNo: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    StoreSalePerAreaRankYes: {
      YAxis: [],
      store: []
    },
    StoreEarningRankYes: {
      YAxis: [],
      store: []
    },
    StoreTypeFood: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    StoreTypeRetail: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    StoreTypeFun: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    StoreTypeMain: {
      YAxis: [],
      Customer: [],
      NoCustomer: []
    },
    StoreSale: {
      SaleYearMonth: [],
      OperationTypeSaleAvg: [],
      MallSaleAvg: [],
      CustomerSaleAvg: [],
      NonCustomerSaleAvg: []
    },
    StoreSequential: {
      SaleYearMonth: [],
      OperationTypeEarningAvg: [],
      MallEarningAvg: [],
      StoreEarning: []
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      //async
      history.listen(location => {

      })
    },
  },
  effects: {
    *getFloorInfoList({ payload = {} }, { call, put }) {
      const response = yield call(getFloorInfoList);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({
          type: 'FloorInfoListSucc',
          payload: {Data},
        })
      } else {
        throw response
      }
      return Data
    },
    *GetStoreInfo({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreInfo, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({
          type: 'GetStoreInfoSucc',
          payload: {Data},
        })
      } else {
        throw response
      }
    },
    *GetStoreCompareInfo({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreCircle, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        yield put({
          type: 'StoreCompareSucc',
          payload: {Data},
        })
      } else {
        throw response
      }
    },
    *GetStoreSale({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreSale, payload);
      const { success, Msg, Data, statusCode } = response;
      let SaleYearMonth = [],
        OperationTypeSaleAvg = [],
        MallSaleAvg = [],
        CustomerSaleAvg = [],
        NonCustomerSaleAvg = [];

      if(success && Data){
        Data.forEach((_) => {
          SaleYearMonth.push(moment(_.SaleYearMonth).format('YYYY.MM.DD'))
          OperationTypeSaleAvg.push(_.OperationTypeSaleAvg)
          MallSaleAvg.push(_.MallSaleAvg)
          CustomerSaleAvg.push(_.CustomerSaleAvg)
          NonCustomerSaleAvg.push(_.NonCustomerSaleAvg)
        })
        yield put({
          type: 'StoreSaleSucc',
          payload: {Data: {SaleYearMonth, OperationTypeSaleAvg, MallSaleAvg, CustomerSaleAvg, NonCustomerSaleAvg}},
        })
      } else {
        throw response
      }
    },
    *GetStoreSequential({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreSequential, payload);
      const { success, Msg, Data, statusCode } = response;
      let SaleYearMonth = [],
        OperationTypeEarningAvg = [],
        MallEarningAvg = [],
        StoreEarning = [];

      if(success && Data){
        Data.forEach((_) => {
          SaleYearMonth.push(_.SaleYearMonth)
          OperationTypeEarningAvg.push(_.OperationTypeEarningAvg)
          MallEarningAvg.push(_.MallEarningAvg)
          StoreEarning.push(_.StoreEarning)
        })
        yield put({
          type: 'StoreSequentialSucc',
          payload: {Data: {SaleYearMonth, OperationTypeEarningAvg, MallEarningAvg, StoreEarning}},
        })
      } else {
        throw response
      }
    },

    *projectRankYes({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreSaleRankInMall, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
          Customer = [],
          NoCustomer = [];

      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'projectRankYesSucc',
          payload: {
            Data: {YAxis, Customer, NoCustomer}
          },
        })
      } else {
        throw response
      }
    },
    *projectRankNO({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreSaleRankInMall, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];

      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'projectRankNOSucc',
          payload: {
            Data: {YAxis, Customer, NoCustomer}
          },
        })
      } else {
        throw response
      }
    },
    *projectStoreRankYes({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreSalePerAreaRankInMall, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        store = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          store.push(_.SalePerAreaAmt)
        });
        yield put({
          type: 'projectStoreSucc',
          payload: {Data: {YAxis, store}},
        })
      } else {
        throw response
      }
    },
    *projectIncomeRankYes({ payload = {} }, { call, put }) {
      const response = yield call(GetStoreEarningRankInMall, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
          store = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          store.push(_.EarningAmt)
        });
        yield put({
          type: 'projectIncomeSucc',
          payload: {Data: {YAxis, store}},
        })
      } else {
        throw response
      }
    },
    //写道这里了
    *floorSalesStoreRankYes({ payload = {} }, { call, put }) {//楼层销售排行红榜趋势
      const response = yield call(GetStoreSaleRankInFloor, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'floorSalesStoreRankYesSucc',
          payload: {Data: {YAxis, Customer, NoCustomer}},
        })
      } else {
        throw response
      }
    },
    *floorSalesStoreRankNo({ payload = {} }, { call, put }) {//楼层销售排行黑榜趋势
      const response = yield call(GetStoreSaleRankInFloor, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'floorSalesStoreRankNoSucc',
          payload: {Data: {YAxis, Customer, NoCustomer}},
        })
      } else {
        throw response
      }
    },
    *GetStoreSalePerAreaRankInFloor({ payload = {} }, { call, put }) {//商铺销售坪效排行榜
      const response = yield call(GetStoreSalePerAreaRankInFloor, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
          store = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          store.push(_.SalePerAreaAmt)
        });
        yield put({
          type: 'StoreSalePerAreaRankYesSucc',
          payload: {Data: { YAxis, store }},
        })
      } else {
        throw response
      }
    },
    *GetStoreEarningRankInFloor({ payload = {} }, { call, put }) {//商铺收益排行榜趋势
      const response = yield call(GetStoreEarningRankInFloor, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
          store = [];
      // console.log("收益红榜", Data)
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          store.push(_.EarningAmt)
        });
        yield put({
          type: 'StoreEarningRankYesSucc',
          payload: {Data: { YAxis, store }},
        })
      } else {
        throw response
      }
    },
    *GetStoreTypeList({ payload = {} }, { call, put }) {//商铺收益排行榜趋势
      const response = yield call(GetStoreTypeList, payload);
      const { success, Msg, Data, statusCode } = response;
      if(success && Data){
        return Data
      } else {
        throw response
      }
    },
    *GetStoreTypeFoodRank({ payload = {} }, { call, put }) {//商铺收益排行榜趋势
      const response = yield call(GetStoreTypeRank, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'StoreTypeFoodSucc',
          payload: {Data: {YAxis, Customer, NoCustomer}},
        })
      } else {
        throw response
      }
    },
    *GetStoreTypeRetailRank({ payload = {} }, { call, put }) {//商铺收益排行榜趋势
      const response = yield call(GetStoreTypeRank, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'StoreTypeRetailSucc',
          payload: {Data: {YAxis, Customer, NoCustomer}},
        })
      } else {
        throw response
      }
    },
    *GetStoreTypeFunRank({ payload = {} }, { call, put }) {//商铺收益排行榜趋势
      const response = yield call(GetStoreTypeRank, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'StoreTypeFunSucc',
          payload: {Data: {YAxis, Customer, NoCustomer}},
        })
      } else {
        throw response
      }
    },
    *GetStoreTypeMainRank({ payload = {} }, { call, put }) {//商铺收益排行榜趋势
      const response = yield call(GetStoreTypeRank, payload);
      const { success, Msg, Data, statusCode } = response;
      let YAxis = [],
        Customer = [],
        NoCustomer = [];
      if(success && Data){
        Data.forEach((_) => {
          YAxis.push(_.StoreName)
          Customer.push(_.CustomerSaleAmt)
          NoCustomer.push(_.NonCustomerSaleAmt)
        });
        yield put({
          type: 'StoreTypeMainSucc',
          payload: {Data: {YAxis, Customer, NoCustomer}},
        })
      } else {
        throw response
      }
    },
  },
  reducers: {
    FloorInfoListSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, FloorInfoList: Data,
      }
    },
    GetStoreInfoSucc(state, { payload }) {
      const { Data } = payload

      return {
        ...state, GetStoreInfo: Data,
      }
    },
    StoreCompareSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreCompare: Data,
      }
    },
    StoreSaleSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreSale: Data,
      }
    },
    StoreSequentialSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreSequential: Data,
      }
    },
    projectRankYesSucc(state, { payload }) {
      const { Data } = payload

      return {
        ...state, projectRankYes: Data,
      }
    },
    projectRankNOSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, projectRankNO: Data,
      }
    },
    projectStoreSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, projectStore: Data,
      }
    },
    projectIncomeSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, projectIncome: Data,
      }
    },
    floorSalesStoreRankYesSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, floorSalesRankYes: Data,
      }
    },
    floorSalesStoreRankNoSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, floorSalesRankNo: Data,
      }
    },
    StoreSalePerAreaRankYesSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreSalePerAreaRankYes: Data,
      }
    },
    StoreEarningRankYesSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreEarningRankYes: Data,
      }
    },
    StoreTypeFoodSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreTypeFood: Data,
      }
    },
    StoreTypeRetailSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreTypeRetail: Data,
      }
    },
    StoreTypeFunSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreTypeFun: Data,
      }
    },
    StoreTypeMainSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, StoreTypeMain: Data,
      }
    },

  },
}
