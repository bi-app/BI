import { cloneDeep, flow, compact } from 'lodash';
import umiRouter from 'umi/router';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';
import _ from 'lodash';
import { Statistic } from 'antd'
export classnames from 'classnames';
export request from './request';


/**格式化数值*/

export function formaterVal(val = Number, nomalprecision, precision, nomalsuffix, suffix, valueStyle, style) {
  if(Number(val) > 10000){
    return <Statistic
      value={val/10000}
      precision={precision}
      valueStyle={valueStyle}
      suffix={suffix}
      style={style}
    />
  }
  return <Statistic
    value={val}
    precision={nomalprecision}
    valueStyle={valueStyle}
    suffix={nomalsuffix}
    style={style}
  />
}

/**
 * 计算周期统计时间
 * */
export function _cycleDate() {
  const nowDay = moment().date()
  if(nowDay < 15){
    return moment().subtract(1, 'month').startOf('month')
  }else {
    return moment()
  }
}

export function _filterNodes(faId, souces, ) {
  let result = {};
  _.forEach(souces, (item, index) => {
    if(Number(item.id) === Number(faId)) result = item
  })
  return result
}

export function _filterEdges(faId, souces, ) {
  let result = {};
  _.forEach(souces, (item, index) => {
    if(Number(item.source) === Number(faId)) result = item
  })
  return result
}

export function filterData(array2, array1) {
  let result = [];
  for(let i = 0; i < array2.length; i++){
    const obj = array2[i];
    const num = obj.doorNum.num;
    let isExist = false;
    for(let j = 0; j < array1.length; j++){
      const aj = array1[j];
      const n = aj.num;
      if(n === num){
        isExist = true;
        break;
      }
    }
    if(!isExist){
      result.push(obj);
    }
  }
  return result
}


