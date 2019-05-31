import React, { PureComponent } from 'react'
import style from './index.less';


const AnimatedCard = ({position, animation, digit}) => {
  return (
    <div className={`${style.flipCard} ${style[position]} ${style[animation]}`}>
      <span>{digit}</span>
    </div>
  );
};

// function component
const StaticCard = ({position, digit}) => {
  return (
    <div className={style[position]}>
      <span>{digit}</span>
    </div>
  );
};

function deepClone(initalObj) {
  var obj = {};
  try {
    obj = JSON.parse(JSON.stringify(initalObj));
  }catch (e) {
    console.log(e)
  }
  return obj;
}

// function component
const FlipUnitContainer = ({digit, shuffle, unit}) => {

  // assign digit values
  let currentDigit = digit;
  // let previousDigit = digit - 1;
  let previousDigit = digit;



  // to prevent a negative value
  if (unit !== 'hours') {
    previousDigit = previousDigit === -1
      ? 59
      : previousDigit;
  } else {
    previousDigit = previousDigit === -1
      ? 23
      : previousDigit;
  }
  // add zero
  if (currentDigit < 10) {
    currentDigit = `0${currentDigit}`;
  }
  if (previousDigit < 10) {
    previousDigit = `0${previousDigit}`;
  }


  // shuffle digits
  const digit1 = shuffle
    ? previousDigit
    : currentDigit;
  const digit2 = !shuffle
    ? previousDigit
    : currentDigit;

  // shuffle animations
  const animation1 = shuffle
    ? 'fold'
    : 'unfold';
  const animation2 = !shuffle
    ? 'fold'
    : 'unfold';


  // console.log("animation1", animation1);

  // console.log("digit2", digit2);
  // console.log("animation2", animation2);


  let cloneObj = deepClone({newobj: currentDigit});
  cloneObj.newobj = currentDigit + 1;

  return (
    <div className={style.flipUnitContainer}>
      <StaticCard
        position={'upperCard'}
        digit={currentDigit}
      />
      <StaticCard
        position={'lowerCard'}
        digit={previousDigit}
      />
      <AnimatedCard
        position={'first'}
        digit={digit1}
        animation={animation1}
      />
      <AnimatedCard
        position={'second'}
        digit={digit2}
        animation={animation2}
      />
    </div>
  );
};


// class component
class FlipClock extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      hours: new Date().getHours(),
      hoursShuffle: false,
      minutes: new Date().getMinutes(),
      minutesShuffle: false,
      seconds: new Date().getSeconds(),
      secondsShuffle: false,
    };
  }

  componentDidMount() {
    const _self = this;
    this.timerID = setInterval(() => {
        _self.updateTime()
    },
      1000
    );
  }

  componentWillUnmount() {
    this.timerID && clearInterval(this.timerID);
  }

  updateTime() {
    // get new date
    const time = new Date();
    // set time units
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    // on hour chanage, update hours and shuffle state

    if (hours !== this.state.hours) {
      const hoursShuffle = !this.state.hoursShuffle;
      this.setState({
        hours,
        hoursShuffle
      });
    }
    // on minute chanage, update minutes and shuffle state
    if (minutes !== this.state.minutes) {
      const minutesShuffle = !this.state.minutesShuffle;
      this.setState({
        minutes,
        minutesShuffle
      });
    }
    // on second chanage, update seconds and shuffle state
    if (seconds !== this.state.seconds) {
      const secondsShuffle = !this.state.secondsShuffle;
      this.setState({
        seconds,
        secondsShuffle
      });
    }
  }

  render() {

    // state object destructuring
    const {
      hours,
      minutes,
      hoursShuffle,
      minutesShuffle,
    } = this.state;

    return (
      <div className={style.flipClock}>

        <FlipUnitContainer
          unit={'hours'}
          digit={hours}
          shuffle={hoursShuffle}
        />
        <FlipUnitContainer
          unit={'minutes'}
          digit={minutes}
          shuffle={minutesShuffle}
        />
        {/*<FlipUnitContainer*/}
        {/*unit={'seconds'}*/}
        {/*digit={seconds}*/}
        {/*shuffle={secondsShuffle}*/}
        {/*/>*/}
      </div>
    );
  }
}

export default FlipClock
