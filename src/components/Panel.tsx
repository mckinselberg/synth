import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import Synth from "./Synth";
import Slider from './Slider';

const debug = true;

const Panel = () => {
  const polySynth = useRef();
  const synths = {
    synth: Tone.Synth,
    amSynth: Tone.AMSynth,
    duoSynth: Tone.DuoSynth,
    monoSynth: Tone.MonoSynth,
    pluckSynth: Tone.PluckSynth,
    membraneSynth: Tone.MembraneSynth,
    metalSynth: Tone.MetalSynth,
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
  
  const availableEffects = [
    'pingPong',
    'autoFilter',
    'autoWah',
    'crusher',
    'cheby',
    'phaser',
  ];
  const [effects, setEffects] = useState(new Array());
  // const handleEffectChange = (e) => {
  //   // console.log(e.target.checked);
  //   let tempEffects = [...effects];
  //   if (e.target.checked) {
  //     tempEffects.push(availableEffects[e.target.value])
  //   } else {
  //     tempEffects.splice(tempEffects.indexOf(availableEffects[e.target.value], 1));
  //   }

  //   setEffects(tempEffects);
  // }

  const handleEffectsChange = (e) => {
    const tempEffects = [...effects]
    if (e.target.checked) {
      tempEffects.push(e.target.value);
    } else {
      tempEffects.splice(tempEffects.indexOf(e.target.value), 1);
    }
    setEffects(tempEffects);
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

  const destination = useRef(Tone.Destination);
  const eq = useRef();
  const availableEffectsRef = useRef();

  useEffect(() => {
    availableEffectsRef.current = {
      pingPong: new Tone.PingPongDelay("8n", 0.1),
      autoFilter: new Tone.AutoFilter("4n"),
      autoWah: new Tone.AutoWah(50, 6, -30),
      crusher: new Tone.BitCrusher(4),
      cheby: new Tone.Chebyshev(2),
      phaser: new Tone.Phaser({
        frequency: 15,
        octaves: 5,
        baseFrequency: 1000
      }),
    }
    polySynth.current = new Tone.PolySynth(activeSynth.current, {
        oscillator: {
          type: waveShape,
          phase: 0,
        },
        envelope: {
          attack: attack,
          release: release,
        },
    });
    polySynth.current.maxPolyphony = 10;
    polySynth.current.debug = debug;
    eq.current = new Tone.EQ3({
      low: eqVals.lowLevel,
      mid: eqVals.midLevel,
      high: eqVals.highLevel
    });
    eq.current.debug = debug;
    const actualEffects = effects.map(effect => {
      return availableEffectsRef.current[effect];
    });

    polySynth.current.chain(...actualEffects, eq.current, destination.current);
    
    return () => {
      actualEffects.forEach(effect => {
        effect.disconnect(polySynth.current);
      });
      Object.keys(availableEffectsRef.current).map(effect => {
        availableEffectsRef.current[effect].dispose();
      });
      eq.current.dispose();
      eq.current = null;
      polySynth.current.dispose();
      polySynth.current = null;
    }
  }, [activeSynthName, attack, release, waveShape, effects, eqVals]);

  const checkboxRefs = useRef(availableEffects);

  return (
    <div>
      <Synth polySynth={polySynth} />
      <div className="dropdowns">
        <div className="synths">
          <select onChange={handleChangeSynth}>
            {Object.keys(synths).map((synth, idx) => {
              return (<option key={`${synth}_${idx}`} value={(synth)}>{synth}</option>)}
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
          {/* <select onChange={handleEffectChange}>
            <option value="none">none</option>
            {Object.keys(effects).map((effect, idx) => {
              return <option key={`${effect}_${idx}`} value={effect}>{effect}</option>
            })}
          </select> */}
          {availableEffects.map((effect, idx) => {
            return (
              <div key={`${effect}_${idx}`}>
                <input type="checkbox" id={effect} name="effect" value={effect} onChange={handleEffectsChange} />
                <label htmlFor={effect}>{effect}</label>
              </div>
            )
          })}
        </div>
      </div>
      <div className="sliders">
        <Slider handleChange={handleAttackChange} value={attack} step="0.01" name="Attack" />
        <Slider handleChange={handleReleaseChange} value={release} step="0.01" name="Release" />
        <div>
          <Slider handleChange={(e) => handleEqChange(e, 'low')} value={eqVals.lowLevel} step="0.01" name="Low" range={[-20,20]} />
          <div>{eqVals.lowLevel}</div>
        </div>
        <div>
          <Slider handleChange={(e) => handleEqChange(e, 'mid')} value={eqVals.midLevel} step="0.01" name="Mid" range={[-20,20]} />
          <div>{eqVals.midLevel}</div>
        </div>
        <div>
          <Slider handleChange={(e) => handleEqChange(e, 'high')} value={eqVals.highLevel} step="0.01" name="High" range={[-20,20]} />
          <div>{eqVals.highLevel}</div>
        </div>
      </div>
    </div>
  )
}

export default Panel;