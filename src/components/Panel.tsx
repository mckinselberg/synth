import React, { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import Synth from "./Synth";
import Slider from './Slider';
import Effect from './Effect';
import { availableEffects, availableEffectsWithParams } from '../utils/availableEffectsWithParams';
import "../scss/panel.scss";

const debug = false;

const Panel = () => {
  const polySynth = useRef();
  const synths = {
    synth: Tone.Synth,
    amSynth: Tone.AMSynth,
    fmSynth: Tone.FMSynth,
    duoSynth: Tone.DuoSynth,
    monoSynth: Tone.MonoSynth,
    // pluckSynth: Tone.PluckSynth,
    membraneSynth: Tone.MembraneSynth,
    metalSynth: Tone.MetalSynth,
    // noiseSynth: Tone.NoiseSynth,
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

  const [effectsWithParams, setEffectsWithParams] = useState(availableEffectsWithParams);
  const paramsUpdater = (e, effect, param) => {
    const tempEffectsWithParams = {...effectsWithParams};
    tempEffectsWithParams[effect][param].value = e.target.value;
    setEffectsWithParams(tempEffectsWithParams);
  }

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
      high: eqVals.highLevel,
    });    
    availableEffectsRef.current = {
      chorus: new Tone.Chorus(
        effectsWithParams.chorus.frequency.value,
        effectsWithParams.chorus.delayTime.value,
        effectsWithParams.chorus.depth.value
      ),
      pingPong: new Tone.PingPongDelay(
        effectsWithParams.pingPong.delayTime.value,
        effectsWithParams.pingPong.maxDelay.value
      ),
      // reverb: new Tone.Reverb(
      //   effectsWithParams.reverb.decay.value,
      // ),
      autoWah: new Tone.AutoWah(
        effectsWithParams.autoWah.baseFrequency.value,
        effectsWithParams.autoWah.octaves,
        effectsWithParams.autoWah.sensitivity.value
      ),
      distortion: new Tone.Distortion(effectsWithParams.distortion.distortion.value),
      crusher: new Tone.BitCrusher(effectsWithParams.crusher.bits.value),
      cheby: new Tone.Chebyshev(effectsWithParams.cheby.order.value),
      phaser: new Tone.Phaser({
        frequency: effectsWithParams.phaser.frequency.value,
        octaves: effectsWithParams.phaser.octaves.value,
        baseFrequency: effectsWithParams.phaser.baseFrequency.value,
      }),
      tremolo: new Tone.Tremolo(
        effectsWithParams.tremolo.frequency.value,
        effectsWithParams.tremolo.depth.value
      ),
      vibrato: new Tone.Vibrato(
        effectsWithParams.vibrato.frequency.value,
        effectsWithParams.vibrato.depth.value
      ),
      autoFilter: new Tone.AutoFilter(
        effectsWithParams.autoFilter.frequency.value,
      ).start(),
    }

    availableEffectsRef.current.pingPong.wet.value = effectsWithParams.pingPong.wet.value;
    // availableEffectsRef.current.reverb.wet.value = effectsWithParams.reverb.wet.value;
    
    availableEffectsRef.current.autoWah.Q.value = effectsWithParams.autoWah.q.value;

    const appliedEffects = effects.map(effect => {
      return availableEffectsRef.current[effect];
    });

    polySynth.current.chain(
      ...appliedEffects,
      eq.current,
      destination.current
    );
    
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
  }, [activeSynthName, attack, release, waveShape, effects, eqVals, effectsWithParams]);

  return (
    <div>
      <div className="synth-container">
        <Synth polySynth={polySynth} />
      </div>
      <div className="dropdowns-sliders-container">
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
          {['low', 'mid', 'high'].map((band, idx) => {
            return (
              <Slider
                key={`${band}_${idx}`}
                handleChange={(e) => handleEqChange(e, band)}
                value={eqVals[`${band}Level`]}
                step="0.01"
                name={band}
                range={[-20,20]}
              />
            )
          })}
        </div>
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
      </div>
      <div className="effects-container">
        <p>{effects.map(effect => `${effect} => `)} {effects.length > 0 ? ` out ` : <span>&nbsp;</span>}</p>
        <div className="effects">
          {availableEffects.map((effect, idx) => {
            return (
              <Effect 
                key={`${effect}_${idx}`}
                effect={effect}
                idx={idx}
                handleEffectsChange={handleEffectsChange}
                effectsWithParams={effectsWithParams[effect]}
                paramsUpdater={paramsUpdater}
              />
            )}
          )}
        </div>
      </div>
    </div>
  )
}

export default Panel;