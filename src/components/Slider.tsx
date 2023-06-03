import React from 'react';
import './Slider.scss';

const Slider = ({
  handleChange,
  value,
  step="0.1",
  range=[0,1],
  name
}) => {
  return (
    <div className="slider">
      <label htmlFor={name}>
        {name}
      </label>
      <input
        type="range"
        value={value}
        min={range[0]}
        max={range[1]}
        step={step}
        onChange={handleChange}
        name={name}
      />
      <div>{value}</div>
    </div>
  );
}

export default Slider;