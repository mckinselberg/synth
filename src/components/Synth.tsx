import React from 'react';
import Keyboard from './Keyboard';
import "../scss/synth.scss";

const Synth = ({polySynth, keyCodesMap, availableKeys}) => {

  return (
    <div id="synth">
      <Keyboard
        keyCodesMap={keyCodesMap}
        availableKeys={availableKeys}
        polySynth={polySynth}
      />
    </div>
  );
}

export default Synth;
