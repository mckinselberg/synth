const SatieMelody = () => {
  const notes = ["C3", "E3", "G3", "B3", "D4", "F4", "A4", "C5", "E5", "G5"];
  const durations = ["8n", "8n", "8n", "8n", "8n", "8n", "8n", "8n", "8n", "4n"];

  const synth = new Tone.Synth().toDestination();

  const playMelody = () => {
    const now = Tone.now();
    notes.forEach((note, i) => {
      synth.triggerAttackRelease(note, durations[i], now + i * 0.5);
    });
  };

  return (
    <div>
      <button onClick={playMelody}>Play Satie Melody</button>
    </div>
  );
};

export default