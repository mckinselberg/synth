import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import * as Tone from 'tone';
import Synth from "./Synth";
import Slider from './Slider';
import Effect from './Effect';
import { availableEffects, availableEffectsWithParams } from '../utils/availableEffectsWithParams';
import "../scss/panel.scss";
import EffectsChain from './EffectsChain';

const debug = false;

const keyCodesMap = new Map([
  ["z", "C4"], ["s", "C#4"], ["x", "D4"], ["d", "D#4"], ["c", "E4"], ["v", "F4"],
  ["g", "F#4"], ["b", "G4"], ["h", "G#4"], ["n", "A4"], ["j", "A#4"], ["m", "B4"],
  [",", "C5"], ["l", "C#5"], [".", "D5"], [";", "D#5"], ["/", "E5"], ["q", "F5"],
  ["2", "F#5"], ["w", "G5"], ["3", "G#5"], ["e", "A5"], ["4", "A#5"], ["r", "B5"],
  ["t", "C6"], ["6", "C#6"], ["y", "D6"], ["7", "D#6"], ["u", "E6"]
]);
const availableKeys = Array.from(keyCodesMap.keys());

const synths = {
  synth: Tone.Synth,
  amSynth: Tone.AMSynth,
  fmSynth: Tone.FMSynth,
  duoSynth: Tone.DuoSynth,
  monoSynth: Tone.MonoSynth,
  membraneSynth: Tone.MembraneSynth,
  metalSynth: Tone.MetalSynth,
};

const waveShapes = ['square', 'sine', 'sawtooth', 'triangle'];

