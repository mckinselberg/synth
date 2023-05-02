import React, { useMemo } from 'react';
const keyRegex = /([#])/;
const noteRegex = /(C\B)|(F\B)/;

const Keyboard = ({ keyCodes, activeNotes, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave }) => {

  const Key = ({note, keyboardKey, activeNotes}) => {
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
        onMouseDown={() => handleMouseDown(note)}
        onMouseUp={() => handleMouseUp(note)}
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

  const MemoizedKey = React.memo((props) => <Key {...props}/>)

  return (
    <>
      {Object.keys(keyCodes).map(_note => {
        return (
          <MemoizedKey 
            key={_note}
            note={keyCodes[_note]}
            keyboardKey={_note}
            activeNotes={activeNotes}
          />
        );
      })}
    </>
  );

}

export default Keyboard;