/**设置sessionStorage*/
export function setSession(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSession(key) {
  let value = window.sessionStorage.getItem(key);
  return JSON.parse(value);
}
export function clearOneSession(key) {
  window.sessionStorage.removeItem(key);
}

/**
 * 进入子菜单路由分割
 * */
export function routerChild(pathname) {
  const routerLen = pathname.split("/").length;
  if(routerLen > 2){
      return `/${pathname.split("/")[1]}`
  }else {
    return pathname
  }
}
/**
 * 计算时间
 * */
export function rangeDate(type = {}) {
  let StartTime = '',
      EndTime = '';
  switch (type.DefaultTransScreenShowDataRangeType) {
    case 1:
      const newDate = `${moment().format('YYYY-MM-DD')} ${type.StartHourMinSec}`
      return {
        StartTime: moment(new Date(newDate)).format('YYYY-MM-DD HH:mm'),
        EndTime: moment(new Date(newDate)).add(1, 'day').format('YYYY-MM-DD HH:mm')
      };
    case 2:
      const weekData = compact(type.DefaultTransScreenShowDateEveryWeekValue.split(","))
      const weekOfday = moment().get('weekday');
      const len = weekData.length;
      console.log("len", len)
      if(len === 1){//只有一个值
        if(Number(weekData[0]) > weekOfday){
          const Start = `${moment().subtract(1, 'week').startOf('isoWeek').isoWeekday(Number(weekData[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`
          const End = `${moment().isoWeekday(Number(weekData[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`
          StartTime = moment(Start).format('YYYY-MM-DD HH:mm');
          EndTime = moment(End).format('YYYY-MM-DD HH:mm');
        }else {
          const Start = `${moment().isoWeekday(Number(weekData[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`
          const EndT = `${moment().add(1, 'week').startOf('isoWeek').isoWeekday(Number(weekData[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`
          StartTime = moment(Start).format('YYYY-MM-DD HH:mm');
          EndTime = moment(EndT).format('YYYY-MM-DD HH:mm');
        }
      }else if(len === 0){//为空
        StartTime = `${moment().isoWeekday(1).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
        EndTime = `${moment().add(1, 'week').startOf('isoWeek').isoWeekday(1).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
      }else {//多个
        const lg = weekData.filter(_ => Number(_) >= weekOfday);
        const sm = weekData.filter(_ => Number(_) <= weekOfday);
        // console.log("weekOfday", weekOfday)
        // console.log("sm", sm)
        // console.log("lg", lg)
        if(sm.length === 0 ){
          const lgLen = lg.length - 1
          StartTime = `${moment().subtract(7, 'day').isoWeekday(Number(lg[lgLen])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
          EndTime = `${moment().isoWeekday(Number(lg[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
        }else {
          if(sm.length > 1){
            StartTime = `${moment().isoWeekday(Number(sm[sm.length - 2])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
            EndTime = `${moment().isoWeekday(Number(sm[sm.length - 1])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
          }else {
            StartTime = `${moment().isoWeekday(Number(sm[sm.length - 1])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
            EndTime = `${moment().isoWeekday(Number(lg[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
          }
        }
      }
      return {StartTime, EndTime};
    case 3:
      const monthDay = compact(type.DefaultTransScreenShowDateEveryMonthValue.split(","))
      const monthDayLen = monthDay.length;
      const today = moment().date();
      const daysInMonth = moment().daysInMonth();
      if(monthDayLen === 1){
          if(Number(monthDay[0]) > daysInMonth){//选择31号，实际天数只有 30号，选用下月1号开始
            StartTime = `${moment().date(1).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
            EndTime = `${moment().date(Number(daysInMonth)).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
          }else {
            if(Number(monthDay[0]) > today){
              StartTime = `${moment().subtract(1, 'week').startOf('isoWeek').isoWeekday(Number(monthDay[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
              EndTime = `${moment().isoWeekday(Number(monthDay[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
            }else {
              StartTime = `${moment().date(Number(monthDay[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
              EndTime = `${moment().add(1, 'month').startOf('month').date(Number(monthDay[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
            }
          }
      }else if(monthDayLen === 0){
        StartTime = `${moment().date(1).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
        EndTime = `${moment().add(1, 'month').startOf('month').date(1).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
      }else {
        const lg = monthDay.filter(_ => Number(_) > today);
        const sm = monthDay.filter(_ => Number(_) <= today);
        console.log(3)
        if(lg){//选择的大于今天
          console.log(1)
          if(lg > daysInMonth){// 当月只存在30天
            console.log(2)
            StartTime = moment().date(Number(sm[sm.length - 1])).format('YYYY-MM-DD 00:00:00');
            EndTime = moment().add(1, 'month').startOf('month').date(Number(sm[0])).format('YYYY-MM-DD 00:00:00');
          }else {
            console.log(4)
            if(sm.length === 0 ){
              const lgLen = lg.length - 1
              StartTime = `${moment().subtract(1, 'months').date(Number(lg[lgLen])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
              EndTime = `${moment().date(Number(lg[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;

            }else {
              StartTime = `${moment().date(Number(sm[sm.length - 1])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
              EndTime = `${moment().date(Number(lg[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
            }
          }
        }else {
          StartTime = `${moment().date(Number(sm[sm.length - 1])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
          EndTime = `${moment().add(1, 'month').startOf('month').date(Number(sm[0])).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
        }
      }
      return {StartTime, EndTime};
    case 4:
      const getDateTime = `${moment(new Date(type.CustomDefineStartDate)).format('YYYY-MM-DD')} ${type.StartHourMinSec}`;
      const customizeTime = moment(new Date(getDateTime)).valueOf();
      const currentTime = moment().valueOf();
      if(currentTime > customizeTime){
        return {
          StartTime: `${moment(new Date(type.CustomDefineStartDate)).format('YYYY-MM-DD')} ${type.StartHourMinSec}`,
          EndTime: moment(new Date('2150-12-31 23:59')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      return {
        StartTime: moment().format('YYYY-MM-DD HH:mm'),
        EndTime: `${moment(new Date(type.CustomDefineStartDate)).format('YYYY-MM-DD')} ${type.StartHourMinSec}`
      };
    default :
      return {
        StartTime: moment().format('YYYY-MM-DD HH:mm'),
        EndTime: moment().format('YYYY-MM-DD HH:mm')
      };
  }
}

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array, key, value) {
  if (!Array.isArray(array)) {
    return
  }
  return array.find(_ => _[key] === value)
}

/**
 * Convert an array to a tree-structured array.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @param   {string}    parentId       The alias of the parent ID of the object in the array.
 * @param   {string}    children  The alias of children of the object in the array.
 * @return  {array}    Return a tree-structured array.
 */
export function arrayToTree(
  array,
  id = 'id',
  parentId = 'pid',
  children = 'children'
) {
  const result = []
  const hash = {}
  const data = cloneDeep(array)

  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach(item => {
    const hashParent = hash[item[parentId]]
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = [])
      hashParent[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}


/**
 * Add the language prefix in pathname.
 * @param   {string}    pathname   Add the language prefix in the pathname.
 * @return  {string}    Return the pathname after adding the language prefix.
 */




/**
 * Adjust the router to automatically add the current language prefix before the pathname in push and replace.
 */
const myRouter = { ...umiRouter }

myRouter.push = flow(
  umiRouter.push
)

myRouter.replace = flow(
  myRouter.replace
)

export const router = myRouter

/**
 * Whether the path matches the regexp if the language prefix is ignored, https://github.com/pillarjs/path-to-regexp.
 * @param   {string|regexp|array}     regexp     Specify a string, array of strings, or a regular expression.
 * @param   {string}                  pathname   Specify the pathname to match.
 * @return  {array|null}              Return the result of the match or null.
 */
export function pathMatchRegexp(regexp, pathname) {
  return pathToRegexp(regexp).exec(pathname)
}

/**
 * In an array object, traverse all parent IDs based on the value of an object.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the value of the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryPathKeys(array, current, parentId, id = 'id') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = current => {
    const currentParentId = hashMap.get(current)[parentId]
    if (currentParentId) {
      result.push(currentParentId)
      getPath(currentParentId)
    }
  }

  getPath(current)
  return result
}

/**
 * In an array of objects, specify an object that traverses the objects whose parent ID matches.
 * @param   {array}     array     The Array need to Converted.
 * @param   {string}    current   Specify the object that needs to be queried.
 * @param   {string}    parentId  The alias of the parent ID of the object in the array.
 * @param   {string}    id        The alias of the unique ID of the object in the array.
 * @return  {array}    Return a key array.
 */
export function queryAncestors(array, current, parentId, id = 'id') {
  const result = [current]
  const hashMap = new Map()
  array.forEach(item => hashMap.set(item[id], item))

  const getPath = current => {
    const currentParentId = hashMap.get(current[id])[parentId]
    if (currentParentId) {
      result.push(hashMap.get(currentParentId))
      getPath(hashMap.get(currentParentId))
    }
  }

  getPath(current)
  return result
}

/**
 * Query which layouts should be used for the current path based on the configuration.
 * @param   {layouts}     layouts   Layout configuration.
 * @param   {pathname}    pathname  Path name to be queried.
 * @return  {string}   Return frist object when query success.
 */
export function queryLayout(layouts, pathname) {
  let result = 'public'

  const isMatch = regepx => {
    return regepx instanceof RegExp
      ? regepx.test(pathname)
      : pathMatchRegexp(regepx, pathname)
  }

  for (const item of layouts) {
    let include = false
    let exlude = false
    if (item.include) {
      for (const regepx of item.include) {
        if (isMatch(regepx)) {
          include = true
          break
        }
      }
    }

    if (include && item.exlude) {
      for (const regepx of item.exlude) {
        if (isMatch(regepx)) {
          exlude = true
          break
        }
      }
    }

    if (include && !exlude) {
      result = item.name
      break
    }
  }

  return result
}
