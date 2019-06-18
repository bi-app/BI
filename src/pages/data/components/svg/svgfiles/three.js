import React, {Component, Fragment} from 'react'
import styles from './three.less'
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO} from 'react-svg-pan-zoom';
import floorThree from './json/three';
import {connect} from 'dva';
import moment from 'moment';
import Modal from '../modal';
import PropTypes from 'prop-types';
import _ from 'lodash';

@connect(({globalData, data}) => ({globalData, data}))
class Three extends Component {
  Viewer = null;
  wrapper = null;
  svgwarp = null;
  state = {
    tool: "auto",
    value: INITIAL_VALUE,
    width: 800,
    height: 544,
    visible: false,
    StoreID: ''
  }

  componentDidMount() {
    // this.Viewer.fitToViewer("center", "center");
    const width = this.wrapper.clientWidth
    const height = this.wrapper.clientHeight
    // this.setState({width, height})
    this.setState(() => ({
      width, height
    }), () => {
      this.Viewer && this.Viewer.fitSelection(-(width/2 - 250), 0, 536, 650)
    });
  }

  changeTool(nextTool) {
    this.setState({tool: nextTool})
  }

  changeValue(nextValue) {
    this.setState({value: nextValue})
  }

  fitToViewer() {
    this.Viewer.fitToViewer()
  }

  fitSelection() {
    this.Viewer.fitSelection(40, 40, 200, 200)
  }

