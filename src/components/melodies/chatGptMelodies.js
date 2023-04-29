// const loop = useRef(new Tone.Loop(time => {
  //   console.log('loop 1');
  //   polySynth.current.triggerAttackRelease("C2", "8n", time);
  //   polySynth.current.triggerAttackRelease("E3", "4n", time);
  //   polySynth.current.triggerAttackRelease("G3", "2n", time);
  // }, "4n"));

  // const loopCGPT1 = useRef(new Tone.Loop(time => {
  //   const randomKey = Object.keys(keyCodes)[Math.floor(Math.random() * Object.keys(keyCodes).length)];
  //   polySynth.current.triggerAttackRelease(keyCodes[randomKey], "8n", time);
  // }, "8n"));

  // const loopCGPT2 = useRef(new Tone.Loop(time => {
  //   console.log('loop 1');
  //   const notes = ["C4", "D4", "E4", "G4", "A4", "B4"];
  //   const note = notes[Math.floor(Math.random() * notes.length)];
  //   polySynth.current.triggerAttackRelease(note, "4n", time);
  // }, "4n"));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   polySynth.current.triggerAttackRelease(note, "8n", time);
  // }, [
  //   ["E4", "D4", "C4", "D4", "E4", "E4", "E4", null, "D4", "D4", "D4", null, "E4", "G4", "G4", null],
  //   [null, null, null, null, null, null, null, null, null, null, null, null, "D4", "D4", "D4", null],
  //   ["E4", "D4", "C4", "D4", "E4", "E4", "E4", null, "D4", "D4", "E4", "E4", "D4", "C4", null, null],
  //   [null, null, null, null, null, null, null, null, null, null, null, null, "E4", "E4", "E4", null]
  // ], "8n"));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   polySynth.current.triggerAttackRelease(note, "8n", time);
  // }, ["E4", "D4", "C4", "D4", "E4", "E4", "E4", "D4", "D4", "D4", "E4", "G4", "G4"], "4n"));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   if (note !== "rest") {
  //     polySynth.current.triggerAttackRelease(note, "4n", time);
  //   }
  // }, ["E4", "D4", "C4", "D4", "E4", "E4", "E4", "rest", "D4", "D4", "D4", "rest", "E4", "G4", "G4", "rest", "E4", "D4", "C4", "D4", "E4", "E4", "E4", "E4", "D4", "D4", "E4", "D4", "C4"], "4n"));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   if (note === 'rest') {
  //     // add a rest
  //     polySynth.current.triggerAttackRelease(note, '8n', time);
  //   } else {
  //     // play a note based on the melody
  //     polySynth.current.triggerAttackRelease(note, '8n', time);
  //   }
  // }, ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'rest', 'D4', 'D4', 'D4', 'rest', 'E4', 'G4', 'G4', 'rest'], '8n'));
  
  // PJ 
  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   console.log(`note: ${note} time: ${time}`);
  //   synth.triggerAttackRelease(note, "8n", time);
  // }, ["C4", "E4", "G4", "D4", "E4", "G4", "A4", "C5", "B4", "G4", "E4", "D4"], "4n"));
  
  // PJ Evenflow
  // const loop = useRef(new Tone.Loop(time => {
  //   const notes = ["E2", "G2", "A2", "D2", "E3", "G3", "A3", "D3"];
  //   let index = Math.floor(Math.random() * notes.length);
  //   let note = notes[index];
  //   if (index > 3) {
  //     note = `${note}m`;
  //   }
  //   console.log(note);
  //   polySynth.current.triggerAttackRelease(note, "8n", time);
  // }, "4n"));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   console.log(note);
  //   synth.triggerAttackRelease(note, '8n', time);
  // }, ['E2', 'B2', 'G2', 'D3'], '8n'));

  // const loop = useRef(new Tone.Loop(time => {
  //   const notes = ["D3", "A3", "D4", "G3", "E3", "G3", "D3", "A3"];
  //   const durations = ["2n", "2n", "2n", "4n", "4n", "4n", "4n", "4n"];
  //   const velocities = [0.8, 0.8, 0.8, 0.7, 0.7, 0.7, 0.7, 0.7];
  //   const index = Math.floor(Math.random() * notes.length);
    
  //   synth.triggerAttackRelease(notes[index], durations[index], time, velocities[index]);
  
  // }, "4n"));  

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, '8n', time);
  // }, ['C3', 'E3', 'G3', 'B3', 'D4', 'F4', 'A4', 'C5', 'E5', 'G5'], '8n'));

  // const loop = useRef(
  //   new Tone.Sequence((time, note) => {
  //     synth.triggerAttackRelease(note, `8n`, time);
  //   }, ["C3", "E3", "G3", "B3", "D4", "F4", "A4", "C5", "E5", "G5"].reverse().concat(["C6"]), "4n")
  // );

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, '8n', time);
  // }, ['C4', 'D4', 'E4', 'C4', 'E4', 'D4', 'C4', 'E4', 'F4', 'C4', 'F4', 'E4', 'C4', 'E4', 'D4', 'C4', 'F4', 'G4', 'C4', 'G4', 'F4', 'C4', 'E4', 'F4', 'G4', 'A4', 'C5'], '8n'));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, Tone.Time('8n').mult(Math.random() * 2 + 0.5), time);
  // }, ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'A3', 'A3', 'C4', 'E4', 'E4', 'C4', 'A3', 'A3', 'C4', 'E4', 'E4', 'C4', 'A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'A3', 'A3', 'C4', 'E4', 'E4', 'C4', 'A3', 'A3', 'C4', 'E4', 'E4', 'C4', 'A3', 'C4', 'E4', 'D4', 'C4'], '8n'));

  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, `${Math.random() > 0.5 ? '8n' : '16n'}`, time);
  // }, ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G#4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G#4', 'F4', 'E4', 'D4', 'C4', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'], '8n'));

  // harmonic minor
  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   if (note !== "r") {
  //     synth.triggerAttackRelease(note, '32n', time);
  //   }
  // }, ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G#4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'r', 'G#4', 'r', 'A4', 'r', 'G#4', 'r', 'F4', 'r', 'E4', 'r', 'D4', 'r', 'C4', 'r'], '8n'));

  // coltrane
  // const loop = useRef(new Tone.Sequence((time, note) => {
  //   synth.triggerAttackRelease(note, '8n', time);
  // }, ['D#5', 'G#5', 'A#5', 'C6', 'D#6', 'G#5', 'F#5', 'C#6', 'B5', 'E6', 'B5', 'C#6', 'D#6', 'F#6', 'G#6', 'D#6', 'G#5', 'D#6', 'C#6', 'A#5', 'D#6', 'A#5', 'G#5', 'C#6', 'D#6', 'G#5', 'A#5', 'C6', 'F6', 'E6', 'B5', 'C#6', 'D#6', 'G#5', 'D#6', 'G#5', 'D#6', 'C#6', 'A#5', 'D#6', 'A#5', 'G#5', 'C#6', 'D#6', 'G#5', 'A#5', 'C6', 'F6', 'E6', 'B5', 'C#6', 'D#6', 'G#5'], '8n'));

  // miles davis
  const loop = useRef(new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, '8n', time);
  }, ['Eb4', 'Bb3', 'G3', 'Bb3', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'Bb3', 'Eb4', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'G3', 'Bb3', 'G3', 'Eb3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'Bb3', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'G3', 'Bb3', 'G3', 'Eb3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'Bb3', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'G3', 'Bb3', 'G3', 'Eb3', 'Bb3'], '8n'));
