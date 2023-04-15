import * as Tone from 'tone';
import React, {useState, useRef, useCallback} from 'react';
import useEventListener from '../hooks/useEventListener';
import Keyboard from './Keyboard';
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

  const [disabled, setDisabled] = useState(false);  
  const [started, setStarted] = useState(false);
  const synth = useRef(new Tone.Synth().toDestination());
  const polySynth = useRef(new Tone.PolySynth().toDestination());
  const [activeNotes, setActiveNotes] = useState(new Array);
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

  const pressedKeys = {};
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

    if (!pressedKeys[keyCodes[e.key]]) {
      polySynth.current.triggerAttackRelease(keyCodes[e.key], now + 1000);
      pressedKeys[keyCodes[e.key]] = true;
      // const _activeNotes = activeNotes;
      // _activeNotes.push(keyCodes[e.key]);
      // console.log(_activeNotes);
      // setActiveNotes(_activeNotes);
      // const _activeNotes = activeNotes.slice(0);
      // _activeNotes.push(keyCodes[e.key])
      // console.log(_activeNotes);
      // setActiveNotes(_activeNotes);
      // activeNotes.current.push(keyCodes[e.key]);
    }
  }

  const endNote = (e) => {
    const now = Tone.now();
    polySynth.current.triggerRelease(keyCodes[e.key], now);
    pressedKeys[keyCodes[e.key]] = false;
    // const _activeNotes = activeNotes;
    // _activeNotes.splice(_activeNotes.indexOf(keyCodes[e.key]), 1);
    // console.log(activeNotes);
    // if (!pressedKeys[keyCodes[e.key]]) {
      // setActiveNotes(_activeNotes);
      // setActiveNotes(...activeNotes.splice(activeNotes.indexOf(keyCodes[e.key], 1)));
    // }
    // activeNotes.current.splice(activeNotes.current.indexOf(keyCodes[e.key]), 1);
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

  useEventListener('keydown', playNote);
  useEventListener('keyup', endNote);

  
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
        return (
          <div 
            key={note}
            className={`key ${keyRegex.test(note) ? `black` : `white`}${noteRegex.test(note) ? ` no-margin` : ``} 
            ${activeNotes.forEach(_note => {
              return _note === note ? ` active` : ``;
            })}`} 
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

