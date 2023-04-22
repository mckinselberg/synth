import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';

const Piano = ({polySynth}) => {
  // keyboard to note mappings
  const keyCodes = {
    a: "C4",
    w: "C#4",
    s: "D4",
    e: "D#4",
    d: "E4",
    f: "F4",
    t: "F#4",
    g: "G4",
    y: "G#4",
    h: "A4",
    u: "A#4",
    j: "B4",
    k: "C5",
    o: "C#5",
    l: "D5",
    p: "D#5",
    ';': "E5",
    "'": "F5",
  }

  const availableKeys = Object.keys(keyCodes);
  const [activeNotes, setActiveNotes] = useState({});
  const [toneStarted, setToneStarted] = useState(false)

 
  const playNote = (e) => {

    if (!toneStarted) {
      Tone.Transport.start();
      setToneStarted(true);
    } 

    if (!availableKeys.some(key => key === e.key)) {
      return;
    } else {
      e.preventDefault();
    }
    
    // const now = Tone.now();
    if (!activeNotes[keyCodes[e.key]]) {
      polySynth.current.triggerAttack(keyCodes[e.key]);
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[keyCodes[e.key]] = true;
      setActiveNotes(tempActiveNotes);
    }
    e.preventDefault();
  }

  const endNote = (e) => {
    e.preventDefault();
    const now = Tone.now();
    polySynth.current.triggerRelease(keyCodes[e.key], now);
    const tempActiveNotes = {...activeNotes}
    tempActiveNotes[keyCodes[e.key]] = false;
    setActiveNotes(tempActiveNotes);
  }

  useEffect(() => {
    window.addEventListener('keydown', playNote);
    window.addEventListener('keyup', endNote);
    return () => {
      window.removeEventListener('keydown', playNote);
      window.removeEventListener('keyup', endNote);
    }
  });
  

  return (
    <div id="piano">
      <Keyboard keyCodes={keyCodes} activeNotes={activeNotes} />
    </div>
  );
}

export default Piano;
