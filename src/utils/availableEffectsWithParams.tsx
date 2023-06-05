const availableEffectsWithParams = {
  'chorus': {
    'frequency': {
      min: 20,
      max: 2000,
      step: 1,
      value: 440,
    },
    'delayTime': {
      value: 1,
      min: 1,
      max: 1000,
      step: 1,
    },
    'depth': {
      value: 0.25,
      min: 0.1,
      max: 1,
      step: 0.01,
    },
  },
  'pingPong': {
    'delayTime': {
      value: 0.25,
      min: 0.1,
      max: 1,
      step: 0.01,
    },
    'maxDelay': {
      value: 0.25,
      min: 0.1,
      max: 1,
      step: 0.01,
    },
    'wet': {
      value: 0.25,
      min: 0.1,
      max: 1,
      step: 0.01,
    },
  },
  'autoWah': {
    'baseFrequency': {
      // in hz
      min: 1,
      max: 500,
      step: 10,
      value: 50,
    },
    'octaves': {
      min: 1,
      max: 10,
      step: 1,
      value: 6,
    },
    'sensitivity': {
      // in db
      min: -100,
      max: 100,
      step: 1,
      value: -30,
    },
    'q': {
      min: 0,
      max: 5,
      step: .01,
      value: 1,
    }
  },
  'vibrato': {
    'frequency': {
      min: 1,
      max: 20,
      step: .5,
      value: 5,
    },
    'depth': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.1,
    },
  },
  'distortion': {
    'distortion': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.4,
    },
  },
  'crusher': {
    'bits': {
      min: 1,
      max: 16,
      step: 1,
      value: 8,
    }
  },
  'cheby': {
    'order': {
      min: 2,
      max: 100,
      step: 1,
      value: 2,
    },
  },
  'phaser': {
    'frequency': {
      min: 20,
      max: 20000,
      step: 1,
      value: 15,
    },
    'octaves': {
      min: 0,
      max: 100,
      step: 1,
      value: 5,
    },
    'baseFrequency': {
      min: 0,
      max: 5000,
      step: 1,
      value: 1000,
    }
  },
  'tremolo': {
    'frequency': {
      min: 20,
      max: 20000,
      step: 1,
      value: 10,
    },
    'depth': {
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
  },
  'autoFilter': {
    'frequency': {
      min: 110,
      max: 880,
      step: 10,
      value: 440,
    }
  },
}

const availableEffects = Object.keys(availableEffectsWithParams);

export { availableEffectsWithParams, availableEffects };