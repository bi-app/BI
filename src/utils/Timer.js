/**
 * 定时器
 * @author zc
 * @date 2018-01-05
 */

export function Timer(mode) {
  var mode = mode || 1;
  if (mode === 1) {
    this._tick = (requestAnimationFrame ||
      webkitRequestAnimationFrame ||
      mozRequestAnimationFrame ||
      oRequestAnimationFrame).bind(window);

    this._clearTick = (cancelAnimationFrame ||
      webkitCancelAnimationFrame ||
      mozCancelAnimationFrame ||
      oCancelAnimationFrame).bind(window);

  } else {
    this._tick = function (callback) {
      return setTimeout(callback, 1000 / 60);
    }
    this._clearTick = function(id) {
      return clearTimeout(id);
    }
  }
  this.start();
}
/**
 * 开始定时器
 */
Timer.prototype.start = function() {
  //定时器句柄
  this.timerHandle = null;
  //任务队列
  this.scheduleQuene = [];
  this.incrementId = 0;
  var _this = this;
  function nextTick() {
    _this.timerHandle = _this._tick(nextTick);

    for (var i = 0; i < _this.scheduleQuene.length; i++) {
      _this._runSchedule(_this.scheduleQuene[i]);
    }
  }
  nextTick();
  return this;
}


/**
 * 停止定时器
 */
Timer.prototype.stop = function() {
  if (this.timerHandle) {
    this._clearTick(this.timerHandle);
  }
  return this;
}

/**
 * 解析计划任务rule条目
 * @param ruleItem rule条目
 * @return 返回一个数组
 */
Timer.prototype._parseRuleItem = function(ruleItem) {
  var rule = [];
  if (ruleItem) {
    if (typeof ruleItem === 'number') {
      rule.push(ruleItem);
    } else if (typeof ruleItem === 'string') {
      var items = ruleItem.split('-');
      var start = parseInt(items[0]),
        end = parseInt(items[1]);
      for (var i = start; i <= end; i++) {
        rule.push(i);
      }

    } else if (ruleItem instanceof Array) {
      rule = ruleItem;
    }
  }
  return rule;
}
/**
 * 解析计划任务rule对象
 * @param rule rule对象
 * @return 返回一个结果对象
 */
Timer.prototype._parseRule = function(rule) {

  var rs = {};
  if (rule.y) {
    rs.years = this._parseRuleItem(rule.y);
  }
  if (rule.m) {
    rs.months = this._parseRuleItem(rule.m);
  }
  if (rule.d) {
    rs.days = this._parseRuleItem(rule.d);
  }
  if (rule.h) {
    rs.hours = this._parseRuleItem(rule.h);
  }
  if (rule.min) {
    rs.minutes = this._parseRuleItem(rule.min);
  }
  if (rule.s) {
    rs.seconds = this._parseRuleItem(rule.s);
  }
  if (rule.w) {
    rs.weeks = this._parseRuleItem(rule.w);
  }

  return rs;
}


/**
 * 执行一个计划
 * @param schedule 计划对象
 */
Timer.prototype._runSchedule = function(schedule) {

  if (typeof schedule.rule === 'number') {
    var now = +new Date();
    var interval = schedule.rule;
    var updateTime = schedule.updateTime || schedule.createTime;
    if (now - updateTime >= Math.max(interval, 20)) {
      schedule.fn();
      schedule.updateTime = now;
      if (schedule.once) {
        this.removeSchedule(schedule.id);
      }
    }

  } else if (typeof schedule.rule === 'object') {

    if (schedule.updateTime) {
      var now = +new Date();
      if (now - schedule.updateTime > 1000) {
        schedule.isPaused = false;
      }
    }
    var rule = schedule.rule;
    var years = rule.years,
      months = rule.months,
      days = rule.days,
      hours = rule.hours,
      minutes = rule.minutes,
      seconds = rule.seconds,
      weeks = rule.weeks;

    var now = new Date(),
      year = now.getFullYear(),
      month = now.getMonth() + 1,
      day = now.getDate(),
      hour = now.getHours(),
      minute = now.getMinutes(),
      second = now.getSeconds(),
      ms = now.getMilliseconds(),
      week = now.getDay();

    var tern = [];
    if (years && years.length > 0) {
      var b = false;
      if (years.indexOf(year) !== -1) {
        b = true;
      }
      tern.push(b);
    }
    if (months && months.length > 0) {
      var b = false;
      if (months.indexOf(month) !== -1) {
        b = true;
      }
      tern.push(b);

    }
    if (days && days.length > 0) {
      var b = false;
      if (days.indexOf(day) !== -1) {
        b = true;
      }
      tern.push(b);
    }
    if (hours && hours.length > 0) {
      var b = false;
      if (hours.indexOf(hour) !== -1) {
        if ((!minutes && minute !== 0) || (!minutes && !seconds && second !== 0)) {
          b = false;
        } else {
          b = true;
        }
      }
      tern.push(b);
    }
    if (minutes && minutes.length > 0) {
      var b = false;
      if (minutes.indexOf(minute) !== -1) {
        if (!seconds && second !== 0) {
          b = false;
        } else {
          b = true;
        }
      }
      tern.push(b);
    }
    if (seconds && seconds.length > 0) {
      var b = false;
      if (seconds.indexOf(second) !== -1) {
        b = true;
      }
      tern.push(b);
    }
    if (weeks && weeks.length > 0) {
      var b = false;
      if (weeks.indexOf(week) !== -1) {
        b = true;
      }
      tern.push(b);
    }
    var flag = true;
    for (var i = 0; i < tern.length; i++) {
      if (!tern[i]) {
        flag = false;
        break;
      }
    }

    if (flag && !schedule.isPaused) {
      schedule.fn();
      schedule.isPaused = true;
      schedule.updateTime = now.getTime();
      if (schedule.once) {
        this.removeSchedule(schedule.id);
      }
    }
  }
}
/**
 * 间隔函数
 * @param interval 间隔时间
 * @param fn 执行函数
 */
Timer.prototype.interval = function(interval, fn) {
  return this.schedule(interval, fn);
}
/**
 * 定时函数
 * @param 间隔时间
 * @param fn 执行函数
 */
Timer.prototype.timeout = function(interval, fn) {
  return this.schedule(interval, fn, true);
}

/**
 * 增加一个计划任务
 * @param rule 规则对象 {y:年份,m:月份,d:日,h:时,min:分,s:秒,w:周}
 * @param fn 计划执行函数
 * @param once 是否执行一次自动销毁
 * @return scheduleId 计划id
 */
Timer.prototype.schedule = function(rule, fn, once) {
  var scheduleId = ++this.incrementId;
  if (typeof rule === 'object') {
    rule = this._parseRule(rule);
  }
  var schedule = {
    id: scheduleId,
    createTime: +new Date(),
    updateTime: null,
    rule: rule,
    once: once || false,
    fn: fn
  }
  this.scheduleQuene.push(schedule);
  return scheduleId;
}

/**
 * 移除一个计划任务
 * @param scheduleId 计划id 调用schedule函数返回
 */
Timer.prototype.removeSchedule = function(scheduleId) {
  var len = this.scheduleQuene.length;
  for (var i = 0; i < len; i++) {
    var schedule = this.scheduleQuene[i];
    if (schedule.id === scheduleId) {
      this.scheduleQuene.splice(i, 1);
      break;
    }
  }
}



