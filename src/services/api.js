
export default {
  login: 'POST /Config/GetBiAdminStaffInfo',//登录
  getBiconfig: 'POST /Config/GetBiConfig',//获取配置文件
  getSales: 'POST /DataScreen/GetSaleSummaryByMonthCondition',//销售数据
  getSalesChart: 'POST /DataScreen/GetSaleThrendByMonthCondition',//销售曲线
  getIncome: 'POST /DataScreen/GetEarningSummaryByMonthCondition',//收益
  getIncomeChart: 'POST /DataScreen/GetEarningThrendByMonthCondition',//收益图表
  getPassenger: 'POST /DataScreen/GetPassengerFlowByMonthCondition',// 客流
  getMember: 'POST /DataScreen/GetCustEarningSummaryByMonthCondition',// 会员数据
  getMemberChart: 'POST /DataScreen/GetCustThrendByMonthCondition',// 会员图表
  getFloorInfoList: 'POST /DataScreen/GetFloorInfoList',// 获取楼层信息
  getTypeIncomeInfo: 'POST /DataScreen/GetOperationEarningPercentByFloorID',//查询业态收益占比分析
  getTypeSalesInfo: 'POST /DataScreen/GetOperationSalePercentByFloorID',//查询业态销售占比分析
  getFloorSale: 'POST /DataScreen/GetFloorSaleEarnByFloorID',//查询楼层销售收益分析汇总块
  getFloorTrend: 'POST /DataScreen/GetFloorTrendByFloorID',//(数据屏-楼层销售分析)
  getDegreeList: '/DataScreen/GetDegreeList',//查询等级类型(1销售/2收益)
  GetStoreSaleByFloorID: 'POST /DataScreen/GetStoreSaleByFloorID',//楼层查询商铺销售数据业绩
  GetStoreEarningByFloorID: 'POST /DataScreen/GetStoreEarningByFloorID',//按楼层查询商铺收益数据业绩
  GetStoreInfo: 'POST /DataScreen/GetStoreInfoByMonthCondition',//按日期条件 商铺ID查询商铺信息
  GetStoreCircle: 'POST /DataScreen/GetStoreCircleSequentialInfoByMonthCondition',//按日期条件 商铺ID查询商铺环比信息
  GetStoreSale: 'POST /DataScreen/GetStoreSaleSequentialInfoByMonthCondition',//按日期条件 商铺ID查询商铺环比信息
  GetStoreSequential: 'POST /DataScreen/GetStoreSequentialInfoByMonthCondition',//按日期条件 商铺ID查询商铺收益趋势
  GetStoreSaleRankInMall: 'POST /DataScreen/GetStoreSaleRankInMall',//按日期条件 查询项目销售排行红黑榜趋势
  GetStoreSalePerAreaRankInMall: 'POST /DataScreen/GetStoreSalePerAreaRankInMall',//按日期条件 查询项目下商铺销售坪效排行榜
  GetStoreEarningRankInMall: 'POST /DataScreen/GetStoreEarningRankInMall',//按日期条件 查询项目下商铺收益排行榜趋势

  //modal 楼层排行榜
  GetStoreSaleRankInFloor: 'POST /DataScreen/GetStoreSaleRankInFloor',//按日期条件  楼层ID 查询楼层销售排行红黑榜趋势
  GetStoreSalePerAreaRankInFloor: 'POST /DataScreen/GetStoreSalePerAreaRankInFloor',//按日期条件 楼层ID 查询项目下商铺销售坪效排行榜
  GetStoreEarningRankInFloor: 'POST /DataScreen/GetStoreEarningRankInFloor',//按日期条件 楼层ID 查询楼层下商铺收益排行榜趋势

  //业态排行榜
  GetStoreTypeList: 'POST /DataScreen/GetOperationTypeList',//获取一级业态列表
  GetStoreTypeRank: 'POST /DataScreen/GetStoreSaleRankInOperationType', //查询各个业态销售排行红黑榜趋势


  GetdealSalesTrend: '/SaleScreen/GetSalesTrendAnalysisData',//按时间条件-查询销售趋势分析数据
  GetdealTimeInterval: '/SaleScreen/GetTimeIntervalSaleAnalysisData',//按时间条件-查询销售时段分析统计数据
  GetFloorStoreSale: 'POST /SaleScreen/GetFloorStoreSaleByTimeCondition',//按时间条件查询楼层交易屏 飞星图
  GettypeStoreSale: 'POST /SaleScreen/GetOperationStoreSaleByTimeCondition',//按时间条件查询业态交易屏 飞星图
  GetFloorSaleAnalysisData: 'POST /SaleScreen/GetFloorSaleAnalysisData',//时间条件-查询楼层销售分析统计数据
  GetTypeSaleAnalysis: 'POST /SaleScreen/GetOperationTypeSaleAnalysisData',//时间条件-查询楼层销售分析统计数据
  GetStoresPositionInfo: '/SaleScreen/QueryBindStoresPositionInfo',//查询绑定商铺点位信息
  GetStoresRankInfo: 'POST /SaleScreen/GetStoreSaleDataByTimeRankingList',//查询商铺实时交易排序数据
  GetStoreslivingInfo: 'POST /SaleScreen/GetSroreRealTimeSaleByTimeCondition',//商铺实时交易数据飞星图
  GetStoresInfo: 'POST /SaleScreen/GetStoreSaleByStoreTimeCondition',//获取商铺信息

}
