import React, { useState, useCallback } from 'react';
import Slider from './Slider';
import SvgArrow from './svg/SvgArrow';
import '../scss/effects.scss';

type EffectParam = {
  value: number;
  min: number;
  max: number;
  step: number;
};

type EffectProps = {
  checked?: boolean;
  effect: string;
  effectsWithParams: Record<string, EffectParam>;
  handleEffectsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paramsUpdater: (e: React.ChangeEvent<HTMLInputElement>, effect: string, param: string) => void;
};

const Effect: React.FC<EffectProps> = ({
  checked = false,
  effect,
  effectsWithParams,
  handleEffectsChange,
  paramsUpdater,
}) => {
  const [open, setOpen] = useState(false);

  const handleExpandClick = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div className={`effect${!open ? ' closed' : ''}`}>
      <div
        className={`expander${open ? ' expanded' : ''}`}
        onClick={handleExpandClick}
      >
        <SvgArrow width={8} height={8} />
      </div>
      <div className="effect-name">{effect}</div>
      <label htmlFor={effect}>
        <input
          type="checkbox"
          name={effect}
          id={effect}
          value={effect}
          onChange={handleEffectsChange}
          checked={checked}
        />
        <div><span></span></div>
      </label>
      <div className="effect-params">
        {Object.entries(effectsWithParams).map(([param, paramData]) => {
          const typedParamData = paramData as EffectParam;
          return (
            <div key={`${effect}_${param}`}>
              <Slider
                handleChange={(e) => paramsUpdater(e, effect, param)}
                value={typedParamData.value}
                step={typedParamData.step.toString()}
                name={param}
                range={[typedParamData.min, typedParamData.max]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Effect;