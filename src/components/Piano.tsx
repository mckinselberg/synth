import * as Tone from 'tone';
import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';

const debug = false;

const Piano = ({polySynth}) => {
  // keyboard to note mappings
  // convert this to an array or a map to preserve order
  // const keyCodes = {
  //   z: "C4",
  //   s: "C#4",
  //   x: "D4",
  //   d: "D#4",
  //   c: "E4",
  //   v: "F4",
  //   g: "F#4",
  //   b: "G4",
  //   h: "G#4",
  //   n: "A4",
  //   j: "A#4",
  //   m: "B4",
  //   ",": "C5",
  //   l: "C#5",
  //   ".": "D5",
  //   ";": "D#5",
  //   '/': "E5",
  //   q: "F5",
  //   "2": "F#5",
  //   w: "G5"
  // }

  // const keyCodesMap = new Map();
  // for (const [key, value] of Object.entries(keyCodes)) {
  //   keyCodesMap.set(key, value);
  // }

  const keyCodesMap = new Map();
  keyCodesMap.set("z", "C4");
  keyCodesMap.set("s", "C#4");
  keyCodesMap.set("x", "D4");
  keyCodesMap.set("d", "D#4");
  keyCodesMap.set("c", "E4");
  keyCodesMap.set("v", "F4");
  keyCodesMap.set("g", "F#4");
  keyCodesMap.set("b", "G4");
  keyCodesMap.set("h", "G#4");
  keyCodesMap.set("n", "A4");
  keyCodesMap.set("j", "A#4");
  keyCodesMap.set("m", "B4");
  keyCodesMap.set(",", "C5");
  keyCodesMap.set("l", "C#5");
  keyCodesMap.set(".", "D5");
  keyCodesMap.set(";", "D#5");
  keyCodesMap.set("/", "E5");
  keyCodesMap.set("q", "F5");
  keyCodesMap.set("2", "F#5");
  keyCodesMap.set("w", "G5");
  keyCodesMap.set("3", "G#5");
  keyCodesMap.set("e", "A5");


  // const availableKeys = Object.keys(keyCodes);
  const availableKeys = Array.from(keyCodesMap.keys());
  const [activeNotes, setActiveNotes] = useState({});
  const [toneStarted, setToneStarted] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [clickedNote, setClickedNote] = useState(null);
 
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
    // if (!activeNotes[keyCodes[e.key]]) {
    //   polySynth.current.triggerAttack(keyCodes[e.key]);
    //   const tempActiveNotes = {...activeNotes}
    //   tempActiveNotes[keyCodes[e.key]] = true;
    //   setActiveNotes(tempActiveNotes);
    // }
    if (!activeNotes[keyCodesMap.get(e.key)]) {
      polySynth.current.triggerAttack(keyCodesMap.get(e.key));
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[keyCodesMap.get(e.key)] = true;
      setActiveNotes(tempActiveNotes);
    }
    e.preventDefault();
  }

  const endNote = (e) => {
    e.preventDefault();
    const now = Tone.now();
    // polySynth.current.triggerRelease(keyCodes[e.key], now);
    // const tempActiveNotes = {...activeNotes}
    // tempActiveNotes[keyCodes[e.key]] = false;
    // setActiveNotes(tempActiveNotes);
    polySynth.current.triggerRelease(keyCodesMap.get(e.key), now);
    const tempActiveNotes = {...activeNotes}
    tempActiveNotes[keyCodesMap.get(e.key)] = false;
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
  
  const handleMouseDown = (note) => {
    if(debug) {
      console.log(mouseDown);
      console.log(clickedNote);
    }
    setMouseDown(true);
    setClickedNote(note);
    if (!activeNotes[note]) {
      polySynth.current.triggerAttack(note);
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[note] = true;
      setActiveNotes(tempActiveNotes);
    }
  }

  const handleMouseUp = (note) => {
    if(debug) {
      console.log(mouseDown);
      console.log(clickedNote);
    }
    setMouseDown(false);
    setClickedNote(null);
    const now = Tone.now();
    polySynth.current.triggerRelease(note, now);
    const tempActiveNotes = {...activeNotes}
    tempActiveNotes[note] = false;
    setActiveNotes(tempActiveNotes);
  }

  const handleMouseEnter = (e, note) => {
    if(debug) {
      console.log(note);
      console.log(e);
    }
  }

  const handleMouseLeave = (e, note) => {
    if(debug) {
      console.log(note);
      console.log(e);
    }
  }

  return (
    <div id="piano">
      <Keyboard
        keyCodes={keyCodesMap}
        activeNotes={activeNotes}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </div>
  );
}

export default Piano;
