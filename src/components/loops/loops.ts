

// const loop = useRef(new Tone.Loop(time => {
  //   console.log('loop 1');
  //   polySynth.current.triggerAttackRelease("C2", "8n", time);
  //   polySynth.current.triggerAttackRelease("E3", "4n", time);
  //   polySynth.current.triggerAttackRelease("G3", "2n", time);
  // }, "4n"));

  const loop = useRef(new Tone.Sequence((time, note) => {
    polySynth.current.triggerAttackRelease(note, '8n', time);
  }, ['Eb4', 'Bb3', 'G3', 'Bb3', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'Bb3', 'Eb4', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'G3', 'Bb3', 'G3', 'Eb3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'Bb3', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'G3', 'Bb3', 'G3', 'Eb3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'Bb3', 'D4', 'C4', 'Bb3', 'G3', 'Eb3', 'G3', 'Bb3', 'G3', 'Eb3', 'Bb3'], '128n'));