import React, {Component, Fragment} from 'react'
import styles from './two.less'
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO} from 'react-svg-pan-zoom';
import floorTwo from './json/two';
import {connect} from 'dva'
import moment from 'moment';
import Modal from '../modal'
import PropTypes from 'prop-types'
import _ from 'lodash'

@connect(({globalData, data}) => ({globalData, data}))
class Two extends Component {
  Viewer = null;
  wrapper = React.createRef();;
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
    const width = this.wrapper.current.clientWidth
    const height = this.wrapper.current.clientHeight
    // this.setState({width, height})
    this.setState(() => ({
      width, height
    }), () => {
      this.Viewer && this.Viewer.fitSelection(-(width/2 - 250), 0, 500, 626)
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
    const { path, polygon, rect } = floorTwo;

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
          // selectPath.push({
          //   d: ele.path.d,
          //   numTrans: ele.doorNum.transform,
          //   num: ele.doorNum.num,
          //   textTrans: ele.doortext.transform,
          //   text: item.StoreName,
          //   fillcolor: item.DegreeColor,
          //   storeid: item.StoreId,
          //   DegreeID: item.DegreeID,
          // })
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
          //   storeid: item.StoreId,
          //   DegreeID: item.DegreeID,
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
              fillText: "#fff",
              text: item.StoreName,
              fillcolor: item.DegreeColor,
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
          // selectRect.push({
          //   x: ele.rect.x,
          //   y: ele.rect.y,
          //   width: ele.rect.width,
          //   height: ele.rect.height,
          //   numTrans: ele.doorNum.transform,
          //   num: ele.doorNum.num,
          //   textTrans: ele.doortext.transform,
          //   text: item.StoreName,
          //   fillcolor: item.DegreeColor,
          //   storeid: item.StoreId,
          //   DegreeID: item.DegreeID,
          // })
        }
      })
    });
    // console.log("我被渲染了一次")
    return (
      <Fragment>
        <div className={styles.wrapper} ref={this.wrapper}>
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
            <svg width={500} height={626} viewBox="0 0 504.1 621.7" className={styles.svg}>
              <g className="no">
                <path className={styles.st0} d="M504.1,80.7L504.1,80.7L477.6,0.8H263.1c0,0-55.7-8.9-96.4,31.5s-40.7,83-40.7,83s-0.7,57.6-17.8,98.7
		c-13.6,32.7-49.8,65-67.4,79.3c-7.7,6.2-15.1,13.1-22.2,20.4L0,332.8V422l28,54.2V603c0,10.2,6.4,18.6,14.4,18.6h343.8l30.1-29.7
		l2.6,1.1c1.2,0.5,2.5,0.2,3.5-0.8l51.6-52.6c1.3-1.4,1.8-3.8,1.1-5.8l-0.6-1.6l29.6-29.4V80.7z M488.8,486.5l-0.2,0.2l-28.4,28.5
		l0.4,1.1c0.8,2.2,0.3,4.6-1.1,6.1L407.8,574c-1,1-2.4,1.3-3.6,0.8l-2.2-0.9l-29.1,28.9h-319c-7.7,0-13.9-8.1-13.9-18l0.8-109.9
		l-28.8-52v-53.1l17.8-18.2c3.2-3.3,6.7-6.2,10-9.1c3.6-3.2,7.4-6.4,10.9-10c20.2-21.4,61.1-78.4,73.4-107.9
		c15.8-38.1,15.4-94,15.4-94.7c0-0.4,0.5-40.8,38.4-78.5s83.4-33.8,83.8-33.8h202.2l25,75.7L488.8,486.5L488.8,486.5z"/>
                <path className={styles.st0} d="M261.6,18.6c-0.5,0-45.6-3.9-83.4,33.6c-37.6,37.4-38.1,77.2-38.1,77.7s0.5,56.9-15.5,95.1
		c-12.3,29.7-53.3,86.8-73.5,108.2c-3.5,3.7-7.3,7-10.9,10.1c-3.3,2.9-6.8,5.8-10,9l-17.4,17.8v52.2l28.8,52l-0.8,110.3
		c0,9.3,5.9,17,13.2,17h318.7l29.2-29l2.7,1.1c1,0.4,2.1,0.2,2.9-0.6l51.7-51.5c1.2-1.2,1.5-3.3,1-4.9l-0.7-1.9L488,486V93.3
		l-24.7-74.8L261.6,18.6z M120.6,465.9l-9.1-14.9v-10.6h64.2c0,0,2.6,16.7,7.8,25.4h-62.9V465.9z M340.2,434.5L340.2,434.5
		c-0.1,0-1.5,13.1-5.6,18.9c-4.1,5.7-16.2,10.3-16.2,10.3H292h-22.8h-23.5c0,0-11.9-3-17.2-9.6c-5.3-6.7-8.7-24.3-3-33.5l8.9-16.1
		c0,0,31.9-57.4,82.7-42.5c21.8,6.4,23.2,36.1,23.2,36.1v36.4L340.2,434.5L340.2,434.5z M323.5,314.2c0.2,4.5-2.7,8.3-6.2,8.3h-25.7
		c-3.9,0-6.8-4.5-6.1-9.4c0,0,5.4-20.6,6.9-30.9s2.1-33.4,2.1-33.4c0.6-3.8,3.1-6.6,6.1-6.6h14.8c3.3,0,6.1,3.4,6.2,7.7
		c0,0-0.6,24.4-1,30.8C320.3,287.2,323.5,314.2,323.5,314.2z M344.4,107.2c-2.7,10.9-7.9,32.4-9.4,38.3c-2,8.2-6.8,34.6-6.8,34.6
		c-0.7,3.1-2.8,5.2-5.3,5.3l-23.4,1.2c-2.9,0.2-5.5-2.5-6.2-6.1c0,0-2.6-16.8-7-35s-11.1-37-11.1-37c-1.1-3.8,1-7.8,4.1-7.8h55.2
		h6.1C343.4,100.7,345.2,104,344.4,107.2z"/>
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
                    <text transform={_.numTrans} data-storeid={_.storeid} fill={_.fillText}>{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text transform={_.textTrans} data-storeid={_.storeid} fill={_.fillText}>{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
                  </g>
                })
              }
              {
                selectPolygon.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <polygon
                      points={_.points}
                      style={{cursor: 'pointer'}}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                    />
                    <text
                      transform={_.numTrans}
                      fill={_.fillText}
                      data-storeid={_.storeid}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      transform={_.textTrans}
                      data-storeid={_.storeid}
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
                      fill={_.fillText}>{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      transform={_.textTrans}
                      data-storeid={_.storeid}
                      fill={_.fillText}
                    >{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
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

Two.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  DefaultStoreIsShowDoorNum: PropTypes.number,
  DefaultStoreIsShowStoreName: PropTypes.number,
  EmptyStoreIsShowDoorNum: PropTypes.number,
  EmptyStoreIsShowOther: PropTypes.number,
  EmptyStoreShowOtherInfo: PropTypes.string,
}

export default Two
