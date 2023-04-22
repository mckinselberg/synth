import React, { useMemo } from 'react';
const keyRegex = /([#])/;
const noteRegex = /(C\B)|(F\B)/;

const Keyboard = ({ keyCodes, activeNotes }) => {

  const Key = ({note, activeNotes}) => {
    const keyColor = useMemo(() => keyRegex.test(note) ? `black` : `white`);
    const sharpOrFlat = useMemo(() => noteRegex.test(note) ? ` no-margin` : ``);
    const activeNote = activeNotes[note] ? ` active` : ``;
    const className = `key ${keyColor}${sharpOrFlat}${activeNote}`;
    return (
      <div 
        key={note}
        className={className}
        data-note={note}
      >
        <span>
          {note}
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
            activeNotes={activeNotes}
          />
        );
      })}
    </>
  );

}

export default Keyboard;