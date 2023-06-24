import React, { useState } from 'react';
import Slider from './Slider';

const Effect = ({ effect, handleEffectsChange, effectsWithParams, paramsUpdater }) => {
  const [open, setOpen] = useState(false);
  const handleExpandClick = () => {
    setOpen(!open);
  }
  return (
    <div className={`effect${!open ? ' closed' : ''}`}>
      <div className={`expander${open ? ' expanded' : ''}`} onClick={handleExpandClick}>^</div>
      <label htmlFor={effect}>{effect}</label>
      <input
        type="checkbox"
        name={effect}
        id={effect}
        value={effect}
        onChange={handleEffectsChange}
      />
      {Object.keys(effectsWithParams).map((param, idx) => {

        const value = effectsWithParams[param].value;
        return (
          <Slider
            // key={`${idx}_${param}`}
            handleChange={(e) => {
              paramsUpdater(e, effect, param);
            }}
            value={value}
            step={effectsWithParams[param].step}
            name={param}
            range={[effectsWithParams[param].min, effectsWithParams[param].max]}
            id={param}
          />
        );
      })}
    </div>
  )
}

export default Effect;