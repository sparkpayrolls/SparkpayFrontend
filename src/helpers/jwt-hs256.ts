/**
 * Browser-compatible HS256 JWT sign/verify.
 * Replaces jsonwebtoken (Node-only since v9; KeyObject breaks in the browser).
 */

function utf8ToBytes(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }
  const utf8 = unescape(encodeURIComponent(str));
  const bytes = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) bytes[i] = utf8.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof btoa !== 'undefined'
      ? btoa(binary)
      : Buffer.from(bytes).toString('base64');
  return base64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlToBytes(str: string): Uint8Array {
  const padded =
    str.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (str.length % 4)) % 4);
  if (typeof atob !== 'undefined') {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  return new Uint8Array(Buffer.from(padded, 'base64'));
}

function base64UrlEncodeJson(value: unknown): string {
  return bytesToBase64Url(utf8ToBytes(JSON.stringify(value)));
}

function rotr(n: number, x: number) {
  return (x >>> n) | (x << (32 - n));
}

function sha256(message: Uint8Array): Uint8Array {
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  const bitLen = message.length * 8;
  const withOne = message.length + 1;
  const totalLen = (withOne + 8 + 63) & ~63;
  const block = new Uint8Array(totalLen);
  block.set(message);
  block[message.length] = 0x80;
  const view = new DataView(block.buffer);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 0x100000000), false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let i = 0; i < totalLen; i += 64) {
    for (let j = 0; j < 16; j++) {
      w[j] = view.getUint32(i + j * 4, false);
    }
    for (let j = 16; j < 64; j++) {
      const v1 = w[j - 15];
      const s0 = rotr(7, v1) ^ rotr(18, v1) ^ (v1 >>> 3);
      const v2 = w[j - 2];
      const s1 = rotr(17, v2) ^ rotr(19, v2) ^ (v2 >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let j = 0; j < 64; j++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

function hmacSha256(key: Uint8Array, data: Uint8Array): Uint8Array {
  const blockSize = 64;
  let keyed = key;
  if (keyed.length > blockSize) keyed = sha256(keyed);
  if (keyed.length < blockSize) {
    const padded = new Uint8Array(blockSize);
    padded.set(keyed);
    keyed = padded;
  }

  const oKey = new Uint8Array(blockSize);
  const iKey = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    oKey[i] = keyed[i] ^ 0x5c;
    iKey[i] = keyed[i] ^ 0x36;
  }

  const inner = new Uint8Array(blockSize + data.length);
  inner.set(iKey);
  inner.set(data, blockSize);

  const outer = new Uint8Array(blockSize + 32);
  outer.set(oKey);
  outer.set(sha256(inner), blockSize);
  return sha256(outer);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function signHs256(payload: unknown, secret: string): string {
  const header = base64UrlEncodeJson({ alg: 'HS256', typ: 'JWT' });

  // Match jsonwebtoken: objects get iat + JSON body; strings/buffers are raw payload bytes.
  const isObjectPayload =
    payload !== null &&
    typeof payload === 'object' &&
    !(typeof Buffer !== 'undefined' && Buffer.isBuffer(payload));

  const body = isObjectPayload
    ? base64UrlEncodeJson({
        ...(payload as Record<string, unknown>),
        iat: Math.floor(Date.now() / 1000),
      })
    : bytesToBase64Url(utf8ToBytes(String(payload)));

  const data = `${header}.${body}`;
  const signature = bytesToBase64Url(
    hmacSha256(utf8ToBytes(secret), utf8ToBytes(data)),
  );
  return `${data}.${signature}`;
}

export function verifyHs256<T = unknown>(token: string, secret: string): T {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }

  const [header, body, signature] = parts;
  const data = `${header}.${body}`;
  const expected = hmacSha256(utf8ToBytes(secret), utf8ToBytes(data));
  const actual = base64UrlToBytes(signature);

  if (!timingSafeEqual(expected, actual)) {
    throw new Error('Invalid signature');
  }

  const raw = new TextDecoder().decode(base64UrlToBytes(body));
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Non-JSON payloads (e.g. deflated base64 strings) are returned as-is.
    return raw as T;
  }
}
