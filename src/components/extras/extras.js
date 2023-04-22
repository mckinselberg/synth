// const startLoop = () => {
//   setDisabled(true);
//   Tone.Transport.start();
//   loop.current.start();
// }  

// const stopLoop = () => {
//   loop.current.stop();
//   Tone.Transport.stop();
//   setDisabled(false);
// }


{/* {!started ? <button class="buttons" onClick={startTone}>start</button> : null} */}




const playMelody = () => {
  const notes = ["G4", "Bb4", "Db5", "Eb3", "F4", "Ab2", "Bb4", "Db6"];
  const rhythms = ["4n", "8n.", "16n", "8n", "8n.", "8n", "8n", "4n"];
  const time = Tone.now();
  const play = (time) => {
    notes.forEach((note, i) => {
      polySynth.current.triggerAttackRelease(note, rhythms[i], time);
      time += Tone.Time(rhythms[i]).toSeconds();
    });
  }
  play(time);
};




  // const [disabled, setDisabled] = useState(false);
  // const [started, setStarted] = useState(false);



const startTone = () => {
  try {
    Tone.start();
    // setStarted(true);
  } catch (e) {
    console.error(e);
  }
}

const playMelody = () => {
  const notes = ["G4", "Bb4", "Db5", "Eb3", "F4", "Ab2", "Bb4", "Db6"];
  const rhythms = ["4n", "8n.", "16n", "8n", "8n.", "8n", "8n", "4n"];
  const time = Tone.now();
  const play = (time) => {
    notes.forEach((note, i) => {
      polySynth.current.triggerAttackRelease(note, rhythms[i], time);
      time += Tone.Time(rhythms[i]).toSeconds();
    });
  }
  play(time);
};




    // Tone.Transport.schedule(() => {
    //   voices[idx].dispose();
    // }, now + decay);
    
    // Tone.Transport.schedule(() => {
    //   const voices = polySynth.current._voices.pop();
    //   console.log(voices);
    //   // voice.dispose();
    // }, now + decay);