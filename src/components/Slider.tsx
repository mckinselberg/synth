import React from 'react';
import '../scss/slider.scss';

interface SliderProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
  range?: [number, number];
  name: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  step = 0.1,
  range = [0, 1],
  name,
}) => (
  <div className="slider">
    <label htmlFor={name}>{name}</label>
    <input
      type="range"
      value={value}
      min={range[0]}
      max={range[1]}
      step={step}
      onChange={onChange}
      name={name}
      id={name}
    />
    <div>{value}</div>
  </div>
);

export default Slider;