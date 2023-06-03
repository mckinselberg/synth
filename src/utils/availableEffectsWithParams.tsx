const availableEffectsWithParams = {
  'pingPong': {
    'delayTime': {
      defaultValue: 0.25,
      handleDelayState: () => {
        let value;
        function updateValue(e) {
          value = e.target.value;
        }
        function getValue() {
          return value || availableEffectsWithParams.pingPong.delayTime.defaultValue;
        }
        return [updateValue, getValue];
      },
    },
    'maxDelay': {
      value: 0.1
    }
  },
  'autoFilter': {
    'frequency': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    }
  },
  'autoWah': {
    'baseFrequency': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    },
    'octaves': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    },
    'sensitivity': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    },
  },
  'crusher': {
    'bits': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    }
  },
  'cheby': {
    'order': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    },
  },
  'phaser': {
    'frequency': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    },
    'octaves': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    },
    'baseFrequency': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.9,
    }
  }
}

export { availableEffectsWithParams };
export default availableEffectsWithParams;