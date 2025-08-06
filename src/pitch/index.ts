import { AutoCorrelationDetector } from './autocorrelation';

export type PitchDetectionAlgorithm = 'autocorrelation' | 'crepe' | 'pitchy';

export interface PitchDetector {
  detect(buffer: Float32Array, sampleRate: number): number | null;
}

class NullDetector implements PitchDetector {
  detect(): number | null {
    return null;
  }
}

export function createPitchDetector(algo: PitchDetectionAlgorithm): PitchDetector {
  switch (algo) {
    case 'autocorrelation':
      return new AutoCorrelationDetector();
    case 'crepe':
    case 'pitchy':
    default:
      return new NullDetector();
  }
}
