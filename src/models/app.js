import { getBiconfig } from 'api'
import { stringify } from 'qs'
import { Modal} from 'antd';
import { rangeDate, getSession, router, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'

export default {
  namespace: 'app', //namespace 是该 model 的命名空间
  state: {//是状态的初始值。
    dealBtnInit: "1",
    dealsiderKey: "1",
    rangeData: [],
    locationPathname: '',
    locationQuery: {},
    showType: '1',
    Biconfig: {
      CustomDefineStartDate: "", //自定义开始日期
      DefaultBuildingID: "", //默认楼栋Id
      DefaultFloorShowType: 2, //商铺显示信息设置
      DefaultInvoiceEarnDegressNum: 3, //默认收益分级数量
      DefaultMallID: "0a4adb72-2422-4be6-b7ad-81dfbae03fa0", //默认项目Id
      DefaultSaleDegereeNum: 2,//默认销售分级数量
      DefaultStoreIsShowDoorNum: 1, //商铺显示信息设置 是否显示单元编号
      DefaultStoreIsShowStoreName: 1,//商铺显示信息设置 是否显示商铺名称
      DefaultStoreLogoFileName: "Chrysanthemum.jpg", //默认商铺Logo文件名
      DefaultStoreLogoUrl: "http://localhost:13950/PointCollection/Chrysanthemum.jpg", //域名+默认商铺Logo地址
      DefaultTransScreenShowDataRangeType: 2,//交易屏更新时间类型
      DefaultTransScreenShowDateEveryMonthValue: "",// 1代表1号 31代表31号
      DefaultTransScreenShowDateEveryWeekValue: "1,5,",//每周 => 1代表每周1
      DefaultTransScreenShowType: 1,//交易屏默认显示设置
      EmptyStoreIsShowDoorNum: 0,//空置商铺显示信息设置 是否显示单元编号
      EmptyStoreIsShowOther: 1,//空置商铺显示信息设置 是否显示其他
      EmptyStoreShowOtherInfo: "",//空置商铺显示信息设置 其他信息内容
      MaxDataIntervalMonth: 6, //数据屏最大时间间隔 月
      StartHourMinSec: "08:00",//开始更新时间点
      TransDataUpdateFrequency: 5,// 交易数据更新频率 分钟
    },
    dealRange: {
      StartTime: '',
      EndTime: '',
    },
    hasPermission: false,
  },
  /**
   * 用于订阅某些数据源，并根据情况 dispatch 某些 action，
   * */
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen((e) => {
        const { cancelRequest = new Map() } = window
        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },

    setup({ dispatch, history }) {//一进入页面请求
      dispatch({type: 'getBiconfig'})
    },
  },

  /**
   * 用于处理异步操作，不能直接修改 state，由 action 触发，也可触发 action。
   * 它只能是 generator 函数，并且有 action 和 effects 两个参数。
   * 第二个参数 effects 包含 put、call 和 select 三个字段，
   *    put 用于触发 action，
   *    call 用于调用异步处理逻辑，
   *    select 用于从 state 中获取数据
   * */
  effects: {
    *getBiconfig({ payload }, { call, put, select }, ) {
      const userInfo = getSession("userInfo");
      const { locationPathname } = yield select(_ => _.app)

      if(userInfo){
        // yield put({type: 'updateState',})
        yield put({
          type: 'setPermission',
          payload: {Data: true}
        })
        if (pathMatchRegexp('/login', window.location.pathname)) {
          router.push({pathname: '/data'})
        }
        const response = yield call(getBiconfig);
        const { Data } = response;
        if(Data){
          yield put({type: 'BiconfigSucc', payload: {Data}});
          yield put({type: '_updateSaleTypeChange', payload: {showType: String(Data.DefaultFloorShowType)}});
          yield put({type: 'setRangeDate', payload: {Data: rangeDate(Data)}});
          yield put({type: '_dealBtnTypeChange', payload: {dealBtnInit: String(Data.DefaultTransScreenShowType)}});
        }else {
          throw response
        }
      }else {
        yield put({
          type: 'setPermission',
          payload: {Data: false}
        })
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          })})
      }
    },
    *siderChange({ payload }, { call, put }) {
      yield put({
        type: '_siderReducers',
        payload
      });
    },
    *rangeChange({ payload }, { call, put }) {
      console.log("payload", payload)
      yield put({ type: 'getSales', payload })
    },


  },
  /**
   * 类似于 redux 中的 reducer，它是一个纯函数，用于处理同步操作，
   * 是唯一可以修改 state 的地方，由 action 触发，它有 state 和 action 两个参数
   * */
  reducers: {
    _updateSaleTypeChange(state, { payload }){
      const { showType } = payload
      return {...state, showType}
    },
    _dealBtnTypeChange(state, { payload }) {
      const { dealBtnInit } = payload
      return {...state, dealBtnInit}
    },
    _siderReducers(state, action) {
      state.dealsiderKey = action.payload.key
    },
    BiconfigSucc(state, { payload }) {
      const { Data } = payload
      return {
        ...state, Biconfig: Data,
      }
    },
    setRangeDate(state, { payload }){
      const { Data } = payload
      return {
        ...state, dealRange: Data,
      }
    },
    setPermission(state, { payload }){
      const { Data } = payload
      return {
        ...state, hasPermission: Data,
      }
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

  },

};
