import React from 'react';
const keyRegex = /([#])/;
const noteRegex = /(C\B)|(F\B)/;

const Keyboard = ({ keyCodes, activeNotes }) => {
  return (
    <div id="piano">
      {Object.keys(keyCodes).map(_note => {
        
        const note = keyCodes[_note];
        const isActive = activeNotes.hasOwnProperty(note);
        const className = `key ${keyRegex.test(note) ? `black` : `white`}${noteRegex.test(note) ? ` no-margin` : ``}${isActive ? ` active` : ``}`;
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
      })}
    </div>
  );

}

export default Keyboard;