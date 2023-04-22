import React from 'react';

const Slider = ({handleChange, value, name}) => {
  return (
    <div className="slider">
      <label htmlFor={name}>
        {name}
      </label>
      <input type="range" value={value} min="0" max="1" step="0.1" onChange={handleChange} name={name}></input>
    </div>
  );
}

export default Slider;