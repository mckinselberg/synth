import React, { useState } from 'react';
import { availableEffectsWithParams as params } from '../utils/availableEffectsWithParams';

const Effect = ({ effect, handleEffectsChange }) => {
  const [effecParamsState, setParamsEffectState] = useState({})
  return (
    <div>
      {effecParamsState.value}
      <label htmlFor={effect}>{effect}</label>
      <input
        type="checkbox"
        name={effect}
        id={effect}
        value={effect}
        onChange={handleEffectsChange}
      />
      {console.log(`%c-${effect}`, 'color: orange')}
      {Object.keys(params).map((param, idx) => {
        if (effect !== 'pingPong') return null;

        console.log(`%c--${idx}. ${param}: ${params[param]}`, 'color: purple');

        let paramUpdater;
        let paramValue;

        Object.keys(params[param]).map((param2, idx2) => {
          // console.log(`%c---${idx2}. ${param2}: ${params[param][param2]}`, 'color: green');
          // console.log(params[param][param2]);
          // console.log(typeof params[param][param2]);
          Object.keys(params[param][param2]).map((param3) => {
            console.log(params[param][param2][param3]);
            if (typeof params[param][param2][param3] !== 'function') return;
            const [updateValue, getValue] = params[param][param2][param3]();
            paramUpdater = updateValue;
            paramValue = getValue();
          });
          // console.log(params[param][param2])
        });
        


        return (
          <div>
            <label style={{width: 'auto'}}>
              {param}
            </label>
            <input
              type="text"
              style={{width: '20px'}}
              value={paramValue}
              onChange={(e) => {
                paramUpdater(e);
                setParamsEffectState({
                  value: e.target.value,
                });
              }}
            />
          </div>
        );
      })}
    </div>
  )
}

export default Effect;