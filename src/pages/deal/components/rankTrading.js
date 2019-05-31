import React from 'react'
import QueueAnim from 'rc-queue-anim';
import style from './rankTrading.less';
import { Ellipsis } from "ant-design-pro"
import { Spin, Empty } from 'antd';
import styled from "styled-components";
import EmptyIma from 'assets/Empty.svg'
import numeral from 'numeral';

const StyledDiv = styled.div`
  position: relative;
  width: 300px;
`;
const EmptyWarp = styled.div`
  padding: 50px 0
`;

export default (props) => {
  return (
    <Spin spinning={false} delay={500}>
      <StyledDiv>
        {
          props.numOne.length === 0 ? <EmptyWarp>
              <Empty
                image={EmptyIma}
                imageStyle={{height: 120,}}
                description={<span style={{color: '#2880B4', fontSize: 16}}
                >暂无相关数据</span>}/>
            </EmptyWarp> :
            <div className={style['rankTrading-warp']}>
              <div className={style['rank-header']}>
                <div className={style['rank-header-list']}>
                  <div className={style['store-warp']}>
                    <i className={style.rank_2}/>
                    <div className={style['store-img']}>
                      <img src={""} alt=""/>
                    </div>
                  </div>
                  <div className={style['store-name']}><Ellipsis lines={1}>{props.numTwo.StoreName}</Ellipsis></div>
                  <p className={style['store-sale-num']}>{numeral(props.numTwo.BillAmount).format('0,0')}</p>
                </div>
                <div className={style['rank-header-num1']}>
                  <div className={style['store-warp']}>
                    <i className={style.rank_1}/>
                    <div className={style['store-img']}>
                      <img src={""} alt=""/>
                    </div>
                  </div>
                  <div className={style['store-name']}><Ellipsis lines={1}>{props.numOne.StoreName}</Ellipsis></div>
                  <p className={style['store-sale-num']}>{numeral(props.numOne.BillAmount).format('0,0')}</p>
                </div>
                <div className={style['rank-header-num2']}>
                  <div className={style['store-warp']}>
                    <i className={style.rank_3}/>
                    <div className={style['store-img']}>
                      <img src={""} alt=""/>
                    </div>
                  </div>
                  <div className={style['store-name']}><Ellipsis lines={1}>{props.numThree.StoreName}</Ellipsis></div>
                  <p className={style['store-sale-num']}>{numeral(props.numThree.BillAmount).format('0,0')}</p>
                </div>
              </div>
              <div className={style['rank-cont']}>
                <QueueAnim delay={300} className={style['queue-simple']}>
                  {
                    props.otherList.map((_, index) => {
                      return (
                        <div key={_.StoreID} className={style['rank-list']}>
                          <div className={style['rank-list-index']}>{`NO.${index + 4}`}</div>
                          <div className={style['rank-list-nomal']}><Ellipsis lines={1}>{_.StoreName}</Ellipsis></div>
                          <div className={style['rank-list-nomal']}>{numeral(_.BillAmount).format('0,0')}</div>
                        </div>
                      )
                    })
                  }
                </QueueAnim>
              </div>
            </div>
        }
      </StyledDiv>
    </Spin>
  )
}

