import React, { Fragment, Component } from 'react'
import styles from './one.less'
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO} from 'react-svg-pan-zoom';
import floorOne from './json/one';
import Modal from '../modal'
import _ from 'lodash'
import moment from 'moment'
// import { filterData } from 'utils'
import {connect} from 'dva';
import PropTypes from 'prop-types';
// import { shallowEqualImmutable } from 'react-immutable-render-mixin';

const { path, polygon, rect } = floorOne;
@connect(({globalData, data}) => ({globalData, data}))
class One extends Component {
  Viewer = null;
  wrapper = null;
  svgwarp = null;
  state = {
    tool: "auto",
    value: INITIAL_VALUE,
    width: 800,
    height: 544,
    visible: false,
  }

  componentDidMount() {
    this.Viewer.fitToViewer("center", "center");
    const width = this.wrapper.clientWidth
    const height = this.wrapper.clientHeight
    this.setState({width, height})
  }

  changeTool(nextTool) {
    this.setState({tool: nextTool})
  }

  changeValue(nextValue) {
    // console.log("nextValue", nextValue)
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
    const { dispatch, globalData: { StartDate, EndDate }} = this.props;
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
      this.setState({visible: true});
    }
  }

  handleCancel = (e) => {
    this.setState({ visible: false });
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
      currentKey,
      } = this.props;
    let selectPath = [];
    let selectPolygon = [];
    let selectRect = [];
    // let unSelectPath = [];
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
    // unSelectPath = filterData(path, selectPath)
    // console.log("我被渲染了一次")
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
            <svg width={510} height={626} viewBox="0 0 507.3 626" className={styles.svg}>
              <g className="no">
                <path className={styles.st0} d="M507.3,81.3L480.8,0.8h-216c0,0-56.1-9-97.1,31.7c-40.9,40.7-40.9,83.5-40.9,83.5s-0.7,58-17.8,99.3
		c-13.6,32.9-50.1,65.4-67.9,79.9c-7.7,6.3-15.2,13.1-22.4,20.5L0,335.1V425l28.2,54.6v127.7c0,10.4,6.5,18.7,14.5,18.7h346l30.3-30
		l2.6,1.1c1.2,0.5,2.5,0.2,3.5-0.8l51.9-52.9c1.4-1.4,1.8-3.9,1.1-5.9l-0.6-1.6l29.8-29.5V81.3L507.3,81.3z M492,489.9l-0.7,6.3
		c-0.9,8.6-4.4,16.2-9.9,21.6l-80.2,81.6c-4,3.9-8.8,6.2-13.8,6.8l-8.1,0.9H54.2c-7.7,0-14.1-8.2-14.1-18.1l0.8-110.7L12,425.9
		v-74.4l17.8-18.3c6.7-6.8,21-19.3,21-19.4l0.1-0.1H100l0.2-45l0.1-0.1c0.2-0.3,19.5-30.7,24.4-42.6c15.9-38.4,15.5-94.8,15.5-95.3
		c0-0.4,0.4-41.1,38.6-79.1c38.2-37.9,84-34.1,84.4-34h203.5l0.1,0.3L492,93.8V489.9z"/>
                <path className={styles.st0} d="M263.3,18.7c-0.5,0-46-3.9-83.9,33.8c-37.9,37.6-38.3,77.8-38.3,78.2c0,0.6,0.4,57.2-15.6,95.8
		c-4.9,11.6-23,40.3-24.4,42.6l-0.2,45.6H51.3c-1.3,1.1-14.6,12.6-20.9,19.2l-17.5,18v73.5l28.9,52.5L40.9,589
		c0,9.5,5.9,17.1,13.2,17.1h325.1l8.1-0.9c4.9-0.6,9.5-2.9,13.4-6.6l80.2-81.6c5.3-5.2,8.7-12.6,9.6-20.9l0.7-6.2V94.1l-24.9-75.3
		L263.3,18.7L263.3,18.7z M121.3,469.2l-9.2-15v-10.6h64.6c0,0,2.6,16.8,7.8,25.6H121.3z M342.3,437.5c0,0-1.4,13.1-5.6,19
		c-4.2,5.8-16.4,10.5-16.4,10.5h-26.5h-23h-23.7c0,0-12-3.1-17.3-9.7c-5.3-6.7-8.8-24.5-3-33.7l8.9-16.2c0,0,32.1-57.8,83.2-42.8
		c22,6.4,23.3,36.4,23.3,36.4v36.5L342.3,437.5L342.3,437.5z M325.6,316.5c0.2,4.6-2.7,8.4-6.2,8.4h-25.8c-3.9,0-6.8-4.6-6.2-9.5
		c0,0,5.4-20.7,7-31.2s2.1-33.6,2.1-33.6c0.6-3.9,3.1-6.6,6.2-6.6h15c3.4,0,6.1,3.5,6.2,7.7c0,0-0.7,24.6-0.9,31.1
		C322.7,289.3,325.6,316.5,325.6,316.5z M346.6,107.9c-2.6,11-7.9,32.6-9.4,38.6c-2,8.3-6.9,34.8-6.9,34.8c-0.7,3.1-2.8,5.2-5.3,5.4
		l-23.5,1.2c-3,0.2-5.6-2.4-6.2-6.2c0,0-2.6-16.9-7.1-35.3c-4.4-18.3-11.1-37.3-11.1-37.3c-1.2-3.8,1-7.8,4.1-7.8h55.6h6.2
		C345.5,101.4,347.3,104.7,346.6,107.9z"/>
              </g>
              {
                path.map((_, i) => {
                  return <g key={i} fill="#FFF">
                    <path
                      d={_.path.d}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >
                      { EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}
                    </text>
                    <text
                      transform={_.doortext.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >
                      { EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }
                    </text>
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
                    >
                      { EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : '' }
                    </text>
                    <text
                      transform={_.doortext.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >
                      { EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }
                    </text>
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
                      // fill={`${currentKey ? '#1f204d' : '#2a2d65'}`}
                      fill={`${ currentKey ? currentKey === '356' ? '#2a2d65'  : '#1f204d' : '#2a2d65'}`}
                    />
                    <text
                      transform={_.doorNum.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >
                      { EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : '' }
                    </text>
                    <text
                      transform={_.doortext.transform}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >
                      { EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }
                    </text>
                  </g>
                })
              }
              {
                selectPath.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <path
                      className="st1"
                      d={_.d}
                      style={{cursor: 'pointer'}}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                      data-degreeid={_.DegreeID}
                    />
                    <text
                      transform={_.numTrans}
                      fill={_.fillText}
                    >
                      { DefaultStoreIsShowDoorNum === 1 ? _.num : ''}
                    </text>
                    <text
                      transform={_.textTrans}
                      fill={_.fillText}
                    >
                      { DefaultStoreIsShowStoreName === 1 ? _.text : ''}
                    </text>
                  </g>
                })
              }
              {
                selectPolygon.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <polygon
                      style={{cursor: 'pointer'}}
                      points={_.points}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                      data-degreeid={_.DegreeID}
                    />
                    <text
                      transform={_.numTrans}
                      fill={_.fillText}
                    >
                      { DefaultStoreIsShowDoorNum === 1 ? _.num : ''}
                    </text>
                    <text
                      transform={_.textTrans}
                      fill={_.fillText}
                    >
                      { DefaultStoreIsShowStoreName === 1 ? _.text : ''}
                    </text>
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
                      data-degreeid={_.DegreeID}
                      style={{cursor: 'pointer'}}
                    />
                    <text
                      transform={_.numTrans}
                      fill={_.fillText}
                    >
                      { DefaultStoreIsShowDoorNum === 1 ? _.num : ''}
                    </text>
                    <text
                      transform={_.textTrans}
                      fill={_.fillText}
                      className="st2 st3 st4"
                    >
                      { DefaultStoreIsShowStoreName === 1 ? _.text : ''}
                    </text>
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

One.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  DefaultStoreIsShowDoorNum: PropTypes.number,
  DefaultStoreIsShowStoreName: PropTypes.number,
  EmptyStoreIsShowDoorNum: PropTypes.number,
  EmptyStoreIsShowOther: PropTypes.number,
  EmptyStoreShowOtherInfo: PropTypes.string,
}

export default One
