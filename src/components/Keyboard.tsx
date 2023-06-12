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

// interface IKeyCodeMap {
//   [key: string]: string
// }

// disable Tone context when window is not focused
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    Tone.Transport.pause();
  } else {
    Tone.Transport.start();
  }
});

const Keyboard = ({
  polySynth,
  availableKeys,
  keyCodesMap,
}) => {
  const activeNotesRef = useRef({});
  const [toneStarted, setToneStarted] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const mouseDownRef = useRef(false);

  const playNote = (e) => {
    e.preventDefault();
    if (!toneStarted) {
      Tone.start();
      Tone.Transport.start();
      setToneStarted(true);
    }

    if (!availableKeys.some(key => key === e.key)) {
      return;
    } else {
      e.preventDefault();
    }

    if (!activeNotesRef.current[keyCodesMap.get(e.key)]) {
      polySynth.current.triggerAttack(keyCodesMap.get(e.key));
      activeNotesRef.current[keyCodesMap.get(e.key)] = true;
      if (e.repeat) return;
      setForceRender(!forceRender);
    }
  }

  const endNote = (e) => {
    e.preventDefault();
    const now = Tone.now();
    polySynth.current.triggerRelease(keyCodesMap.get(e.key), now);
    activeNotesRef.current[keyCodesMap.get(e.key)] = false;
    setForceRender(!forceRender);
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
    if (!activeNotesRef.current[note]) {
      polySynth.current.triggerAttack(note);
      activeNotesRef.current[note] = true;
      setForceRender(!forceRender);
    }
  }

  const handleMouseUp = (e, note) => {
    e.preventDefault();
    mouseDownRef.current = false;
    const now = Tone.now();
    polySynth.current.triggerRelease(note, now);
    activeNotesRef.current[note] = false;
    setForceRender(!forceRender);

  }

  const handleMouseEnter = (e, note) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    if (!activeNotesRef.current[note]) {
      polySynth.current.triggerAttack(note);
      activeNotesRef.current[note] = true;
      setForceRender(!forceRender);
    }
  }

  const handleMouseLeave = (e, note) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    const now = Tone.now();
    polySynth.current.triggerRelease(note, now);
    activeNotesRef.current[note] = false;
    setForceRender(!forceRender);
  }

  const handleTouchStart = (e, note) => {
    if (!toneStarted) {
      Tone.start();
      Tone.Transport.start();
      setToneStarted(true);
    }
    e.preventDefault();
    if (!activeNotesRef.current[note]) {
      polySynth.current.triggerAttack(note);
      activeNotesRef.current[note] = true;
      setForceRender(!forceRender);
    }
  }

  const handleTouchEnd = (e, note) => {
    e.preventDefault();
    const now = Tone.now();
    polySynth.current.triggerRelease(note, now);
    activeNotesRef.current[note] = false;
    setForceRender(!forceRender);
  }

  const startTone = (e) => {
    if (!toneStarted) {
      Tone.start();
      Tone.Transport.start();
      setToneStarted(true);
      alert('started');
      document.removeEventListener('touchstart', startTone);
    }
  }

  useEffect(() => {
    document.addEventListener('touchstart', startTone);
  }, []);



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
          onTouchStart={(e) => handleTouchStart(e, note)}
          onTouchEnd={(e) => handleTouchEnd(e, note)}
          onMouseEnter={(e) => handleMouseEnter(e, note)}
          onMouseLeave={(e) => handleMouseLeave(e, note)}
        >
          <p>
            <span>{note}</span>
            <br/>
            <span>
              ({keyboardKey})
            </span>
          </p>
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
            activeNotes={activeNotesRef.current}
          />
        );
      })}
    </>
  );

}

export default Keyboard;