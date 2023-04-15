import React, { useEffect, useState } from "react";
import * as Tone from "tone";

const Piano = () => {
  const noteMap = {
    65: "C4", // A
    83: "D4", // S
    68: "E4", // D
    70: "F4", // F
    71: "G4", // G
    72: "A4", // H
    74: "B4", // J
    75: "C5", // K
    // Add more key mappings as necessary
  };

  const [playingNotes, setPlayingNotes] = useState({});

  const synth = new Tone.Synth().toDestination();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const note = noteMap[event.keyCode];
      if (note && !playingNotes[note]) {
        synth.triggerAttackRelease(note, "8n");
        setPlayingNotes({ ...playingNotes, [note]: true });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [playingNotes, noteMap, synth]);

  useEffect(() => {
    const handleKeyUp = (event) => {
      const note = noteMap[event.keyCode];
      if (note) {
        setPlayingNotes({ ...playingNotes, [note]: false });
      }
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [playingNotes, noteMap]);

  return <div>Piano component</div>;
};

export default Piano;