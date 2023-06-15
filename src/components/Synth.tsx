import React from 'react';
import Keyboard from './Keyboard';
import "../scss/synth.scss";

const Synth = ({polySynth, keyCodesMap, availableKeys}) => {

  const handleMouseleave = () => {
    polySynth.current.releaseAll();
  }

  return (
    <div id="synth"
      onMouseLeave={handleMouseleave}
    >
      <Keyboard
        keyCodesMap={keyCodesMap}
        availableKeys={availableKeys}
        polySynth={polySynth}
      />
    </div>
  );
}

export default Synth;
