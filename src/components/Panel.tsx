import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import Synth from "./Synth";
import Slider from './Slider';
import Effect from './Effect';
import { availableEffectsWithParams as avp } from '../utils/availableEffectsWithParams';

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

  const availableEffectsRef = useRef();
  const availableEffects = [
    'pingPong',
    'autoFilter',
    'autoWah',
    'crusher',
    'cheby',
    'phaser',
  ];

  const [effects, setEffects] = useState([]);
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

  const eq = useRef();
  const [eqVals, setEqVals] = useState({lowLevel: 0, midLevel: 0, highLevel: 0})
  const handleEqChange = (e, band) => {
    const tempEqVals = {...eqVals};
    tempEqVals[`${band}Level`] = e.target.value;
    setEqVals(tempEqVals);
  }

  const destination = useRef(Tone.Destination);

  useEffect(() => {
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
    availableEffectsRef.current = {
      pingPong: new Tone.PingPongDelay(avp.pingPong.delayTime.value, avp.pingPong.maxDelay.value),
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
    const appliedEffects = effects.map(effect => {
      return availableEffectsRef.current[effect];
    });

    polySynth.current.chain(...appliedEffects, eq.current, destination.current);
    
    return () => {
      appliedEffects.forEach(effect => {
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
      </div>
      <div className="checkboxes">
        <div className="effects">
          {availableEffects.map((effect, idx) => {
            return effect !== 'pingPong' ? null : (
              <Effect 
                key={`${effect}_${idx}`}
                effect={effect}
                idx={idx}
                handleEffectsChange={handleEffectsChange}
                params={avp[effect]}
              />
            )}
          )}
        </div>
      </div>
      <div className="sliders">
        <Slider 
          handleChange={handleAttackChange} 
          value={attack}
          step="0.01"
          name="Attack"
        />
        <Slider
          handleChange={handleReleaseChange}
          value={release}
          step="0.01"
          name="Release"
        />
        <Slider
          handleChange={(e) => handleEqChange(e, 'low')}
          value={eqVals.lowLevel}
          step="0.01"
          name="Low"
          range={[-20,20]}
        />
        <Slider
          handleChange={(e) => handleEqChange(e, 'mid')}
          value={eqVals.midLevel}
          step="0.01"
          name="Mid"
          range={[-20,20]}
        />
        <Slider
          handleChange={(e) => handleEqChange(e, 'high')}
          value={eqVals.highLevel}
          step="0.01"
          name="High"
          range={[-20,20]}
        />
      </div>
    </div>
  )
}

export default Panel;