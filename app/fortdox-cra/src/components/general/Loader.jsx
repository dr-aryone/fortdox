/*
The MIT License (MIT)

Copyright (c) 2014 Call-Em-All

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
  Modified by: Anton Lövmar
*/


const React = require('react');

function getRelativeValue(value, min, max) {
  const clampedValue = Math.min(Math.max(min, value), max);
  return clampedValue / (max - min);
}

function getArcLength(fraction, props) {
  return fraction * Math.PI * (props.size - props.thickness);
}

function getStyles(props) {
  const {
    max,
    min,
    size,
    value,
  } = props;


  const styles = {
    root: {
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
    },
    wrapper: {
      width: size,
      height: size,
      display: 'inline-block',
      transition: 'transform 20s linear',
      transitionTimingFunction: 'linear',
    },
    svg: {
      width: size,
      height: size,
      position: 'relative',
    },
    path: {
      stroke: props.color,
      strokeLinecap: 'round',
      transition: 'all 1.5s ease-in-out',
    },
  };

  if (props.mode === 'determinate') {
    const relVal = getRelativeValue(value, min, max);
    styles.path.transition = 'all 0.3s null linear';
    styles.path.strokeDasharray = `${getArcLength(relVal, props)}, ${getArcLength(1, props)}`;
  }

  return styles;
}

class Loader extends React.Component {
  getProps() {
    return {
      size: this.props.size || 40,
      value: this.props.value || 0,
      min: this.props.min || 0,
      max: this.props.max || 100,
      thickness: this.props.thickness || 3.5,
      color: this.props.color || '#00bcd4',
      mode: this.props.mode || 'indeterminate',
      style: this.props.style || {},
      innerStyle: this.props.innerStyle || {},
    };
  }
  componentDidMount() {
    this.scalePath(this.path);
    this.rotateWrapper(this.wrapper);
  }
  componentWillUnmount() {
    clearTimeout(this.scalePathTimer);
    clearTimeout(this.rotateWrapperTimer);
  }
  scalePath(path, step = 0) {
    if (this.getProps().mode !== 'indeterminate') return;

    step %= 3;

    if (step === 0) {
      path.style.strokeDasharray = `${getArcLength(0, this.getProps())}, ${getArcLength(1, this.getProps())}`;
      path.style.strokeDashoffset = 0;
      path.style.transitionDuration = '0ms';
    } else if (step === 1) {
      path.style.strokeDasharray = `${getArcLength(0.7, this.getProps())}, ${getArcLength(1, this.getProps())}`;
      path.style.strokeDashoffset = getArcLength(-0.3, this.getProps());
      path.style.transitionDuration = '750ms';
    } else {
      path.style.strokeDasharray = `${getArcLength(0.7, this.getProps())}, ${getArcLength(1, this.getProps())}`;
      path.style.strokeDashoffset = getArcLength(-1, this.getProps());
      path.style.transitionDuration = '850ms';
    }

    this.scalePathTimer = setTimeout(() => this.scalePath(path, step + 1), step ? 750 : 250);
  }

  rotateWrapper(wrapper) {
    if (this.getProps().mode !== 'indeterminate') return;

    wrapper.style.transform = 'rotate(0deg)';
    wrapper.style.transitionDuration  ='0ms';

    setTimeout(() => {
      wrapper.style.transform  ='rotate(1800deg)';
      wrapper.style.transitionDuration  ='10s';
      wrapper.style.transitionTimingFunction  ='linear';
    }, 50);

    this.rotateWrapperTimer = setTimeout(() => this.rotateWrapper(wrapper), 10050);
  }

  render() {
    let {
      style,
      innerStyle,
      size,
      thickness,
      ...other
    } = this.getProps();

    const styles = getStyles(this.getProps());

    return (
      <div {...other} style={Object.assign(styles.root, style)} >
        <div ref={e => this.wrapper = e} style={Object.assign(styles.wrapper, innerStyle)} >
          <svg
            viewBox={`0 0 ${size} ${size}`}
            style={styles.svg}
          >
            <circle
              ref={e => this.path = e}
              style={styles.path}
              cx={size / 2}
              cy={size / 2}
              r={(size - thickness) / 2}
              fill='none'
              strokeWidth={thickness}
              strokeMiterlimit='20'
            />
          </svg>
        </div>
      </div>
    );
  }
}

module.exports = Loader;
