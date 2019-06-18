import React, { Component, Fragment } from 'react'
import style from './liveTrading.less';
import PropTypes from 'prop-types'
import { Ellipsis } from "ant-design-pro";
import { Empty, Carousel } from "antd";
import styled from 'styled-components'
// import * as utils from './raf'
import produce from "immer";
import EmptyIma from 'assets/Empty.svg';
// import _ from 'lodash'
import { Timer } from 'utils/Timer'
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'dva/index';
// import numeral from 'numeral';
const isEqual = require("react-fast-compare");
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css';


//补丁可以较好的兼容支持该特性的浏览器
// utils.raf();
const EmptyWarp = styled.div`
  padding: 24px 0
`;

// @immutableRenderDecorator
// @connect(({ deal }) => ({ deal }))
class LiveTrading extends React.Component {
  domMw = React.createRef();
  Time = null;
  newTimer = null;
  Carousel = null;
  state = {
    livingData: [],
  }

  static getDerivedStateFromProps(props, state) {
    if (props.storesliving.length !== 0 && !isEqual(props.storesliving, state.livingData)) {
      return {
        livingData: props.storesliving
      }
    }
    return null
  }

  shouldComponentUpdate(nextProps, nextState){
    return !isEqual(this.state.livingData, nextState.livingData)
  }

  initialBannerSwiper = () => {
    if(this.bannerSwiper){
      this.bannerSwiper = new Swiper('.swiper-container', {
        updateOnImagesReady : true,
        direction:'vertical',
        slidesPerView: 5, //设置slider容器能够同时显示的slides数量(carousel模式) 默认值为1。
        slidesPerGroup: 5,
        loopedSlides: 65,
        speed: 300,
        observer: true,  //当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
        loopFillGroupWithBlank: true,
        observeParents: true, //将observe应用于Swiper的父元素。当Swiper的父元素变化时，例如window.resize，Swiper更新。
        shortSwipes: false,  // 这个属性后面会说
        slideToClickedSlide: false, //设置为true则点击slide会过渡到这个slide。
        autoplay: {
          delay: 300,
          stopOnLastSlide: true,
          disableOnInteraction:false,
        },
      })
      if(this.bannerSwiper.autoplay.running){
        this.bannerSwiper.autoplay.start();
      }else {
        this.bannerSwiper.autoplay.stop();
      }
      return
    }
    this.bannerSwiper = new Swiper('.swiper-container', {
      updateOnImagesReady : true,
      direction:'vertical',
      slidesPerView: 5, //设置slider容器能够同时显示的slides数量(carousel模式) 默认值为1。
      speed: 300,
      observer: true,  //当改变swiper的样式（例如隐藏/显示）或者修改swiper的子元素时，自动初始化swiper。
      loopFillGroupWithBlank: true,
      observeParents: true, //将observe应用于Swiper的父元素。当Swiper的父元素变化时，例如window.resize，Swiper更新。
      shortSwipes: false,  // 这个属性后面会说
      slideToClickedSlide: false, //设置为true则点击slide会过渡到这个slide。
      autoplay: {
        delay: 300,
        stopOnLastSlide: true,
        disableOnInteraction:false,
      },
    })
  }

  componentDidUpdate(nextProps, nextState, prevState){//setState()结束之后都会自动调用componentDidUpdate()
    this.initialBannerSwiper()
    console.log("更新之前的状态")
  }

  componentWillUnmount() {
    this.newTimer && clearTimeout(this.newTimer);
    if(this.bannerSwiper){
      this.bannerSwiper.detachEvents()
      this.bannerSwiper.destroy()
    }
  }

  render() {
    const { livingData } = this.state;
    let imgHtml = livingData.map((_, index)=>{
      return(
        <div className="swiper-slide"  key={_.ID}>
          <div className={style.live_list}>
            <div className={style.store_img}><img src={_.StoreCoverImg && _.StoreCoverImg} alt=""/></div>
            <div className={style.store_text_label_name}>
              <Ellipsis
                tooltip={{
                  placement:"left",
                  overlayClassName: style.tooltip,
                  trigger: 'click',
                }}
                lines={1}
              >{_.StoreName}</Ellipsis>
            </div>
            <div className={style.store_text_label_sale}>{`${_.TotalSaleAmt}元`}</div>
            <div className={style.store_text_label}>{_.BillTime}</div>
          </div>
        </div>
      )
    })

    return (
      <div className={style.liveTrading} ref={this.domMw}>
        {
          livingData.length === 0 ? <EmptyWarp>
            <Empty
              image={EmptyIma}
              imageStyle={{height: 120,}}
              description={<span style={{color: '#2880B4', fontSize: 16}}
              >暂无相关数据</span>} />
          </EmptyWarp> :
          <div className="swiper-container">
            <div className="swiper-wrapper">
            {imgHtml}
            </div>
          </div>
        }
      </div>
    )
  }
}

LiveTrading.propTypes = {
  updateIndex: PropTypes.number,
  floorSalesVal: PropTypes.array,
  typeSalesVal: PropTypes.array,
  storesliving: PropTypes.array,
  dispatch: PropTypes.func,
}

export default LiveTrading
