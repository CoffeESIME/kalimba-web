import { useEffect, useState } from 'react';
import { createPitchDetector, PitchDetectionAlgorithm } from '../pitch';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNote(freq: number): string {
  const noteNumber = 12 * (Math.log2(freq / 440)) + 69;
  const rounded = Math.round(noteNumber);
  const name = NOTE_NAMES[rounded % 12];
  const octave = Math.floor(rounded / 12) - 1;
  return `${name}${octave}`;
}

export interface DetectedPitch {
  frequency: number;
  note: string;
}

export function usePitch(algorithm: PitchDetectionAlgorithm = 'autocorrelation') {
  const [pitch, setPitch] = useState<DetectedPitch | null>(null);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let rafId: number;
    let cancelled = false;

    const detector = createPitchDetector(algorithm);
    const bufferLength = 2048;
    const buffer = new Float32Array(bufferLength);

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = bufferLength;
        source.connect(analyser);

        const update = () => {
          if (cancelled || !analyser) return;
          analyser.getFloatTimeDomainData(buffer);
          const freq = detector.detect(buffer, audioContext!.sampleRate);
          if (freq) {
            setPitch({ frequency: freq, note: frequencyToNote(freq) });
          } else {
            setPitch(null);
          }
          rafId = requestAnimationFrame(update);
        };
        update();
      } catch (err) {
        console.error('Microphone init failed', err);
      }
    }
    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [algorithm]);

  return pitch;
}
