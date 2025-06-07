import React, { useCallback } from 'react';
import Keyboard from './Keyboard';
import "../scss/synth.scss";

const Synth = ({ polySynth, keyCodesMap, availableKeys }) => {
  // useCallback prevents unnecessary recreation of the function
  const handleMouseLeave = useCallback(() => {
    polySynth.current?.releaseAll?.();
  }, [polySynth]);

  return (
    <div id="synth" onMouseLeave={handleMouseLeave}>
      <Keyboard
        keyCodesMap={keyCodesMap}
        availableKeys={availableKeys}
        polySynth={polySynth}
      />
    </div>
  );
};

export default Synth;