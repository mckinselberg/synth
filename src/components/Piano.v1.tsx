import * as Tone from 'tone';
import React, { useState, useRef, useCallback, useEffect } from 'react';
// import useEventListener from '../hooks/useEventListener';
// import Keyboard from './Keyboard';
// import debounce from '../utils/debounce';
// import throttle from '../utils/throttle';

const Piano = () => {
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

  const pressedKeys = {};

  const [disabled, setDisabled] = useState(false);  
  const [started, setStarted] = useState(false);
  const synth = useRef(new Tone.Synth().toDestination());
  const amSynth = useRef(new Tone.AMSynth().toDestination());
  const polySynth = useRef(new Tone.PolySynth({maxPolyphony: 8}).toDestination());
  const [activeNotes, setActiveNotes] = useState(pressedKeys);
  // const activeNotes = useRef([]); 

  const notes = ["G4", "Bb4", "Db5", "Eb3", "F4", "Ab2", "Bb4", "Db6"];
  const rhythms = ["4n", "8n.", "16n", "8n", "8n.", "8n", "8n", "4n"];
  const playMelody = () => {
    const time = Tone.now();
    const play = (time) => {
      notes.forEach((note, i) => {
        synth.current.triggerAttackRelease(note, rhythms[i], time);
        time += Tone.Time(rhythms[i]).toSeconds();
      });
    }
    play(time);
  };

  const loop = useRef(new Tone.Loop(time => {
    console.log('loop 1');
    polySynth.current.triggerAttackRelease("C2", "8n", time);
    polySynth.current.triggerAttackRelease("E3", "4n", time);
    polySynth.current.triggerAttackRelease("G3", "2n", time);
  }, "4n"));
  const startToneJS = (e) => {
    if (started) return;
    setStarted(true);
    console.log("Tone Ready");
  }

  const playNote = (e) => {
    if (e.repeat) {
      e.preventDefault();
      return;
    }
    const now = Tone.now();

    if (!availableKeys.some(key => key === e.key)) {
      return;
    }

    if (!pressedKeys[keyCodes[e.key]]) {
      polySynth.current.triggerAttackRelease(keyCodes[e.key], now + 1000);
      pressedKeys[keyCodes[e.key]] = true;
      setActiveNotes({...pressedKeys});
    }
  }

  const endNote = (e) => {
    if (!availableKeys.some(key => key === e.key)) {
      return;
    }
    const now = Tone.now();
    polySynth.current.triggerRelease(keyCodes[e.key], now);
    pressedKeys[keyCodes[e.key]] = false;
    setActiveNotes({...pressedKeys});
  }

  const startLoop = () => {
    setDisabled(true);
    Tone.Transport.start();
    loop.current.start();
  }  

  const stopLoop = () => {
    loop.current.stop();
    Tone.Transport.stop();
    setDisabled(false);
  }

  // useEventListener('keydown', playNote);
  // useEventListener('keyup', endNote);

  useEffect(() => {
    window.addEventListener('keydown', playNote);
    window.addEventListener('keyup', endNote);
    return () => {
      window.removeEventListener('keydown', playNote);
      window.removeEventListener('keyup', endNote);
    }
  }, [])

  
  const keyRegex = /([#])/;
  const noteRegex = /(C\B)|(F\B)/;

  return (
    <div>
      <div className="buttons">
        <button onClick={startToneJS}>click to start</button>
        <button onClick={startLoop} disabled={disabled}>start loop</button>
        <button onClick={stopLoop} disabled={false}>stop loop</button>
        <button onClick={playMelody}>play melody</button>
      </div>
      {/* <Keyboard keyCodes={keyCodes} activeNotes={activeNotes} /> */}
      <div id="piano">
        {Object.keys(keyCodes).map(_note => {
          const note = keyCodes[_note];
          const active = Object.keys(activeNotes).filter(possibleActiveNote => possibleActiveNote === note && activeNotes[possibleActiveNote]);
          return (
            <div 
              key={note}
              className={`key ${keyRegex.test(note) ? `black` : `white`}${noteRegex.test(note) ? ` no-margin` : ``}${active.length > 0 ? ` active` : ``}`}
              data-note={note}
            >
              <span>
                {note}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Piano;

