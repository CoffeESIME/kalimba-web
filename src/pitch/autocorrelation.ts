import { fft, ifft } from './fft';

export class AutoCorrelationDetector {
  detect(buffer: Float32Array, sampleRate: number): number | null {
    const n = buffer.length;
    let size = 1;
    while (size < n * 2) size <<= 1;
    const real = new Float32Array(size);
    const imag = new Float32Array(size);
    real.set(buffer);
    fft(real, imag);
    for (let i = 0; i < size; i++) {
      const re = real[i];
      const im = imag[i];
      real[i] = re * re + im * im;
      imag[i] = 0;
    }
    ifft(real, imag);
    let maxIdx = -1;
    let maxVal = 0;
    for (let i = 1; i < n; i++) {
      const val = real[i];
      if (val > maxVal) {
        maxVal = val;
        maxIdx = i;
      }
    }
    if (maxIdx <= 0) return null;
    return sampleRate / maxIdx;
  }
}