  zoomOnViewerCenter() {
    this.Viewer.zoomOnViewerCenter(1)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.value !== nextState.value || this.state.visible !== nextState.visible || this.props.GetStoreSale !== nextProps.GetStoreSale || this.props.currentKey !== nextProps.currentKey) {
      return true
    }
    return false
  }

  _getStoreInfo = (e) => {
    const StoreID = e.originalEvent.target.getAttribute("data-storeid");
    const { dispatch, globalData: {rangeDate, StartDate, EndDate}} = this.props;
    const Start = moment(StartDate).format('YYYY-MM')
    const End = moment(EndDate).format('YYYY-MM')
    const payload = { StartDate: Start, EndDate: End, StoreID }
    const IncomeForm = { StartDate: moment().subtract(12, 'months').format('YYYY-MM'), EndDate: moment().subtract(1, 'months').format('YYYY-MM'), StoreID }
    if(StoreID){
      //店铺基本信息
      dispatch({type: 'data/GetStoreInfo', payload})
      dispatch({type: 'data/GetStoreCompareInfo', payload})
      dispatch({type: 'data/GetStoreSale', payload})
      dispatch({type: 'data/GetStoreSequential', payload: IncomeForm})
      this.setState({visible: true, StoreID});
    }
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { width, height, visible } = this.state;
    const {
      GetStoreSale,
      DefaultStoreIsShowDoorNum,
      DefaultStoreIsShowStoreName,
      EmptyStoreIsShowDoorNum,
      EmptyStoreIsShowOther,
      EmptyStoreShowOtherInfo,
      currentKey
    } = this.props;
    const { path, polygon, rect } = floorThree;

    let selectPath = [];
    let selectPolygon = [];
    let selectRect = [];
    _.forEach(GetStoreSale, (item, index) => {
      _.forEach(path, (ele, i) => {
        if(ele.doorNum.num === item.BIStoreLocationNum){
          if(item.DegreeID && Number(currentKey) === Number(item.DegreeID)){
            selectPath.push({
              d: ele.path.d,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: item.DegreeColor,
              fillText: "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }else {
            selectPath.push({
              d: ele.path.d,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: currentKey ? '#1f204d' : item.DegreeColor,
              fillText: currentKey ? '#7a7c99' : "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }
        }
      })
      _.forEach(polygon, (ele, i) => {
        if(ele.doorNum.num === item.BIStoreLocationNum){
          if(item.DegreeID && Number(currentKey) === Number(item.DegreeID)) {
            selectPolygon.push({
              points: ele.polygon.points,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: item.DegreeColor,
              fillText: "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          } else {
            selectPolygon.push({
              points: ele.polygon.points,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: currentKey ? '#1f204d' : item.DegreeColor,
              fillText: currentKey ? '#7a7c99' : "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }

          // selectPolygon.push({
          //   points: ele.polygon.points,
          //   numTrans: ele.doorNum.transform,
          //   num: ele.doorNum.num,
          //   textTrans: ele.doortext.transform,
          //   text: item.StoreName,
          //   fillcolor: item.DegreeColor,
          //   storeid: item.StoreId
          // })
        }
      })
      _.forEach(rect, (ele, i) => {
        if(ele.doorNum.num === item.BIStoreLocationNum){
          if( item.DegreeID && Number(currentKey) === Number(item.DegreeID)){
            selectRect.push({
              x: ele.rect.x,
              y: ele.rect.y,
              width: ele.rect.width,
              height: ele.rect.height,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: item.DegreeColor,
              fillText: "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }else {
            selectRect.push({
              x: ele.rect.x,
              y: ele.rect.y,
              width: ele.rect.width,
              height: ele.rect.height,
              numTrans: ele.doorNum.transform,
              num: ele.doorNum.num,
              textTrans: ele.doortext.transform,
              text: item.StoreName,
              fillcolor: currentKey ? '#1f204d' : item.DegreeColor,
              fillText: currentKey ? '#7a7c99' : "#fff",
              storeid: item.StoreId,
              DegreeID: item.DegreeID,
            })
          }
        }
      })
    });
    return (
      <Fragment>
        <div className={styles.wrapper} ref={_ => this.wrapper = _}>
          <ReactSVGPanZoom
            width={width}
            height={height}
            background={"#0C0028"}
            SVGBackground={"#0C0028"}
            ref={Viewer => this.Viewer = Viewer}
            tool={this.state.tool}
            detectAutoPan={false}
            toolbarProps={{position: 'none'}}
            miniatureProps={{position: 'none'}}
            onChangeTool={tool => this.changeTool(tool)}
            value={this.state.value}
            onChangeValue={value => this.changeValue(value)}
            onClick={this._getStoreInfo}
          >
            <svg width={536} height={650} viewBox="0 0 536.2 657" className={styles.svg}>
              <g>
                <path className={styles.st0} d="M536.2,87.8L501.3,0L281.6,0.4c0,0-59.3-4-102.6,38.7c-20.4,20.1-31.4,39.8-37.5,55.1
	c-5,12.5-7.2,26.5-6.5,40.5c1.4,29.2,3.3,105.2-11.1,140c-9.5,23.3-17.2,28.7-72.8,64.2c-16,10.3-49.5,32-49.5,55L0,451.2l29.8,56.3
	v129.8c0,10.8,6.9,19.7,15.3,19.7h365.8l32-31.5l2.7,1.1c1.3,0.6,2.7,0.2,3.7-0.9l54.9-55.6c1.5-1.4,1.9-4.1,1.1-6.2l-0.6-1.8
	l31.4-31L536.2,87.8L536.2,87.8z M522.8,515l-0.2,0.1l-28.2,28.7l0.9,3c1.5,5,0.2,10.7-3.2,13.8l-55.5,51.5
	c-2.4,2.2-5.6,2.9-8.4,1.4l-2.1-1L396,643.2H63.1c-8.1,0-22.6-11.2-22.6-22.1V503.9L11,449.1v-39.4c0-21.9,23.9-46,40.3-52.9
	c42.5-18,71-44,84.5-77.1c14.3-34.9,11.3-100.2,10.3-121.6c-0.6-14,1.8-37.8,6.4-49.4c0.3-1,0.8-1.9,1.1-2.9
	c5.4-13.9,12.9-33,31-50.9c40.9-40.4,95.3-38.4,95.8-38.4l212.3-0.4l0.1,0.3l30,80.8L522.8,515L522.8,515z"/>
                <path className={styles.st0} d="M280.4,17.5c-0.6,0-54.6-2-95.2,38.1c-18,17.8-25.1,36-30.8,50.6c-0.3,1-0.8,2-1.1,2.9
	c-4.5,11.4-6.9,34.9-6.3,48.8c0.9,21.5,4,87.1-10.4,122.3c-13.7,33.4-42.3,59.6-85,77.7c-16.2,6.8-39.8,30.5-39.8,51.9v39.1
	l29.6,54.8v117.6c0,10.3,14.1,21,21.7,21h332.6l30.2-30.9l2.6,1.2c2.6,1.2,5.4,0.7,7.6-1.3l55.4-51.4c3.1-2.9,4.3-8,2.9-12.5
	l-1.1-3.8l0.3-0.2l28.3-28.8V97.1L492.2,17L280.4,17.5z M361.8,458.9c0,0-1.5,13.8-5.9,19.9c-4.5,6.1-17.3,10.9-17.3,10.9h-27.9
	h-24.3h-25c0,0-12.6-3.2-18.3-10.2c-5.6-7.1-9.3-25.6-3.3-35.5l9.4-17c0,0,33.9-60.8,87.9-45c23.2,6.7,24.7,38.2,24.7,38.2
	L361.8,458.9L361.8,458.9z M344.1,331.7c0.2,4.8-2.8,8.8-6.6,8.8h-27.2c-4.1,0-7.2-4.8-6.5-9.9c0,0,5.8-21.8,7.4-32.8
	s2.1-35.4,2.1-35.4c0.6-4.1,3.3-7,6.5-7h15.8c3.5,0,6.4,3.6,6.6,8.2c0,0-0.7,25.9-0.9,32.6C340.9,302.9,344.1,331.7,344.1,331.7z
	 M366.3,112.5c-2.8,11.5-8.3,34.2-9.9,40.7c-2.1,8.6-7.3,36.7-7.3,36.7c-0.8,3.2-3,5.5-5.6,5.6l-24.9,1.3c-3.2,0.1-5.9-2.7-6.6-6.5
	c0,0-2.7-17.8-7.5-37.1c-4.6-19.3-11.9-39.1-11.9-39.1c-1.2-4,1.1-8.3,4.4-8.3h58.8h6.5C365.2,105.7,367.1,109.2,366.3,112.5z"/>
              </g>
              {
                path.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <path
                      d={_.path.d}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}</text>
                    <text
                      transform={_.doortext.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }</text>
                  </g>
                })
              }
              {
                polygon.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <polygon
                      points={_.polygon.points}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}</text>
                    <text
                      transform={_.doortext.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }</text>
                  </g>
                })
              }
              {
                rect.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <rect
                      x={_.rect.x}
                      y={_.rect.y}
                      width={_.rect.width}
                      height={_.rect.height}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}</text>
                    <text
                      transform={_.doortext.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }</text>
                  </g>
                })
              }
              {
                selectPath.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <path d={_.d} fill={_.fillcolor || '#2a2d65'} style={{cursor: 'pointer'}} data-storeid={_.storeid} />
                    <text
                      transform={_.numTrans}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                      fill={_.fillText}>{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      transform={_.textTrans}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                      fill={_.fillText}>{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
                  </g>
                })
              }
              {
                selectPolygon.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <polygon points={_.points} style={{cursor: 'pointer'}} fill={_.fillcolor || '#2a2d65'} data-storeid={_.storeid}/>
                    <text
                      transform={_.numTrans}
                      fill={_.fillText}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      transform={_.textTrans}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                      fill={_.fillText}>{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
                  </g>
                })
              }
              {
                selectRect.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <rect
                      x={_.x}
                      y={_.y}
                      width={_.width}
                      height={_.height}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                    />
                    <text
                      transform={_.numTrans}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                      fill={_.fillText}>{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      transform={_.textTrans}
                      data-storeid={_.storeid}
                      style={{cursor: 'pointer'}}
                      fill={_.fillText}>{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
                  </g>
                })
              }
            </svg>
          </ReactSVGPanZoom>
          <Modal
            visible={visible}
            onCancel={this.handleCancel}
            width={1200}
          />
        </div>
      </Fragment>
    )
  }
}

Three.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  DefaultStoreIsShowDoorNum: PropTypes.number,
  DefaultStoreIsShowStoreName: PropTypes.number,
  EmptyStoreIsShowDoorNum: PropTypes.number,
  EmptyStoreIsShowOther: PropTypes.number,
  EmptyStoreShowOtherInfo: PropTypes.string,
}

export default Three