const Panel: React.FC = () => {
  const polySynth = useRef<Tone.PolySynth | null>(null);
  const eq = useRef<Tone.EQ3 | null>(null);
  const availableEffectsRef = useRef<any>({});
  const destination = useRef(Tone.Destination);

  const [activeSynthName, setActiveSynthName] = useState<keyof typeof synths>('synth');
  const [activeWaveShape, setActiveWaveShape] = useState(waveShapes[0]);
  const [effects, setEffects] = useState<string[]>([]);
  const [attack, setAttack] = useState(0);
  const [release, setRelease] = useState(0);
  const [masterVolume, setMasterVolume] = useState(0);
  const [eqVals, setEqVals] = useState({ lowLevel: 0, midLevel: 0, highLevel: 0 });
  const [effectsWithParams, setEffectsWithParams] = useState(availableEffectsWithParams);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Apply theme to body
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Handlers
  const handleChangeSynth = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setActiveSynthName(e.target.value as keyof typeof synths);
  }, []);

  const handleWaveShapeChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setActiveWaveShape(e.target.value);
  }, []);

  const handleEffectsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEffects(prev =>
      e.target.checked
        ? [...prev, e.target.value]
        : prev.filter(effect => effect !== e.target.value)
    );
  }, []);

  const handleAttackChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAttack(Number(e.target.value));
  }, []);

  const handleReleaseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRelease(Number(e.target.value));
  }, []);

  const handleMasterVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMasterVolume(Number(e.target.value));
  }, []);

  const handleEqChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, band: string) => {
    setEqVals(prev => ({
      ...prev,
      [`${band}Level`]: Number(e.target.value)
    }));
  }, []);

  const paramsUpdater = useCallback((e: React.ChangeEvent<HTMLInputElement>, effect: string, param: string) => {
    setEffectsWithParams(prev => ({
      ...prev,
      [effect]: {
        ...prev[effect],
        [param]: {
          ...prev[effect][param],
          value: Number(e.target.value)
        }
      }
    }));
  }, []);

  // Memoize synth class
  const SynthClass = useMemo(() => synths[activeSynthName], [activeSynthName]);

  // Setup Tone.js synth/effects chain
  useEffect(() => {
    polySynth.current = new Tone.PolySynth(SynthClass, {
      oscillator: { type: activeWaveShape, phase: 0 },
      envelope: { attack, release },
    });
    polySynth.current.maxPolyphony = 10;
    polySynth.current.debug = debug;

    eq.current = new Tone.EQ3({
      low: eqVals.lowLevel,
      mid: eqVals.midLevel,
      high: eqVals.highLevel,
    });

    // Effects setup
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
        effectsWithParams.tremolo.depth.value,
      ),
      vibrato: new Tone.Vibrato(
        effectsWithParams.vibrato.frequency.value,
        effectsWithParams.vibrato.depth.value
      ),
      autoFilter: new Tone.AutoFilter(
        effectsWithParams.autoFilter.frequency.value,
      ).start(),
    };

    availableEffectsRef.current.pingPong.wet.value = effectsWithParams.pingPong.wet.value;
    availableEffectsRef.current.autoWah.Q.value = effectsWithParams.autoWah.q.value;
    availableEffectsRef.current.tremolo.debug = true;

    const appliedEffects = effects.map(effect => availableEffectsRef.current[effect]);

    polySynth.current.chain(
      ...appliedEffects,
      eq.current,
      destination.current
    );

    Tone.Destination.volume.value = masterVolume;

    return () => {
      appliedEffects.forEach(effect => effect.disconnect(polySynth.current));
      Object.values(availableEffectsRef.current).forEach((effect: any) => effect.dispose());
      eq.current?.dispose();
      eq.current = null;
      polySynth.current?.dispose();
      polySynth.current = null;
    };
  }, [
    SynthClass,
    attack,
    release,
    activeWaveShape,
    effects,
    eqVals,
    effectsWithParams,
    masterVolume
  ]);

  return (
    <div>
      {/* Theme selector UI */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <label htmlFor="theme-select" style={{ marginRight: 8 }}>Theme:</label>
        <select
          id="theme-select"
          value={theme}
          onChange={e => setTheme(e.target.value as 'light' | 'dark')}
          style={{ padding: '2px 8px', borderRadius: 4 }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="synth-container">
        <Synth polySynth={polySynth} keyCodesMap={keyCodesMap} availableKeys={availableKeys} />
      </div>
      <div className="dropdowns-sliders-container">
        <div className="sliders">
          <Slider
            handleChange={handleMasterVolumeChange}
            value={masterVolume}
            step="1"
            name="Master Volume"
            range={[-50, 0]}
          />
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
          {['low', 'mid', 'high'].map((band, idx) => (
            <Slider
              key={`${band}_${idx}`}
              handleChange={e => handleEqChange(e, band)}
              value={eqVals[`${band}Level` as keyof typeof eqVals]}
              step="0.01"
              name={band}
              range={[-20, 20]}
            />
          ))}
        </div>
        <div className="radio-buttons">
          <fieldset className="synths">
            <legend>Synths</legend>
            {Object.keys(synths).map((synth, idx) => (
              <label key={`${synth}_${idx}`}>
                <input
                  name="synthRadioButtons"
                  onChange={handleChangeSynth}
                  type="radio"
                  value={synth}
                  checked={synth === activeSynthName}
                />
                {synth}
              </label>
            ))}
          </fieldset>
          <fieldset className="wave-shapes">
            <legend>Wave Shapes</legend>
            {waveShapes.map((waveShape, idx) => (
              <label key={`${waveShape}_${idx}`}>
                <input
                  name="waveShapeRadioButtons"
                  onChange={handleWaveShapeChange}
                  type="radio"
                  value={waveShape}
                  checked={waveShape === activeWaveShape}
                />
                {waveShape}
              </label>
            ))}
          </fieldset>
        </div>
        <div className="dropdowns">
          <div className="synths">
            <label>
              Synth
              <select onChange={handleChangeSynth} value={activeSynthName}>
                {Object.keys(synths).map((synth, idx) => (
                  <option key={`${synth}_${idx}`} value={synth}>{synth}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="wave-shapes">
            <label>
              Wave Shape
              <select onChange={handleWaveShapeChange} value={activeWaveShape}>
                {waveShapes.map((waveShape, idx) => (
                  <option key={`${waveShape}_${idx}`} value={waveShape}>{waveShape}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="effects-container">
        <EffectsChain effects={effects} setEffects={setEffects} />
        <div className="effects">
          {availableEffects.map((effect, idx) => (
            <Effect
              key={`${effect}_${idx}`}
              effect={effect}
              idx={idx}
              handleEffectsChange={handleEffectsChange}
              effectsWithParams={effectsWithParams[effect]}
              paramsUpdater={paramsUpdater}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panel;
