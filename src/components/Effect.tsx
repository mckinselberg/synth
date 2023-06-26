import React, { useState } from 'react';
import Slider from './Slider';
import SvgArrow from './svg/SvgArrow';
import '../scss/effects.scss';

const Effect = ({ effect, handleEffectsChange, effectsWithParams, paramsUpdater, key, idx }) => {
  const [open, setOpen] = useState(false);
  const handleExpandClick = () => {
    setOpen(!open);
  }
  return (
    <div className={`effect${!open ? ' closed' : ''}`}>
      <div 
        className={`expander${open ? ' expanded' : ''}`}
        onClick={handleExpandClick}
      >
        <SvgArrow width={8} height={8}/>
      </div>
      <div className="effect-name">{effect}</div>
      <label htmlFor={effect}>
        <input
          type="checkbox"
          name={effect}
          id={effect}
          value={effect}
          onChange={handleEffectsChange}
          key={key}
        />
        <div><span></span></div>
      </label>
      <div className="effect-params">
        {Object.keys(effectsWithParams).map(param => {
          const value = effectsWithParams[param].value;
          return (
            <Slider
              handleChange={(e) => {
                paramsUpdater(e, effect, param);
              }}
              value={value}
              step={effectsWithParams[param].step}
              name={param}
              range={[effectsWithParams[param].min, effectsWithParams[param].max]}
            />
          );
        })}
      </div>
      
    </div>
  )
}

export default Effect;