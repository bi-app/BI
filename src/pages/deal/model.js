import {
  GetdealSalesTrend,
  GetdealTimeInterval,
  GetFloorStoreSale,
  GettypeStoreSale,
  GetFloorSaleAnalysisData,
  GetStoresPositionInfo,
  GetTypeSaleAnalysis,
  GetStoresRankInfo,
  GetStoreslivingInfo,
  GetStoresInfo,
} from 'api'
import _ from 'lodash'
import moment  from 'moment'
import floorPoint  from './components/floorPoint'
import typePoint  from './components/typePoint'
import { _filterNodes, _filterEdges } from 'utils'
import numeral from 'numeral';
import Retail from 'assets/retail-icon.svg'
import Food from 'assets/food-icon.svg'
import mainStore from 'assets/mainstore-icon.svg'
import Matching from 'assets/Matching-icon.svg'
import produce from "immer"


function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

const matchSymbol = (id) => {
  let SymbolUrl = null
  switch (id){
    case '1'://零售
      SymbolUrl = 'image://'+ Retail;
      break;
    case '2'://餐饮
      SymbolUrl = 'image://'+ Food;
      break;
    case '4':// 服务配套
      SymbolUrl = 'image://'+ Matching;
      break;
    case '5': //主力店
      SymbolUrl = 'image://'+ mainStore;
      break;
  }
  return SymbolUrl
}
typePoint.nodes.forEach(function(node, index) {
  node.symbol = matchSymbol(node.id)
});

