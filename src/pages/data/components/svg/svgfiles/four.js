import React, {Component, Fragment} from 'react'
import styles from './four.less'
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO} from 'react-svg-pan-zoom';
import Modal from '../modal'
import floorFour from './json/four';
import {connect} from 'dva'
import moment from 'moment'
import PropTypes from 'prop-types'
import _ from 'lodash';
const { path, polygon, rect } = floorFour;

@connect(({globalData, data}) => ({globalData, data}))
class Four extends Component {
  Viewer = null;
  wrapper = null;
  svgwarp = null;
  state = {
    tool: "auto",
    value: INITIAL_VALUE,
    width: 800,
    height: 544,
    visible: false
  }

  componentDidMount() {
    // this.Viewer.fitToViewer("center", "center");
    const width = this.wrapper.clientWidth
    const height = this.wrapper.clientHeight
    // this.setState({width, height})
    this.setState(() => ({
      width, height
    }), () => {
      this.Viewer && this.Viewer.fitSelection(-(width/2 - 130), 0, 750, 930)
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
    const Start = moment(StartDate).format('YYYY-MM');
    const End = moment(EndDate).format('YYYY-MM');
    const payload = { StartDate: Start, EndDate: End, StoreID };
    const IncomeForm = { StartDate: moment().subtract(12, 'months').format('YYYY-MM'), EndDate: moment().subtract(1, 'months').format('YYYY-MM'), StoreID }
    if(StoreID){
      //店铺基本信息
      dispatch({type: 'data/GetStoreInfo', payload});
      dispatch({type: 'data/GetStoreCompareInfo', payload});
      dispatch({type: 'data/GetStoreSale', payload});
      dispatch({type: 'data/GetStoreSequential', payload: IncomeForm});
      this.setState({visible: true, StoreID});
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
      currentKey
    } = this.props;

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
          }else {
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
            <svg  width={750} height={930} viewBox="0 0 750.9 924.6">
              <g className="no">
                <path className={styles.svg_bg} d="M392.7,24.6c-0.8,0-76.5-2.7-133.3,53.7c-25.3,25-35.2,50.7-43.1,71.3c-0.6,1.4-1.1,2.7-1.5,4.1
			c-6.3,16-9.7,49.1-8.7,68.7c1.4,30.4,5.5,122.5-14.5,172.1c-19.2,46.8-59.3,83.6-119.1,109.1c-22.7,9.6-55.6,42.9-55.6,73.1v55.1
			l41.3,77v165.4c0,14.3,19.7,29.6,30.3,29.6h465.9l42.3-43.5l3.5,1.7c3.5,1.7,7.6,0.9,10.7-1.8l77.7-72.2c4.3-4,6-11.3,4.1-17.5
			l-1.5-5.2l39.9-40.9V136.7L689.4,23.8L392.7,24.6z M506.7,645.8c0,0-2.1,19.5-8.3,28.1c-6.1,8.5-24.2,15.4-24.2,15.4H435h-34h-35
			c0,0-17.7-4.4-25.6-14.3c-7.9-9.9-13-36.2-4.5-49.9l13.2-24c0,0,47.6-85.4,123.1-63.3c32.5,9.5,34.6,53.7,34.6,53.7L506.7,645.8
			L506.7,645.8z M481.9,466.7c0.2,6.7-4,12.4-9.2,12.4h-38.3c-5.8,0-10.2-6.7-9.1-14c0,0,8-30.7,10.3-46.1
			c2.2-15.4,3.1-49.7,3.1-49.7c0.8-5.6,4.6-9.8,9.1-9.8h22.1c5,0,9.1,5,9.2,11.4c0,0-0.9,36.3-1.4,45.9S481.9,466.7,481.9,466.7z
			 M513,158.4c-3.9,16.2-11.7,48.2-13.8,57.2c-3,12.2-10.2,51.6-10.2,51.6c-1.1,4.6-4.1,7.8-7.9,7.9l-34.8,1.8
			c-4.4,0.3-8.3-3.7-9.2-9.2c0,0-3.9-25-10.4-52.2s-16.5-55.1-16.5-55.1c-1.7-5.6,1.5-11.6,6.1-11.6h82.3h9.1
			C511.5,148.8,514.2,153.6,513,158.4z"/>
                <path className={styles.svg_bg} d="M750.9,123.6L702.1,0L394.3,0.8c0,0-83-5.6-143.7,54.5c-28.5,28.2-44,56-52.4,77.5c-7,17.5-10,37.2-9.1,57.1
			c1.9,41,4.5,148-15.5,197c-13.3,32.8-24.1,40.4-101.9,90.3c-22.6,14.3-69.4,45-69.4,77.4L0,635l41.7,79.2v182.6
			c0,15.3,9.6,27.8,21.5,27.8h512.2l44.9-44.2l3.9,1.7c1.8,0.8,3.7,0.3,5.2-1.2l76.9-78.3c2-2.1,2.7-5.6,1.7-8.7l-0.8-2.4l43.9-43.8
			V123.6H750.9z M732.1,724.7l-0.2,0.2l-39.6,40.4l1.3,4.3c2.1,7,0.2,15-4.5,19.4l-77.6,72.3c-3.4,3.2-7.8,4-11.8,2.1l-3-1.4
			l-42.1,43.3H88.4c-11.3,0-31.5-15.7-31.5-31.1V709.1l-41.3-77v-55.5c0-30.8,33.4-64.7,56.4-74.5c59.6-25.3,99.4-61.9,118.3-108.5
			c20-49.1,15.8-141,14.4-171.2c-0.9-19.8,2.6-53.1,9-69.4c0.5-1.4,1.1-2.7,1.5-4.1c7.6-19.5,17.9-46.4,43.4-71.7
			c57.1-56.9,133.2-54.3,134-54.2L690,22.4l0.1,0.5L732,136.6L732.1,724.7L732.1,724.7z"/>
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
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}</text>
                    <text
                      transform={_.doortext.transform}
                      className={styles.svg_text_font}
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
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}</text>
                    <text
                      transform={_.doortext.transform}
                      className={styles.svg_text_font}
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
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowDoorNum === 1 ? _.doorNum.num : ''}</text>
                    <text
                      transform={_.doortext.transform}
                      className={styles.svg_text_font}
                      fill={`${currentKey ? currentKey === '356' ? '#FFF' : '#7a7c99' : '#fff'}`}
                    >{ EmptyStoreIsShowOther === 1 ? EmptyStoreShowOtherInfo : '' }</text>
                  </g>
                })
              }
              {
                selectPath.map((_, i) => {
                  return <g key={i} fill="#fff">
                    <path
                      d={_.d}
                      style={{cursor: 'pointer'}}
                      fill={_.fillcolor || '#2a2d65'}
                      data-storeid={_.storeid}
                      data-degreeid={_.DegreeID}
                    />
                    <text
                      data-storeid={_.storeid}
                      transform={_.numTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      data-storeid={_.storeid}
                      transform={_.textTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
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
                      data-degreeid={_.DegreeID}
                    />
                    <text
                      data-storeid={_.storeid}
                      transform={_.numTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      data-storeid={_.storeid}
                      transform={_.textTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowStoreName === 1 ? _.text : ''}</text>
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
                      data-storeid={_.storeid}
                      transform={_.numTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
                    >{ DefaultStoreIsShowDoorNum === 1 ? _.num : ''}</text>
                    <text
                      data-storeid={_.storeid}
                      transform={_.textTrans}
                      fill={_.fillText}
                      className={styles.svg_text_font}
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

Four.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  DefaultStoreIsShowDoorNum: PropTypes.number,
  DefaultStoreIsShowStoreName: PropTypes.number,
  EmptyStoreIsShowDoorNum: PropTypes.number,
  EmptyStoreIsShowOther: PropTypes.number,
  EmptyStoreShowOtherInfo: PropTypes.string,
}

export default Four
