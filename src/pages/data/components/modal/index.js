import React, { PureComponent, Fragment } from 'react'
import { Modal, Tabs, Row, Col, Spin, Empty, Icon } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import moment from 'moment'
import EmptyIma from 'assets/Empty.svg'
import { Recharts, Components } from 'react-component-echarts'
import config from 'utils/config'
const { Name, TextStyle, LineStyle, AxisLabel, NameTextStyle, Grid, SplitLine, AxisLine, AxisTick, Legend, Tooltip, XAxis, YAxis, Series } = Components
const TabPane = Tabs.TabPane;

@connect(({ app, globalData, data, loading }) => ({ app, globalData, data, loading }))
class Trend extends React.PureComponent {
  callback = (key) => {

  }

  render() {
    const {
      visible,
      onOk,
      onCancel,
      width,
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
      loading,
    } = this.props
    const { global } = loading
    const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

    // console.warn("收益红榜：", StoreEarningRankYes)

    return (
      <Fragment>
        <Modal
          centered={true}
          visible={visible}
          closable={false}
          onOk={onOk}
          onCancel={onCancel}
          width={width}
          className={styles.customModal}
          footer={null}
        >
          <i className={styles['modal-border-com'] + ' ' + styles['modal-border-left-top']} />
          <i className={styles['modal-border-com'] + ' ' + styles['modal-border-left-bottom']} />
          <i className={styles['modal-border-com'] + ' ' + styles['modal-border-right-top']} />
          <i className={styles['modal-border-com'] + ' ' + styles['modal-border-right-bottom']} />
          <Spin indicator={antIcon} spinning={global} wrapperClassName='modalspinning'>
            <Tabs className={styles.customTab} onChange={this.callback} type="card">
              <TabPane tab="项目排行榜" key="1" className={styles.tab}>
                <Row gutter={24}>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          销售红榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          projectRankYes.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                              </Legend>
                              <Grid left="14%" top="22%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={projectRankYes.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="会员销售" type="bar" stack="销售" data={projectRankYes.Customer} barWidth="30%" itemStyle={{"color":"#19B462"}} />
                              <Series name="非会员销售" type="bar" stack="销售" data={projectRankYes.NoCustomer} barWidth="30%" itemStyle={{"color":"#2BDFA0"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          销售黑榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          projectRankNO.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                              </Legend>
                              <Grid left="14%" top="22%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={projectRankNO.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="会员销售" type="bar" stack="销售" data={projectRankNO.Customer} barWidth="30%" itemStyle={{"color":"#7FD4FF"}} />
                              <Series name="非会员销售" type="bar" stack="销售" data={projectRankNO.NoCustomer} barWidth="30%" itemStyle={{"color":"#00A5F7"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          销售坪效红榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          projectStore.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Grid left="14%" top="15%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={projectStore.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="销售坪效" type="bar" data={projectStore.store} barWidth="30%" itemStyle={{"color":"#00BAD6"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          收益红榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          projectIncome.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Grid left="14%" top="15%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={projectIncome.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="收益额" type="bar" data={projectIncome.store} barWidth="30%" itemStyle={{"color":"#FF8160"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="楼层排行榜" key="2">
                <Row gutter={24}>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          销售红榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          floorSalesRankYes.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                              </Legend>
                              <Grid left="14%" top="22%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={floorSalesRankYes.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="会员销售" type="bar" stack="销售" data={floorSalesRankYes.Customer} barWidth="30%" itemStyle={{"color":"#19B462"}} />
                              <Series name="非会员销售" type="bar" stack="销售" data={floorSalesRankYes.NoCustomer} barWidth="30%" itemStyle={{"color":"#2BDFA0"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          销售黑榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          floorSalesRankNo.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                              </Legend>
                              <Grid left="14%" top="22%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={floorSalesRankNo.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="会员销售" type="bar" stack="销售" data={floorSalesRankNo.Customer} barWidth="30%" itemStyle={{"color":"#7FD4FF"}} />
                              <Series name="非会员销售" type="bar" stack="销售" data={floorSalesRankNo.NoCustomer} barWidth="30%" itemStyle={{"color":"#00A5F7"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          销售坪效红榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          StoreSalePerAreaRankYes.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Grid left="14%" top="15%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={StoreSalePerAreaRankYes.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="销售坪效" type="bar" data={StoreSalePerAreaRankYes.store} barWidth="30%" itemStyle={{"color":"#00BAD6"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          收益红榜TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          StoreEarningRankYes.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Grid left="14%" top="15%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={StoreEarningRankYes.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="收益" type="bar" data={StoreEarningRankYes.store} barWidth="30%" itemStyle={{"color":"#FF8160"}} />
                            </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="业态排行榜" key="3">
                <Row gutter={24}>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          餐饮销售TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          StoreTypeFood.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                            <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                              <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                            </Legend>
                            <Grid left="14%" top="22%" bottom="4%" right="12%" />
                            <Tooltip
                              trigger="axis"
                              extraCssText={config.dataExtraCssText}
                            />
                            <XAxis
                              name="金额（元）"
                              type="value"
                              position="top"
                            >
                              <NameTextStyle fontSize={10}/>
                              <AxisLabel show={true} color="#fff" fontSize={10} />
                              <SplitLine show={false} />
                              <AxisLine>
                                <LineStyle color="#FFFFFF" />
                              </AxisLine>
                              <AxisTick show={false} />
                            </XAxis>
                            <YAxis type="category" inverse={true} data={StoreTypeFood.YAxis}>
                              <AxisTick show={false} />
                              <AxisLine>
                                <LineStyle color="#FFF" />
                              </AxisLine>
                              <AxisLabel show={true} color="#fff" fontSize={10} />
                            </YAxis>
                            <Series name="会员销售" type="bar" stack="销售" data={StoreTypeFood.Customer} barWidth="30%" itemStyle={{"color":"#19B462"}} />
                            <Series name="非会员销售" type="bar" stack="销售" data={StoreTypeFood.NoCustomer} barWidth="30%" itemStyle={{"color":"#2BDFA0"}} />
                          </Recharts>
                        }
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          服务配套TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          StoreTypeFun.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :  <Recharts backgroundColor="#13153E">
                            <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                              <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                            </Legend>
                            <Grid left="14%" top="22%" bottom="4%" right="12%" />
                            <Tooltip
                              trigger="axis"
                              extraCssText={config.dataExtraCssText}
                            />
                            <XAxis
                              name="金额（元）"
                              type="value"
                              position="top"
                            >
                              <NameTextStyle fontSize={10}/>
                              <AxisLabel show={true} color="#fff" fontSize={10} />
                              <SplitLine show={false} />
                              <AxisLine>
                                <LineStyle color="#FFFFFF" />
                              </AxisLine>
                              <AxisTick show={false} />
                            </XAxis>
                            <YAxis type="category" inverse={true} data={StoreTypeFun.YAxis}>
                              <AxisTick show={false} />
                              <AxisLine>
                                <LineStyle color="#FFF" />
                              </AxisLine>
                              <AxisLabel show={true} color="#fff" fontSize={10} />
                            </YAxis>
                            <Series name="会员销售" type="bar" stack="销售" data={StoreTypeFun.Customer} barWidth="30%" itemStyle={{"color":"#7FD4FF"}} />
                            <Series name="非会员销售" type="bar" stack="销售" data={StoreTypeFun.NoCustomer} barWidth="30%" itemStyle={{"color":"#00A5F7"}} />
                          </Recharts>
                        }

                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          零售销售TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          StoreTypeRetail.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                              </Legend>
                              <Grid left="14%" top="22%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={StoreTypeRetail.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="会员销售" type="bar" stack="销售" data={StoreTypeRetail.Customer} barWidth="30%" itemStyle={{"color":"#00BAD6"}} />
                              <Series name="非会员销售" type="bar" stack="销售" data={StoreTypeRetail.NoCustomer} barWidth="30%" itemStyle={{"color":"#0FECF2"}} />
                            </Recharts>
                        }

                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.chart_item}>
                      <div className={styles.chart_list_title}>
                        <div className={styles.list_title_text}>
                          主力店销售TOP5
                          <i className={styles['border-top']}/>
                          <i className={styles['border-oblique']}/>
                        </div>
                      </div>
                      <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                        {
                          StoreTypeMain.YAxis.length === 0 ? <Empty
                            image={EmptyIma}
                            imageStyle={{height: 60,}}
                            description={<span style={{color: '#2880B4', fontSize: 16}}
                            >暂无相关数据</span>} /> :
                            <Recharts backgroundColor="#13153E">
                              <Legend right={4} top={0} icon="rect" itemWidth={9} itemHeight={9}>
                                <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]}/>
                              </Legend>
                              <Grid left="14%" top="22%" bottom="4%" right="12%" />
                              <Tooltip
                                trigger="axis"
                                extraCssText={config.dataExtraCssText}
                              />
                              <XAxis
                                name="金额（元）"
                                type="value"
                                position="top"
                              >
                                <NameTextStyle fontSize={10}/>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                                <SplitLine show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFFFFF" />
                                </AxisLine>
                                <AxisTick show={false} />
                              </XAxis>
                              <YAxis type="category" inverse={true} data={StoreTypeMain.YAxis}>
                                <AxisTick show={false} />
                                <AxisLine>
                                  <LineStyle color="#FFF" />
                                </AxisLine>
                                <AxisLabel show={true} color="#fff" fontSize={10} />
                              </YAxis>
                              <Series name="会员销售" type="bar" stack="销售" data={StoreTypeMain.Customer} barWidth="30%" itemStyle={{"color":"#FF8160"}} />
                              <Series name="非会员销售" type="bar" stack="销售" data={StoreTypeMain.NoCustomer} barWidth="30%" itemStyle={{"color":"#FFDA6D"}} />
                            </Recharts>
                        }

                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Spin>
        </Modal>
      </Fragment>
    );
  }
}

export default Trend
