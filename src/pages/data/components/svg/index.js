import React, {Component, Fragment} from 'react'
import styles from './index.less'
import moment from 'moment'
import {Radio, Empty, Icon} from 'antd';
import MinusOne from './svgfiles/minusOne';
import One from './svgfiles/one';
import Two from './svgfiles/two';
import Three from './svgfiles/three';
import Four from './svgfiles/four';
import {connect} from 'dva'
import styled, { keyframes } from 'styled-components'
import EmptyIma from '@/assets/Empty.svg'
const HlodCont = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

@connect(({app, globalData, data}) => ({app, globalData, data}))
class Svg extends Component {
  state = { currentKey: '' };

  /**楼层切换*/
  _floorChange = (e) => {
    const FloorID = e.target.value;
    const { dispatch, globalData, app } = this.props
    const { rangeDate, StartDate, EndDate } = globalData;
    const { showType } = app;
    const Start = moment(StartDate).format('YYYY-MM');
    const EndD = moment(EndDate).format('YYYY-MM');
    const payload = {StartDate: Start, EndDate: EndD, FloorID};

    dispatch({type: 'globalData/floorChangeSucc', payload: {FloorID}})
    dispatch({type: 'globalData/getTypeIncomeInfo', payload})
    dispatch({type: 'globalData/getTypeSalesInfo', payload})
    dispatch({type: 'globalData/getFloorSale', payload})
    dispatch({type: 'globalData/getFloorTrend', payload})
    // dispatch({ type: 'globalData/getDegreeList', payload: {DegreeType: showType}}) //楼层切换不影响销售状态的变动 只是根据类别切换
    if(showType === '1'){
      dispatch({type: 'globalData/GetStoreSaleByFloorID', payload})
    }else if(showType === '2'){
      dispatch({type: 'globalData/GetStoreEarningByFloorID', payload})
    }
  }
  /**类别切换*/
  _typeChange = (e) => {

    const { dispatch, globalData } = this.props
    const { rangeDate, FloorID, StartDate, EndDate } = globalData;
    const Start = moment(StartDate).format('YYYY-MM');
    const End = moment(EndDate).format('YYYY-MM');
    const showType = e.target.value;
    const payload = {StartDate: Start, EndDate: End, FloorID}
    dispatch({type: 'app/_updateSaleTypeChange', payload: {showType}});
    dispatch({ type: 'globalData/getDegreeList', payload: {DegreeType: showType} })
    if(showType === '1'){
      dispatch({type: 'globalData/GetStoreSaleByFloorID', payload})
    }else if(showType === '2'){
      dispatch({type: 'globalData/GetStoreEarningByFloorID', payload})
    }
    this.setState({currentKey: ''})
  }
  /**点击类别切换楼层状态显示*/
  _typeChangeOnBtn = (e) => {
    const currentKey = e.target.getAttribute("data-degreeid")
    const active = e.target.className;
    if(active) {
      this.setState({currentKey: ''})
    }else {
      this.setState({currentKey});
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.currentKey !== nextState.currentKey ||
      this.props.globalData.GetStoreSale !== nextProps.globalData.GetStoreSale ||
      this.props.globalData.DegreeList !== nextProps.globalData.DegreeList ||
      this.props.globalData.FloorID !== nextProps.globalData.FloorID
    ){
      return true
    }
    return false
  }


  render() {
    /**
     * 这里楼层默认没有设置，写死
     * */
    const {data: { FloorInfoList }, globalData, app} = this.props;
    const { FloorID, DegreeList, GetStoreSale } = globalData;
    const { showType, Biconfig } = app;
    const { currentKey } = this.state;
    const {
      DefaultStoreIsShowDoorNum,
      DefaultStoreIsShowStoreName,
      EmptyStoreIsShowDoorNum,
      EmptyStoreIsShowOther,
      EmptyStoreShowOtherInfo
    } = Biconfig;
    const GetStoreSaleProps = {
      GetStoreSale,
      DefaultStoreIsShowDoorNum,
      DefaultStoreIsShowStoreName,
      EmptyStoreIsShowDoorNum,
      EmptyStoreIsShowOther,
      EmptyStoreShowOtherInfo,
      currentKey,
    };
    // console.log("渲染一次了")
    if(FloorInfoList.length === 0){
      return <HlodCont>
        <Empty image={EmptyIma} description={<span style={{color: '#2880B4', fontSize: 16}}>暂无相关楼层数据</span>} />
      </HlodCont>
    }
    return (
      <Fragment>
        <Radio.Group
          value={showType}
          buttonStyle="solid"
          onChange={this._typeChange}
          className={styles.radio}
          size='large'
        >
          <Radio.Button value="1">销售</Radio.Button>
          <Radio.Button value="2">收益</Radio.Button>
        </Radio.Group>
        <div className={styles.color_list}>
          <ul>
            {
              DegreeList.map((_) => <li
                key={_.DegreeID}
                data-degreeid={_.DegreeID}
                className={currentKey === _.DegreeID ? 'active' : ''}
                onClick={this._typeChangeOnBtn}
              >
                {currentKey === _.DegreeID ? <Icon type="check" /> : null}
                <span
                  className={styles.color_list_warp}
                  style={{background: `${_.ColorValue}`}}
                />
                <span
                  className={styles.color_list_text}
                  style={{color: '#fff'}}
                >
                  {_.DegreeName}
                </span>
              </li>)
            }
            <li
              data-degreeid={'356'}
              className={currentKey === '356' ? 'active' : ''}
              onClick={this._typeChangeOnBtn}
            >
              { currentKey === '356' ? <Icon type="check" /> : null }
              <span className={styles.color_list_warp} style={{background: '#2A2D65'}}/>
              <span className={styles.color_list_text} style={{color: '#fff'}}>空置</span>
            </li>
          </ul>
        </div>
        {FloorID === '262ad27c-44ce-4d2b-ba20-c093b04b5094' ? <MinusOne {...GetStoreSaleProps}/> : null}
        {FloorID === '4fae338e-102e-457c-897c-a0b1d6b79aa3' ? <One {...GetStoreSaleProps}/> : null}
        {FloorID === 'fd8756d2-9925-48ea-b5f6-1d569a5f8844' ? <Two {...GetStoreSaleProps}/> : null}
        {FloorID === '412482f5-39eb-4ef8-beca-f6b6bb14e598' ? <Three {...GetStoreSaleProps}/> : null}
        {FloorID === 'eac6ac5e-ae51-4763-81c8-776219b63619' ? <Four {...GetStoreSaleProps}/> : null}
        <Radio.Group
          className={styles.pagination}
          onChange={this._floorChange}
          value={FloorID}
          buttonStyle="solid"
          size='large'
        >
          {
            FloorInfoList.map((_) => <Radio.Button
              key={_.FloorId}
              data-id={_.FloorName}
              value={_.FloorId}
            >
              {_.FloorName}
            </Radio.Button>
            )
          }
        </Radio.Group>
      </Fragment>
    )
  }
}

export default Svg
