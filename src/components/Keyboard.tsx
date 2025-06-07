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

type ActiveNotes = { [note: string]: boolean };

const Keyboard: React.FC<KeyboardProps> = ({
  polySynth,
  availableKeys,
  keyCodesMap,
}) => {
  // Use React state for active notes
  const [activeNotes, setActiveNotes] = useState<ActiveNotes>({});
  const mouseDownRef = useRef(false);

  // Visibility change effect
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

  // Helper to update active notes state
  const setNoteActive = useCallback((note: string, isActive: boolean) => {
    setActiveNotes(prev => {
      if (prev[note] === isActive) return prev; // No unnecessary update
      return { ...prev, [note]: isActive };
    });
  }, []);

  // Keyboard event handlers
  const playNote = useCallback((e: KeyboardEvent) => {
    if (!availableKeys.some(key => key === e.key)) return;
    e.preventDefault();
    const note = keyCodesMap.get(e.key);
    if (!note) return;
    setActiveNotes(prev => {
      if (prev[note]) return prev;
      polySynth.current?.triggerAttack?.(note);
      return { ...prev, [note]: true };
    });
  }, [availableKeys, keyCodesMap, polySynth]);

  const endNote = useCallback((e: KeyboardEvent) => {
    if (!availableKeys.some(key => key === e.key)) return;
    e.preventDefault();
    const note = keyCodesMap.get(e.key);
    if (!note) return;
    const now = Tone.now();
    setActiveNotes(prev => {
      if (!prev[note]) return prev;
      polySynth.current?.triggerRelease?.(note, now);
      return { ...prev, [note]: false };
    });
  }, [availableKeys, keyCodesMap, polySynth]);

  useEffect(() => {
    window.addEventListener('keydown', playNote);
    window.addEventListener('keyup', endNote);
    return () => {
      window.removeEventListener('keydown', playNote);
      window.removeEventListener('keyup', endNote);
    };
  }, [playNote, endNote]);

  // Mouse and touch handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, note: string) => {
    e.preventDefault();
    mouseDownRef.current = true;
    setNoteActive(note, true);
    polySynth.current?.triggerAttack?.(note);
  }, [polySynth, setNoteActive]);

  const handleMouseUp = useCallback((e: React.MouseEvent, note: string) => {
    e.preventDefault();
    mouseDownRef.current = false;
    setNoteActive(note, false);
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
  }, [polySynth, setNoteActive]);

  const handleMouseEnter = useCallback((e: React.MouseEvent, note: string) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    setNoteActive(note, true);
    polySynth.current?.triggerAttack?.(note);
  }, [polySynth, setNoteActive]);

  const handleMouseLeave = useCallback((e: React.MouseEvent, note: string) => {
    if (!mouseDownRef.current) return;
    e.preventDefault();
    setNoteActive(note, false);
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
  }, [polySynth, setNoteActive]);

  const handleTouchStart = useCallback((e: React.TouchEvent, note: string) => {
    e.preventDefault();
    setNoteActive(note, true);
    polySynth.current?.triggerAttack?.(note);
  }, [polySynth, setNoteActive]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, note: string) => {
    e.preventDefault();
    setNoteActive(note, false);
    const now = Tone.now();
    polySynth.current?.triggerRelease?.(note, now);
  }, [polySynth, setNoteActive]);

  // Key component memoized for performance and accessibility
  const Key = React.memo(function Key({ note, keyboardKey, isActive }: { note: string, keyboardKey: string, isActive: boolean }) {
    const keyColor = useMemo(() => keyRegex.test(note) ? `black` : `white`, [note]);
    const sharpOrFlat = useMemo(() => noteRegex.test(note) ? ` no-margin` : ``, [note]);
    const activeNote = isActive ? ` active` : ``;
    const className = `key ${keyColor}${sharpOrFlat}${activeNote}`;
    const keyRef = useRef<HTMLDivElement>(null);

    // Keyboard accessibility: handle space/enter to trigger notes
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setNoteActive(note, true);
        polySynth.current?.triggerAttack?.(note);
      }
    }, [note, polySynth, setNoteActive]);

    const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setNoteActive(note, false);
        const now = Tone.now();
        polySynth.current?.triggerRelease?.(note, now);
      }
    }, [note, polySynth, setNoteActive]);

    return (
      <div
        key={note}
        data-key={note}
        className={className}
        data-note={note}
        ref={keyRef}
        tabIndex={0} // Make focusable
        role="button"
        aria-pressed={isActive}
        aria-label={`Piano key ${note} (${keyboardKey})`}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={{ outline: 'none' }} // Remove default outline, rely on CSS for focus
      >
        <div
          onMouseDown={e => handleMouseDown(e, note)}
          onMouseUp={e => handleMouseUp(e, note)}
          onTouchStart={e => handleTouchStart(e, note)}
          onTouchEnd={e => handleTouchEnd(e, note)}
          onMouseEnter={e => handleMouseEnter(e, note)}
          onMouseLeave={e => handleMouseLeave(e, note)}
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
          isActive={!!activeNotes[note]}
        />
      ))}
    </>
  );
};

export default Keyboard;