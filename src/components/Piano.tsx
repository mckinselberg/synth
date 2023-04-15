import * as Tone from 'tone';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Keyboard from './Keyboard';

const debug = false;
let toneStarted = false;

const Piano = () => {
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
  // const [disabled, setDisabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeNotes, setActiveNotes] = useState({});
  const [activeNotesArray, setActiveNotesArray] = useState([]);
  const synth = Tone.Synth;
  const polySynth = useRef();
    
  useEffect(() => {
    polySynth.current = new Tone.PolySynth(synth, {
      oscillator: {
        type: "triangle"
      },
    }).toDestination();
    polySynth.current.maxPolyphony = 10000;
    polySynth.current.debug = debug;
    // Tone.context.lookAhead = 0.1; 
    return () => polySynth.current.dispose();

  }, []);

  const playMelody = () => {
    const notes = ["G4", "Bb4", "Db5", "Eb3", "F4", "Ab2", "Bb4", "Db6"];
    const rhythms = ["4n", "8n.", "16n", "8n", "8n.", "8n", "8n", "4n"];
    const time = Tone.now();
    const play = (time) => {
      notes.forEach((note, i) => {
        polySynth.current.triggerAttackRelease(note, rhythms[i], time);
        time += Tone.Time(rhythms[i]).toSeconds();
      });
    }
    play(time);
  };


  const playNote = (e) => {
    if (!toneStarted) Tone.Transport.start();
    // if (debug) console.log(polySynth.current._voices);
    if (e.repeat) {
      e.preventDefault();
      return;
    }
    
    if (!availableKeys.some(key => key === e.key)) {
      return;
    }
    
    const now = Tone.now();
    if (!activeNotes[keyCodes[e.key]]) {
      polySynth.current.triggerAttack(keyCodes[e.key]);
      activeNotes[keyCodes[e.key]] = true;
      setActiveNotes({...activeNotes});
      setActiveNotesArray(activeNotesArray.push(keyCodes[e.key]));
    }
    e.preventDefault();
  }

  const endNote = (e) => {
    e.preventDefault();
    // if (debug) console.log(`endNote: ${keyCodes[e.key]}`);
    const activeNotesArrayFromObject = Object.keys(activeNotes);
    if (!activeNotesArrayFromObject.some(note => note === keyCodes[e.key])) {
      return;
    }

    const now = Tone.now();
    const decay = 1000;
    polySynth.current.triggerRelease(keyCodes[e.key], now);

    const voices = polySynth.current._voices;
    const idx = activeNotesArray.indexOf(keyCodes[e.key]);

    setActiveNotesArray(activeNotesArray.splice(idx, 1));
    voices.splice(idx, 1);
    activeNotes[keyCodes[e.key]] = false;
    setActiveNotes({...activeNotes});

    // Tone.Transport.schedule(() => {
    //   voices[idx].dispose();
    // }, now + decay);
    
    // Tone.Transport.schedule(() => {
    //   const voices = polySynth.current._voices.pop();
    //   console.log(voices);
    //   // voice.dispose();
    // }, now + decay);
  }

  // const startLoop = () => {
  //   setDisabled(true);
  //   Tone.Transport.start();
  //   loop.current.start();
  // }  

  // const stopLoop = () => {
  //   loop.current.stop();
  //   Tone.Transport.stop();
  //   setDisabled(false);
  // }

  useEffect(() => {
    window.addEventListener('keydown', playNote);
    window.addEventListener('keyup', endNote);
    return () => {
      window.removeEventListener('keydown', playNote);
      window.removeEventListener('keyup', endNote);
    }
  }, []);

  return (
    <div id="piano">
      <Keyboard keyCodes={keyCodes} activeNotes={activeNotes} />
    </div>
  );
}

export default Piano;
