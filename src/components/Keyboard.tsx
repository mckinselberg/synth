import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import "../scss/keyboard.scss";

const keyRegex = /([#])/;
const noteRegex = /(C\B)|(F\B)/;

interface IKeyProps {
  note: string,
  keyboardKey: string,
  activeNotes: object,
}

interface IKeyCodeMap {
  [key: string]: string
}

const Keyboard = ({
  polySynth,
  availableKeys,
  keyCodesMap,
}) => {
  const [activeNotes, setActiveNotes] = useState({});
  const [toneStarted, setToneStarted] = useState(false);
  // const [mouseDown, setMouseDown] = useState(false);
  const mouseDownRef = useRef(false);

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

    if (!activeNotes[keyCodesMap.get(e.key)]) {
      polySynth.current.triggerAttack(keyCodesMap.get(e.key));
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[keyCodesMap.get(e.key)] = true;
      setActiveNotes(tempActiveNotes);
    }
  }

  const endNote = (e) => {
    e.preventDefault();
    const now = Tone.now();
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
  
  const handleMouseDown = (e, note) => {
    e.preventDefault();
    mouseDownRef.current = true;
    if (!activeNotes[note]) {
      polySynth.current.triggerAttack(note);
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[note] = true;
      setActiveNotes(tempActiveNotes);
    }
  }

  const handleMouseUp = (e, note) => {
    e.preventDefault();
    mouseDownRef.current = false;
    const now = Tone.now();
    polySynth.current.triggerRelease(note, now);
    const tempActiveNotes = {...activeNotes}
    tempActiveNotes[note] = false;
    setActiveNotes(tempActiveNotes);
  }

  const handleMouseEnter = (e, note) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    // e.stopPropagation();
    
    // if mouse is down and mouse position is within the target's padding, trigger note
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const padding = 5;
    if ((x > padding && x < rect.width - padding && y > padding && y < rect.height - padding) && !activeNotes[note]) {
      console.log(note)
      polySynth.current.triggerAttack(note);
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[note] = true;
      const now = Tone.now();
      setActiveNotes(tempActiveNotes);
    }

    if (!activeNotes[note]) {
      polySynth.current.triggerAttack(note);
      const tempActiveNotes = {...activeNotes}
      tempActiveNotes[note] = true;
      const now = Tone.now();
      setActiveNotes(tempActiveNotes);
    }
  }

  const handleMouseLeave = (e, note) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    // e.stopPropagation();
    const now = Tone.now();
    polySynth.current.triggerRelease(note, now);
    const tempActiveNotes = {...activeNotes}
    tempActiveNotes[note] = false;
    Tone.Transport.scheduleOnce(setActiveNotes(tempActiveNotes), now);
  }


  const Key = ({note, keyboardKey, activeNotes}: IKeyProps ) => {
    const keyColor = useMemo(() => keyRegex.test(note) ? `black` : `white`);
    const sharpOrFlat = useMemo(() => noteRegex.test(note) ? ` no-margin` : ``);
    const activeNote = activeNotes[note] ? ` active` : ``;
    const className = `key ${keyColor}${sharpOrFlat}${activeNote}`;
    const keyRef = useRef(null);
    return (
      <div 
        key={note}
        data-key={note}
        className={className}
        data-note={note}
        ref={keyRef}
        >
        <div
          onMouseDown={(e) => handleMouseDown(e, note)}
          onMouseUp={(e) => handleMouseUp(e, note)}
          onTouchStart={(e) => handleMouseDown(e, note)}
          onTouchEnd={(e) => handleMouseUp(e, note)}
          onMouseEnter={(e) => handleMouseEnter(e, note)}
          onMouseLeave={(e) => handleMouseLeave(e, note)}
        >
          {/* <p>{note}</p> */}
          {/* <p>{keyboardKey}</p> */}
          <p>{note}<br/>({keyboardKey})</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {Array.from(keyCodesMap).map((keyCode: React.JSX.Element) => {
        const note = keyCode[1];
        const keyboardKey = keyCode[0];
        return (
          <Key 
            key={`${note}${keyboardKey}`}
            note={note}
            keyboardKey={keyboardKey}
            activeNotes={activeNotes}
          />
        );
      })}
    </>
  );

}

export default Keyboard;