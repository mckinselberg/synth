import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import "../scss/keyboard.scss";

const keyRegex = /([#])/;
const noteRegex = /(C\B)|(F\B)/;

type KeyboardProps = {
  polySynth: React.MutableRefObject<any>;
  availableKeys: string[];
  keyCodesMap: Map<string, string>;
};

const Keyboard: React.FC<KeyboardProps> = ({
  polySynth,
  availableKeys,
  keyCodesMap,
}) => {
  const activeNotesRef = useRef({});
  const [_, forceUpdate] = useState(false); // Forcing re-render
  const mouseDownRef = useRef(false);

  // Visibility change effect moved here
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        Tone.Transport.pause();
      } else {
        Tone.Transport.start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Helper to force re-render
  const rerender = useCallback(() => forceUpdate(f => !f), []);

  const playNote = useCallback((e) => {
    if (!availableKeys.some(key => key === e.key)) return;
    e.preventDefault();
    const note = keyCodesMap.get(e.key);
    if (!activeNotesRef.current[note]) {
      polySynth.current?.triggerAttack?.(note);
      activeNotesRef.current[note] = true;
      if (!e.repeat) rerender();
    }
  }, [availableKeys, keyCodesMap, polySynth, rerender]);

  const endNote = useCallback((e) => {
    e.preventDefault();
    const note = keyCodesMap.get(e.key);
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
    activeNotesRef.current[note] = false;
    rerender();
  }, [keyCodesMap, polySynth, rerender]);

  useEffect(() => {
    window.addEventListener('keydown', playNote);
    window.addEventListener('keyup', endNote);
    return () => {
      window.removeEventListener('keydown', playNote);
      window.removeEventListener('keyup', endNote);
    };
  }, [playNote, endNote]);

  // Mouse and touch handlers
  const handleMouseDown = useCallback((e, note) => {
    e.preventDefault();
    mouseDownRef.current = true;
    if (!activeNotesRef.current[note]) {
      polySynth.current?.triggerAttack?.(note);
      activeNotesRef.current[note] = true;
      rerender();
    }
  }, [polySynth, rerender]);

  const handleMouseUp = useCallback((e, note) => {
    e.preventDefault();
    mouseDownRef.current = false;
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
    activeNotesRef.current[note] = false;
    rerender();
  }, [polySynth, rerender]);

  const handleMouseEnter = useCallback((e, note) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    if (!activeNotesRef.current[note]) {
      polySynth.current?.triggerAttack?.(note);
      activeNotesRef.current[note] = true;
      rerender();
    }
  }, [polySynth, rerender]);

  const handleMouseLeave = useCallback((e, note) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
    activeNotesRef.current[note] = false;
    rerender();
  }, [polySynth, rerender]);

  const handleTouchStart = useCallback((e, note) => {
    e.preventDefault();
    if (!activeNotesRef.current[note]) {
      polySynth.current?.triggerAttack?.(note);
      activeNotesRef.current[note] = true;
      rerender();
    }
  }, [polySynth, rerender]);

  const handleTouchEnd = useCallback((e, note) => {
    e.preventDefault();
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
    activeNotesRef.current[note] = false;
    rerender();
  }, [polySynth, rerender]);

  // Key component memoized for performance
  const Key = React.memo(function Key({ note, keyboardKey, activeNotes }) {
    const keyColor = useMemo(() => keyRegex.test(note) ? `black` : `white`, [note]);
    const sharpOrFlat = useMemo(() => noteRegex.test(note) ? ` no-margin` : ``, [note]);
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
            <br />
            <span>
              ({keyboardKey})
            </span>
          </p>
        </div>
      </div>
    );
  });

  return (
    <>
      {(Array.from(keyCodesMap) as [string, string][]).map(([keyboardKey, note]) => (
        <Key
          key={`${note}${keyboardKey}`}
          note={note}
          keyboardKey={keyboardKey}
          activeNotes={activeNotesRef.current}
        />
      ))}
    </>
  );
};

export default Keyboard;