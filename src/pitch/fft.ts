export function fft(real: Float32Array, imag: Float32Array): void {
  const n = real.length;
  if (n !== imag.length) {
    throw new Error('Mismatched lengths');
  }
  if ((n & (n - 1)) !== 0) {
    throw new Error('Length must be power of two');
  }

  // Bit-reversal permutation
  for (let i = 0, j = 0; i < n; i++) {
    if (j > i) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
    let m = n >> 1;
    while (m >= 1 && j >= m) {
      j -= m;
      m >>= 1;
    }
    j += m;
  }

  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const tableStep = (2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let j = 0; j < half; j++) {
        const k = i + j;
        const l = k + half;
        const angle = tableStep * j;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const treal = cos * real[l] - sin * imag[l];
        const timag = sin * real[l] + cos * imag[l];
        real[l] = real[k] - treal;
        imag[l] = imag[k] - timag;
        real[k] += treal;
        imag[k] += timag;
      }
    }
  }
}

export function ifft(real: Float32Array, imag: Float32Array): void {
  const n = real.length;
  for (let i = 0; i < n; i++) {
    imag[i] = -imag[i];
  }
  fft(real, imag);
  for (let i = 0; i < n; i++) {
    real[i] /= n;
    imag[i] = -imag[i] / n;
  }
}
