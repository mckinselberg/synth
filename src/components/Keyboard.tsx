import React, { useMemo } from 'react';
const keyRegex = /([#])/;
const noteRegex = /(C\B)|(F\B)/;

interface IKeyProps {
  note: string,
  keyboardKey: string,
  activeNotes: object
}

interface IKeyCodeMap {
  [key: string]: string
}

const Keyboard = ({
  keyCodes,
  activeNotes,
  handleMouseDown,
  handleMouseUp,
  handleMouseEnter,
  handleMouseLeave
}) => {

  const Key = ({note, keyboardKey, activeNotes}: IKeyProps ) => {
    const keyColor = useMemo(() => keyRegex.test(note) ? `black` : `white`);
    const sharpOrFlat = useMemo(() => noteRegex.test(note) ? ` no-margin` : ``);
    const activeNote = activeNotes[note] ? ` active` : ``;
    const className = `key ${keyColor}${sharpOrFlat}${activeNote}`;
    return (
      <div 
        key={note}
        data-key={note}
        className={className}
        data-note={note}
        onMouseDown={(e) => handleMouseDown(e, note)}
        onMouseUp={(e) => handleMouseUp(e, note)}
        onTouchStart={(e) => handleMouseDown(e, note)}
        onTouchEnd={(e) => handleMouseUp(e, note)}
        onMouseEnter={(e) => handleMouseEnter(e, note)}
        onMouseLeave={(e) => handleMouseLeave(e, note)}
      >
        <span>
          <p>{note}</p>
          <p>{keyboardKey}</p>
        </span>
      </div>
    );
  }

  return (
    <>
      {Array.from(keyCodes).map((keyCode: Array<any>) => {
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