import React from 'react';

const Slider = ({handleChange, value, step="0.1", name}) => {
  return (
    <div className="slider">
      <label htmlFor={name}>
        {name}
      </label>
      <input type="range" value={value} min="0" max="1" step={step} onChange={handleChange} name={name}></input>
    </div>
  );
}

export default Slider;