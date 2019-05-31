import React, { Component } from 'react'
import { Modal, Row, Col, Avatar, Tag, Icon, Statistic, Spin } from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import { Recharts, Components } from 'react-component-echarts';
import config from 'utils/config';
const { AxisPointer, TextStyle, LineStyle, AxisLabel, NameTextStyle, Grid, SplitLine, AxisLine, AxisTick, Legend, Tooltip, XAxis, YAxis, Series } = Components


@connect(({app, data, loading}) => ({app, data, loading}))
class Trend extends Component {

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.visible !== nextProps.visible || this.props.loading.global !== nextProps.loading.global){
      return true
    }
    return false
  }

  render() {
    const { data, visible, onCancel, width, loading, app} = this.props;
    const { GetStoreInfo, StoreCompare, StoreSale, StoreSequential } = data;
    const { global } = loading;
    const { Biconfig } = app;
    const { DefaultStoreLogoUrl } = Biconfig;

    // console.log("店铺弹窗渲染。。。00")
    const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

    const statusNum = (value) => {
      let initNum = 0;
      if( Number(value) >= 0 ){
        initNum = value;
      }else {
        initNum = String(value).split("-")[1];
      }
      return initNum
    };

    const statusColor = (value) => {
      let initColor = "#fff";
      if( Number(value) > 0 ){
        initColor = "#ff8160";
      }else if(Number(value) < 0){
        initColor = "#2bdfa0";
      }
      return initColor
    };

    const statusIcon = (value) => {
      let initIcon = <Icon type='minus' />;
      if( Number(value) > 0 ){
        initIcon = <Icon type='rise' />;
      }else if(Number(value) < 0){
        initIcon = <Icon type='fall' />;
      }
      return initIcon
    };

    return (
      <Modal
        centered={true}
        visible={visible}
        closable={false}
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
          <div className={styles.row_item}>
            <Row gutter={40}>
              <Col span={12} >
                <div className={styles.store_info}>
                  <div className={styles.store_info_img}>
                    <Avatar
                      size={80}
                      style={{ backgroundColor: '#fff' }}
                      src={DefaultStoreLogoUrl}
                    />
                  </div>
                  <h3 className={styles.store_info_name}>
                    <span>{GetStoreInfo.StoreName}</span>
                    <Tag color="#3A355F">{GetStoreInfo.OperationName}</Tag>
                  </h3>
                </div>
                <div className={styles.store_extra_info}>
                  <ul>
                    <li>
                      <span className={styles.store_extra_title}>销售排名：</span>
                      <span className={styles.store_extra_cont}>
                        <Statistic
                          value={GetStoreInfo.SaleRank}
                          precision={0}
                          valueStyle={{ color: '#ff8160' }}
                          prefix={"NO."}
                        />
                      </span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>收益排名：</span>
                      <span className={styles.store_extra_cont}>
                        <Statistic
                          value={GetStoreInfo.EarningRank}
                          precision={0}
                          valueStyle={{ color: '#ff8160' }}
                          prefix={"NO."}
                        />
                      </span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>开业时间：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.OpenDate}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>占地面积：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.StoreArea}</span>
                    </li>
                    {/*<li>*/}
                    {/*<span className={styles.store_extra_title}>租金收取方式：</span>*/}
                    {/*<span className={styles.store_extra_cont}>{GetStoreInfo.RentCollectMethod}</span>*/}
                    {/*</li>*/}
                    <li>
                      <span className={styles.store_extra_title}>店铺编号：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.StoreCode}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>租金收益：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.RentEarning}</span>
                    </li>

                    <li className={styles['store-position']}>
                      <span className={styles.store_extra_title}>店铺位置：</span>
                      <span className={styles.store_extra_cont + ' ' + styles['store-position-text']}>{`${GetStoreInfo.FloorName}楼${GetStoreInfo.DoorNumber}`}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>所属业态：</span>
                      <span className={styles.store_extra_cont}>{GetStoreInfo.OperationName}</span>
                    </li>
                    <li>
                      <span className={styles.store_extra_title}>欠费：</span>
                      <span className={styles.store_extra_cont}>
                        <Statistic
                          value={GetStoreInfo.UnChargeAmt}
                          precision={2}
                          valueStyle={{ color: '#0fecf2' }}
                          suffix="元"
                        />
                      </span>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col span={12} >
                <div className={styles.store_chart_item + ' ' + styles.slider_card_corner_border}>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="销售额"
                      value={StoreCompare.SaleAmt}
                      precision={2}
                      suffix="元"
                    />
                    <Statistic
                      value={statusNum(StoreCompare.SaleSequentialValue)}
                      precision={2}
                      valueStyle={{ color: statusColor(StoreCompare.SaleSequentialValue), fontSize: 14 }}
                      prefix={statusIcon(StoreCompare.SaleSequentialValue)}
                      suffix="%"
                    />
                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="收益"
                      value={StoreCompare.EarningAmt}
                      precision={2}
                      suffix="元"
                    />
                    <Statistic
                      value={statusNum(StoreCompare.EarningSequentialValue)}
                      precision={2}
                      valueStyle={{ color: statusColor(StoreCompare.EarningSequentialValue), fontSize: 14 }}
                      prefix={statusIcon(StoreCompare.EarningSequentialValue)}
                      suffix="%"
                    />
                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="客单价"
                      value={StoreCompare.CustomerPerOrder}
                      precision={2}
                      suffix="元"
                    />
                    <Statistic
                      value={statusNum(StoreCompare.CustomerSequentialOrder)}
                      precision={2}
                      valueStyle={{ color: statusColor(StoreCompare.CustomerSequentialOrder), fontSize: 14 }}
                      prefix={statusIcon(StoreCompare.CustomerSequentialOrder)}
                      suffix="%"
                    />
                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="销售坪效"
                      value={StoreCompare.SaleAmtPerArea}
                      precision={2}
                      suffix="元"
                    />
                    <Statistic
                      value={statusNum(StoreCompare.SaleAmtPerAreaSequentialValue)}
                      precision={2}
                      valueStyle={{ color: statusColor(StoreCompare.SaleAmtPerAreaSequentialValue), fontSize: 14 }}
                      prefix={statusIcon(StoreCompare.SaleAmtPerAreaSequentialValue)}
                      suffix="%"
                    />
                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="收益坪效"
                      value={StoreCompare.RentEarningPerArea}
                      precision={2}
                      suffix="元"
                    />
                    <Statistic
                      value={statusNum(StoreCompare.EarningPerAreaSequentialValue)}
                      precision={2}
                      valueStyle={{ color: statusColor(StoreCompare.EarningPerAreaSequentialValue), fontSize: 14 }}
                      prefix={statusIcon(StoreCompare.EarningPerAreaSequentialValue)}
                      suffix="%"
                    />
                  </div>
                  <div className={styles.statistic_list}>
                    <Statistic
                      title="会员占比"
                      value={StoreCompare.CustomerSaleAmtPercent}
                      precision={2}
                      suffix="%"
                    />
                    <Statistic
                      value={statusNum(StoreCompare.CustomerSaleAmtSequentialValue)}
                      precision={2}
                      valueStyle={{ color: statusColor(StoreCompare.CustomerSaleAmtSequentialValue), fontSize: 14 }}
                      prefix={statusIcon(StoreCompare.CustomerSaleAmtSequentialValue)}
                      suffix="%"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row gutter={40}>
              <Col span={12} >
                <div className={styles.chart_item}>
                  <div className={styles.chart_list_title}>
                    <div className={styles.list_title_text}>
                      店铺销售分析
                      <i className={styles['border-top']}/>
                      <i className={styles['border-oblique']}/>
                    </div>
                  </div>
                  <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                    <Recharts color={["#ff8160", "#a57eec", "#ffda6d", "#0fecf2"]}>
                      <Tooltip
                        trigger="axis"
                        extraCssText={config.dataExtraCssText}
                      >
                        <AxisPointer type="line" />
                      </Tooltip>
                      <Grid left="10%" top="20%" bottom="12%" right="4%" />
                      <Legend top="0" x='right' icon="rect" itemWidth={9} itemHeight={9}>
                        <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
                      </Legend>
                      <XAxis type="category" data={StoreSale.SaleYearMonth}>
                        <SplitLine show={false} />
                        <AxisTick show={false} />

                        <AxisLine>
                          <LineStyle color="#fff"/>
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                      </XAxis>
                      <YAxis type="value" name="金额（万元）" min={0}>
                        <AxisLine>
                          <LineStyle color="#fff" />
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <NameTextStyle color="#fff" fontSize={10}/>
                      </YAxis>
                      <Series z={4} name="业态平均" type="line" symbolSize={0} smooth={true} data={StoreSale.OperationTypeSaleAvg} />
                      <Series z={3} name="项目平均" type="line" symbolSize={0} smooth={true} data={StoreSale.MallSaleAvg} />
                      <Series z={2} barWidth={6} barGap="-100%" name="会员销售" type="bar" data={StoreSale.CustomerSaleAvg} />
                      <Series z={1} barWidth={6} barGap="-100%" name="非会员销售" type="bar" data={StoreSale.NonCustomerSaleAvg} />
                    </Recharts>
                  </div>
                </div>
              </Col>
              <Col span={12} >
                <div className={styles.chart_item}>
                  <div className={styles.chart_list_title}>
                    <div className={styles.list_title_text}>
                      收益分析
                      <i className={styles['border-top']}/>
                      <i className={styles['border-oblique']}/>
                    </div>
                  </div>
                  <div className={styles.chart_list_border + ' ' + styles.slider_four_corner_border}>
                    <Recharts color={["#a57eec","#ffda6d","#0fecf2"]}>
                      <Tooltip
                        trigger="axis"
                        extraCssText={config.dataExtraCssText}
                      >
                        <AxisPointer type="line" />
                      </Tooltip>
                      <Grid left="10%" top="20%" bottom="12%" right="4%" />
                      <Legend top="0" x='right' icon="rect" itemWidth={9} itemHeight={9}>
                        <TextStyle color="#fff" fontSize={12} padding={[4,0,0,0]} />
                      </Legend>
                      <XAxis type="category" data={StoreSequential.SaleYearMonth}>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <AxisLine>
                          <LineStyle color="#fff"/>
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                      </XAxis>
                      <YAxis type="value" name="金额（元）" min={0}>
                        <AxisLine>
                          <LineStyle color="#fff" />
                        </AxisLine>
                        <AxisLabel color="#fff" fontSize={10}/>
                        <SplitLine show={false} />
                        <AxisTick show={false} />
                        <NameTextStyle color="#fff" fontSize={10}/>
                      </YAxis>
                      <Series z={3} name="业态平均" type="line" symbolSize={0} smooth={true} data={StoreSequential.OperationTypeEarningAvg} />
                      <Series z={2} symbolSize={0} smooth={true} name="项目平均" type="line" data={StoreSequential.MallEarningAvg} />
                      <Series z={1} barWidth={6} barGap="-100%" name="收益额" type="bar" data={StoreSequential.StoreEarning} />
                    </Recharts>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default Trend