export default {
  namespace: 'deal',
  state: {
    storesliving: [],
    PointForType: {
      data: []
    },
    SalesTrend: {
      GuestCount: [],
      CustSaleAmt: [],
      NoCustSaleAmt: [],
      BizDate: []
    },
    TimeInterval: {
      CustSaleAmt: [],
      DateTime: [],
      NoCustSaleAmt: [],
      PersonCount: [],
    },
    TypeBase: typePoint,//业态基本点位
    TypeCenter: [],//业态中心
    FloorBase: floorPoint,//楼层基本点位
    FloorCenter: [],//楼层中心
    FloorSaleAnalysis: {
      LegendData: [],
      totalSeries: [],
      salesSeries: []
    },
    floorPoint: {
      nodes: [],
      edges: []
    },
    floorSalesVal: [],
    typePoint: {
      nodes: [],
      edges: []
    },
    typeSalesVal: [],
    typeSaleAnalysis: {
      LegendData: [],
      totalSeries: [],
      salesSeries: []
    },
    storesRank: {
      numOne: {
        BillAmount: 0,
        StoreConverImg: "",
        StoreID: "",
        StoreName: "",
      },
      numTwo: {
        BillAmount: 0,
        StoreConverImg: "",
        StoreID: "",
        StoreName: "",
      },
      numThree: {
        BillAmount: 0,
        StoreConverImg: "",
        StoreID: "",
        StoreName: "",
      },
      otherList: []
    },
    floorSales: [],
    typeSales: [],
    updateIndex: 0, //更新序号，用于数据遍历
    currentOrder: {
      BillTime: "",
      FloorId: "",
      ID: "",
      OperationTypeId: "",
      StoreCoverImg: "",
      StoreID: "",
      StoreName: "",
      TotalSaleAmt: 0
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      //async
      history.listen(location => {
        // console.log("已进入页面：", location)
        dispatch({type: '_getPointForFloor', payload: {queryType: 1}})
        dispatch({type: '_getPointForType', payload: {queryType: 2}})
      })
    },
  },

  effects: {
    *_getPointForFloor({ payload }, { call, put }) {
      const response = yield call(GetStoresPositionInfo, payload);
      const { success, Msg, Data, statusCode } = response;
      let nodes = [],
          edges = [];
      if(success && Data && Data !== null){
        _.forEach(floorPoint.nodes, (item, index) => {
          if(Number(item.id) === 0) nodes.push(item)
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.id)){
              nodes.push({
                attributes: {name: elem.StoreName},
                id: item.id,
                itemStyle: item.itemStyle,
                label: {...item.label, show: false},
                name: elem.StoreName,
                symbolSize: item.symbolSize,
                value: item.value,
                viz: item.viz,
                x: item.x,
                y: item.y,
                storeId: elem
              })
            }
          })
        })
        _.forEach(floorPoint.edges, (item, index) => {
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.source)){
              edges.push(item)
              edges.push(_filterEdges(item.target, floorPoint.edges))
              nodes.push(_filterNodes(item.target, floorPoint.nodes))
            }
          })
        });

        yield put({
          type: '_pointForFloorSucc',
          payload: {Data: {nodes: _.uniq(nodes), edges: _.uniq(edges)}},
        })
      } else {
        throw response
      }
    },
    *_getPointForType({ payload }, { call, put }) {
      const response = yield call(GetStoresPositionInfo, payload);
      const { success, Msg, Data, statusCode } = response;
      let nodes = [],
        edges = [];
      if(success && Data){

        _.forEach(typePoint.nodes, (item, index) => {
          if(Number(item.id) === 0) nodes.push(item)
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.id)){
              nodes.push({
                attributes: {name: elem.StoreName},
                id: item.id,
                itemStyle: item.itemStyle,
                label: {...item.label, show: false},
                name: elem.StoreName,
                symbolSize: item.symbolSize,
                value: item.value,
                viz: item.viz,
                x: item.x,
                y: item.y,
                storeId: elem
              })
            }
          })
        })
        _.forEach(typePoint.edges, (item, index) => {
          _.forEach(Data, (elem, i) => {
            if(elem.BIStarPositionSort === Number(item.source)){
              edges.push(item)
              edges.push(_filterEdges(item.target, typePoint.edges))
              nodes.push(_filterNodes(item.target, typePoint.nodes))
            }
          })
        });
        yield put({type: '_pointForTypeSucc', payload: {Data: {nodes: _.uniq(nodes), edges: _.uniq(edges)}},})
      } else {
        throw response
      }
    },
    *GetFloorStoreSale({ payload }, { call, put, select }) {//飞行图点位数据(基础)
      const response = yield call(GetFloorStoreSale, payload);
      const { success, Msg, Data, statusCode } = response;
      const { floorPoint } = yield select(_ => _.deal)
      if(success && Data){
        const { MallSaleAmt, FloorSale } = Data;
        const newPoint = produce(floorPoint, nextData => {
          nextData.nodes[0].name = String(numeral(MallSaleAmt).format('0,0'));
          nextData.nodes[0].attributes.name = String(MallSaleAmt);
          _.forEach(nextData.nodes, (ele) => {
            _.forEach(FloorSale, (item) => {
              const FloorName = ele.name.split('F')[0]
              if(FloorName === item.FloorName) {
                ele.symbolSize = item.symbolSize
                ele.TotalSaleAmt = item.TotalSaleAmt
                ele.searchId = item.FloorId
                ele.FloorId = item.FloorId
                return ele
              }
              _.forEach(item.StoreSale, (elem) => {
                if(ele.name === elem.StoreName){
                  ele.symbolSize = elem.symbolSize
                  ele.TotalSaleAmt = elem.TotalSaleAmt
                  ele.searchId = elem.StoreID
                  return ele
                }
              })
            })
          })
        });

        // console.warn("楼层电位分布:", newPoint)
        // initPoint.nodes.map(_ => {
        //   if(Number(_.id) === 0){
        //     _.name = String(numeral(MallSaleAmt).format('0,0'))
        //     _.attributes = {
        //       name: String(MallSaleAmt),
        //     }
        //     return _
        //   }
        // })
        yield put({
          type: '_floorStoreSaleSucc',
          payload: {
            Data: {
              floorPoint: newPoint,
              floorSalesVal: FloorSale
            }
          }
        })
      } else {
        throw response
      }
    },
    *updateFloorCenterSales({ payload }, { call, put, select }){//更新楼层销售值
      const { floorPoint } = yield select(_ => _.deal)
      const { currentOrder } = payload
      const newFloorPoint = produce(floorPoint, nextData => {
        nextData.nodes[0].name = numeral(Number(nextData.nodes[0].attributes.name) + Number(currentOrder)).format('0,0')
        nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(currentOrder))
      });
      console.log("newFloorPoint", newFloorPoint)
      yield put({ type: '_setFloorCenterVal', payload: {Data: newFloorPoint} })
    },

    *updateTypeCenterSales({ payload }, { call, put, select }){//业态
      const { typePoint } = yield select(_ => _.deal)
      const { sales } = payload
      const newPoint = produce(typePoint, nextData => {
        nextData.nodes[0].name = numeral(Number(nextData.nodes[0].attributes.name) + Number(sales)).format('0,0')
        nextData.nodes[0].attributes.name = String(Number(nextData.nodes[0].attributes.name) + Number(sales))
      });
      // console.log("改变之后的数据", initPoint)
      yield put({
        type: '_setTypeCenterVal',
        payload: {Data: newPoint}
      })
    },
    *GettypeStoreSale({ payload }, { call, put, select }) {//飞行图点位数据，业态
      const response = yield call(GettypeStoreSale, payload);
      const { success, Msg, Data, statusCode } = response;
      const { typePoint } = yield select(_ => _.deal)
      if(success && Data){
        console.warn("yetai", Data)
        const { MallSaleAmt, OperationSale } = Data;
        const newPoint = produce(typePoint, nextData => {
          nextData.nodes[0].name = String(numeral(MallSaleAmt).format('0,0'))
          nextData.nodes[0].attributes.name = String(MallSaleAmt)
          _.forEach(nextData.nodes, (ele) => {
            _.forEach(OperationSale, (item) => {
              if(ele.name === item.OperationName) {
                ele.symbolSize = item.symbolSize
                ele.TotalSaleAmt = item.TotalSaleAmt
                ele.searchId = item.OperationID
                ele.OperationID = item.OperationID
                return ele
              }
              _.forEach(item.StoreSale, (elem) => {
                if(ele.name === elem.StoreName){
                  ele.symbolSize = elem.symbolSize
                  ele.TotalSaleAmt = elem.TotalSaleAmt
                  ele.searchId = elem.StoreID
                  return ele
                }
              })
            })
          })
        });

        // console.warn("业态点位分布:", newPoint)
        yield put({
          type: '_typeStoreSucc',
          payload: {
            Data: {
              typePoint: newPoint,
              typeSalesVal: OperationSale
            }
          }
        })
      } else {
        throw response
      }
    },
    *GetTypeSaleAnalysis({ payload }, { call, put }) {//业态销售分析
      const response = yield call(GetTypeSaleAnalysis, payload);
      const { success, Msg, Data, statusCode } = response;
      let LegendData = [],
        totalSeries = [],
        salesSeries = [];

      if(success && Data){
        // console.warn("Data", Data)
        Data.forEach((_) => {
          LegendData.push(`${_.OperationTypeName}`)
          totalSeries.push({
            value: String(_.TotalAmount),
            name: `${_.OperationTypeName}`
          })
          salesSeries.push(
            {
              value: String(_.VipAmount),
              name: `会员 ${_.OperationTypeName}`
            },
            {
              value: String(_.NormalAmount),
              name: `非会员 ${_.OperationTypeName}`
            })
        });
        yield put({
          type: '_typeSaleAnalysisSucc',
          payload: {Data: {LegendData, totalSeries, salesSeries}},
        })
      } else {
        throw response
      }

    },
    *GetStoresRankInfo({ payload }, { call, put }) {//查询商铺实时交易排序数据
      const response = yield call(GetStoresRankInfo, payload);
      const { success, Msg, Data, statusCode } = response;
      let numOne = {},
          numTwo = {},
          numThree = {},
          otherList = [];
      if(success && Data){
        // console.log("Data: ", Data)
        Data.forEach((e, i) => {
          if(i === 0){
            numOne = {
              BillAmount: e.BillAmount,
              StoreConverImg: e.StoreConverImg,
              StoreID: e.StoreID,
              StoreName: e.StoreName,
            }
          }
          if(i === 1){
            numTwo = {
              BillAmount: e.BillAmount,
              StoreConverImg: e.StoreConverImg,
              StoreID: e.StoreID,
              StoreName: e.StoreName,
            }
          }
          if(i === 2){
            numThree = {
              BillAmount: e.BillAmount,
              StoreConverImg: e.StoreConverImg,
              StoreID: e.StoreID,
              StoreName: e.StoreName,
            }
          }
          if(i !== 0 && i !== 1 && i !== 2){
            otherList.push(e)
          }
        })


        yield put({
          type: '_storesRankSucc',
          payload: {Data: {numOne, numTwo, numThree, otherList}},
        })
      } else {
        throw response
      }
    },
    *getDealTimeInterval({ payload }, { call, put }) {//销售时段
      const response = yield call(GetdealTimeInterval);
      const { success, Msg, Data, statusCode } = response;
      let CustSaleAmt = [],
        DateTime = [],
        PersonCount = [],
        NoCustSaleAmt = [];
      if(success && Data){
        Data.forEach((_) => {
          DateTime.push(moment(_.DateTime).format('YYYY.MM.DD HH:MM'))
          CustSaleAmt.push(_.CustSaleAmt)
          PersonCount.push(_.PersonCount)
          NoCustSaleAmt.push(_.NoCustSaleAmt)
        });
        yield put({
          type: '_timeIntervalSucc',
          payload: {Data: {DateTime, CustSaleAmt, PersonCount, NoCustSaleAmt}},
        })
      } else {
        throw response
      }
    },
    *getSalesTrend({ payload }, { call, put }) {//销售趋势
      const response = yield call(GetdealSalesTrend);
      const { success, Msg, Data, statusCode } = response;
      let BizDate = [],
        CustSaleAmt = [],
        GuestCount = [],
        NoCustSaleAmt = [];

      if(success && Data){
        // console.log("销售趋势", Data)
        Data.forEach((_) => {
          GuestCount.push(_.GuestCount)
          CustSaleAmt.push(_.CustSaleAmt)
          NoCustSaleAmt.push(_.NoCustSaleAmt)
          BizDate.push(moment(_.BizDate).format('YYYY.MM.DD'))
        });
        yield put({
          type: '_salesTrendSucc',
          payload: {Data: {BizDate, CustSaleAmt, GuestCount, NoCustSaleAmt}},
        })
      } else {
        throw response
      }
    },
    *GetStoreslivingInfo({ payload }, { call, put, select }) {//订单实时数据，处理交互动画逻辑
      const response = yield call(GetStoreslivingInfo, payload);
      const { success, Data } = response;
      if(success && Data){
        const newData =  _.orderBy(Data, ['BillTime'], ['asc'])
        yield put({
          type: '_storeslivingInfoSucc',
          payload: {Data: {storesliving: newData}}
        })
      } else {
        throw response
      }
    },
    *GetFloorSaleAnalysisData({ payload }, { call, put }) {//楼层销售分析统计数据
      const response = yield call(GetFloorSaleAnalysisData, payload);
      const { success, Data } = response;
      let LegendData = [],
        totalSeries = [],
        salesSeries = [];
      if(success && Data){
        Data.forEach((_) => {
          LegendData.push(`${_.FloorName}楼`)
          totalSeries.push({
            value: String(_.TotalAmount),
            name: `${_.FloorName}楼`
          })
          salesSeries.push(
            {
              value: String(_.VipAmount),
              name: `会员 ${_.FloorName}楼`
            },
            {
              value: String(_.NormalAmount),
              name: `非会员 ${_.FloorName}楼`
            })
        });
        yield put({
          type: '_floorSaleAnalysisSucc',
          payload: {
            Data: {LegendData, totalSeries, salesSeries}
          },
        })
      } else {
        throw response
      }
    },
    *updateFatherVal({ payload }, { call, put, select }) {
      const { typeSalesVal, floorSalesVal } = yield select(_ => _.deal)
      const { Data } = payload;
      const { FloorId, TotalSaleAmt, StoreName, OperationTypeId } = Data;

      let initFloorSalesVal = [];
      let initTypeSalesVal = [];

      _.forEach(floorSalesVal, (e, i) => {
        if(e.FloorId === FloorId){
          e.TotalSaleAmt = Number((e.TotalSaleAmt + TotalSaleAmt).toFixed(2));
          // console.log("新的e", e)
          initFloorSalesVal.push(e)
        }else {
          // console.log("新的就", e)
          initFloorSalesVal.push(e)
        }
      })

      _.forEach(typeSalesVal, (e, i) => {
        if(e.OperationID === OperationTypeId){
          e.TotalSaleAmt = Number((e.TotalSaleAmt + TotalSaleAmt).toFixed(2));
          initTypeSalesVal.push(e)
        }else {
          initTypeSalesVal.push(e)
        }
      })

      // console.log("新的", initTypeSalesVal)
      yield put({
        type: '_addFloorSalesVal',
        payload: {
          floorSalesVal: initFloorSalesVal,
          typeSalesVal: initTypeSalesVal,
        }
      })
    },
  },

  reducers: {
    _updateStatus(state, { payload }){
      console.log("payload", payload)
      const { newState } = payload
      return { ...state, ...newState }
    },
    _typeSaleAnalysisSucc(state, { payload }){
      const { Data } = payload
      return { ...state, typeSaleAnalysis: Data }
    },
    _storesRankSucc(state, { payload }){
      const { Data } = payload
      return { ...state, storesRank: Data }
    },
    _salesTrendSucc(state, { payload }){
      const { Data } = payload
      return { ...state, SalesTrend: Data }
    },
    _timeIntervalSucc(state, { payload }){
      const { Data } = payload
      return { ...state, TimeInterval: Data }
    },
    _floorStoreSaleSucc(state, { payload }){
      const { Data } = payload;
      const { floorPoint, floorSalesVal } = Data;
      return {...state, floorPoint, floorSalesVal}
    },
    _typeStoreSucc(state, { payload }){
      const { Data } = payload
      const { typePoint, typeSalesVal } = Data

      return {...state, typePoint, typeSalesVal}
    },
    _floorSaleAnalysisSucc(state, { payload }){
      const { Data } = payload
      return { ...state, FloorSaleAnalysis: Data }
    },
    _pointForFloorSucc(state, { payload }){
      const { Data } = payload
      return { ...state, floorPoint: Data }
    },
    _pointForTypeSucc(state, { payload }){
      const { Data } = payload
      return { ...state, typePoint: Data }
    },
    _storeslivingInfoSucc(state, { payload }){
      const { Data } = payload
      const { storesliving } = Data
      return { ...state, storesliving,  }
    },
    _setEffectForFloor(state, { payload }){
      const { Data } = payload
      return { ...state, floorSales: Data,  }
    },
    _setFloorCenterVal(state, { payload }){
      const { Data } = payload
      return { ...state, floorPoint: Data,  }
    },
    _setTypeCenterVal(state, { payload }){
      const { Data } = payload
      return { ...state, typePoint: Data,  }
    },
    _updateIndexHandle(state, { payload }){
      const { updateIndex } = payload
      return { ...state, updateIndex }
    },
    _addFloorSalesVal(state, { payload }){//改变类别值
      const { floorSalesVal, typeSalesVal } = payload
      return { ...state, floorSalesVal, typeSalesVal}
    },
    _addTypeSalesVal(state, { payload }){//改变类别值
      const {  typeSalesVal } = payload
      return { ...state, typeSalesVal }
    },
    _setCurrentOrder(state, { payload }){//设置当前订单
      const { currentOrder } = payload
      return { ...state, currentOrder }
    },


  }
}
