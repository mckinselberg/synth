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

  const waveShapes = [
    'square',
    'sine',
    'sawtooth',
    'triangle',
  ];
  const [waveShape, setWaveShape] = useState(waveShapes[0]);
  const handleWaveShapeChange = (e) => {
    setWaveShape(e.target.value);
  }

  const effects = {
    pingPong: new Tone.PingPongDelay("8n", 0.1).toDestination(),
    autoFilter: new Tone.AutoFilter("4n").toDestination(),
    autoWah: new Tone.AutoWah(50, 6, -30).toDestination(),
    crusher: new Tone.BitCrusher(4).toDestination(),
  }
  const [effect, setEffect] = useState('none');
  const handleEffectChange = (e) => {
    setEffect(e.target.value);
  }
  
  const [attack, setAttack] = useState(0);
  const handleAttackChange = (e) => {
    setAttack(e.target.value);
  }

  const [release, setRelease] = useState(0);
  const handleReleaseChange = (e) => {
    setRelease(e.target.value);
  }

  const [eqVals, setEqVals] = useState({lowLevel: 0, midLevel: 0, highLevel: 0})
  const handleEqChange = (e, band) => {
    const tempEqVals = {...eqVals};
    tempEqVals[`${band}Level`] = e.target.value;
    setEqVals(tempEqVals);
  }

  useEffect(() => {
    polySynth.current = new Tone.PolySynth(activeSynth.current, {
        oscillator: {
          type: waveShape,
        },
        envelope: {
          attack: attack,
          release: release,
        },
    }).toDestination();
    polySynth.current.maxPolyphony = 10;
    polySynth.current.debug = debug;
    if (effect !== 'none') polySynth.current.connect(effects[effect]);
    if (effect === 'autoWah') effects[effect].Q.value = 6;
    // const eq = new Tone.EQ3(eqVals.lowLevel, eqVals.midLevel, eqVals.highLevel);
    return () => {
      polySynth.current.dispose();
      Object.keys(effects).forEach(effect => effects[effect].dispose());
      // eq.dispose();
    }
  }, [activeSynth.current, attack, release, waveShape, effect, eqVals]);

  return (
    <div>
      <Piano polySynth={polySynth} />
      <div className="dropdowns">
        <div className="synths">
          <select onChange={handleChangeSynth}>
            {Object.keys(synths).map((synth, idx) => {
              const name = synths[synth].name;
              return (<option key={`${synth}_${idx}`} value={synth}>
                {name}
              </option>)}
            )}
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
      </div>
      <div className="sliders">
        <Slider handleChange={handleAttackChange} value={attack} step="0.01" name="Attack" />
        <Slider handleChange={handleReleaseChange} value={release} step="0.01" name="Release" />
        <Slider handleChange={(e) => handleEqChange(e, 'low')} value={eqVals.lowLevel} step="0.01" name="Low" />
        <Slider handleChange={(e) => handleEqChange(e, 'mid')} value={eqVals.midLevel} step="0.01" name="Mid" />
        <Slider handleChange={(e) => handleEqChange(e, 'high')} value={eqVals.highLevel} step="0.01" name="High" />
      </div>
    </div>
  )
}

export default Panel;