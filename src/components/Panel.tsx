import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import Piano from "./Piano";
import Slider from './Slider';

const debug = false;

const Panel = () => {
  const polySynth = useRef();
  const synths = {
    synth: Tone.Synth,
    amSynth: Tone.AMSynth,
    duoSynth: Tone.DuoSynth,
    monoSynth: Tone.MonoSynth,
    pluckSynth: Tone.PluckSynth,
    membraneSynth: Tone.MembraneSynth,
  };

  const activeSynth = useRef(synths.synth);
  const [activeSynthName, setActiveSynthName] = useState(activeSynth.current.name);
  const handleChangeSynth = (e) => {
    activeSynth.current = synths[e.target.value];
    setActiveSynthName(activeSynth.current.name);
  }
  
  const [attack, setAttack] = useState(0);
  const handleAttackChange = (e) => {
    setAttack(e.target.value);
  }

  const effects = {
    pingPong: new Tone.PingPongDelay("8n", 0.1).toDestination(),
    autoFilter: new Tone.AutoFilter("4n").toDestination(),
    autoWah: new Tone.AutoWah(50, 6, -30).toDestination(),
  }
  const [effect, setEffect] = useState('none');
  const handleEffectChange = (e) => {
    setEffect(e.target.value);
  }

  const waveShapes = [
    'sine',
    'square',
    'sawtooth',
    'triangle',
  ];
  const [waveShape, setWaveShape] = useState(waveShapes[0]);
  const handleWaveShapeChange = (e) => {
    setWaveShape(e.target.value);
  }

  useEffect(() => {
    polySynth.current = new Tone.PolySynth(activeSynth.current, {
        oscillator: {
          type: waveShape,
        },
        envelope: {
          attack: attack,
          release: 0.5,
        },
    }).toDestination();
    polySynth.current.maxPolyphony = 10;
    polySynth.current.debug = debug;
    if (effect !== 'none') polySynth.current.connect(effects[effect]);
    return () => {
      polySynth.current.dispose();
      Object.keys(effects).forEach(effect => effects[effect].dispose());
    }
  }, [activeSynth.current, attack, waveShape, effect]);


  return (
    <div>
      <Piano polySynth={polySynth} />
      <div className="synths">
        <select onChange={handleChangeSynth}>
          {Object.keys(synths).map((synth, idx) => 
            (<option key={`${synth}_${idx}`} value={synth}>
              {synths[synth].name}
            </option>))}
        </select>
      </div>
      <div className="wave-shapes">
        <select onChange={handleWaveShapeChange}>
          {waveShapes.map((waveShape, idx) => {
            return <option key={`${waveShape}_${idx}`}>{waveShape}</option>
          })}
        </select>
      </div>
      <div className="effects">
        <select onChange={handleEffectChange}>
          <option value="none">none</option>
          {Object.keys(effects).map((effect, idx) => {
            return <option key={`${effect}_${idx}`} value={effect}>{effect}</option>
          })}
        </select>
      </div>
      <div className="sliders">
        <Slider handleChange={handleAttackChange} value={attack} name="Attack" />
      </div>
    </div>
  )
}

export default Panel;