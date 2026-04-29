import bs58 from 'bs58';
import { sha256 } from 'js-sha256';

const BV_PREFIX = 'BV';
const ADDRESS_BYTES = 20;
const CHECKSUM_BYTES = 4;

export const BV_REGEXP = /^BV[1-9A-HJ-NP-Za-km-z]{24,40}$/;

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a);
  result.set(b, a.length);
  return result;
}

export function toBVAddress(hash: string): string {
  if (!hash || !hash.startsWith('0x') || hash.length !== 42) {
    return hash;
  }
  try {
    const bytes = hexToBytes(hash.slice(2));
    const checksum = new Uint8Array(sha256.arrayBuffer(bytes)).slice(0, CHECKSUM_BYTES);
    const combined = concatBytes(bytes, checksum);
    return BV_PREFIX + bs58.encode(combined);
  } catch {
    return hash;
  }
}

export function fromBVAddress(hash: string): string | null {
  if (!hash || !hash.startsWith(BV_PREFIX)) {
    return null;
  }
  try {
    const decoded = bs58.decode(hash.slice(BV_PREFIX.length));
    if (decoded.length !== ADDRESS_BYTES + CHECKSUM_BYTES) return null;
    const addressBytes = decoded.slice(0, ADDRESS_BYTES);
    const checksum = decoded.slice(ADDRESS_BYTES);
    const expected = new Uint8Array(sha256.arrayBuffer(new Uint8Array(addressBytes))).slice(0, CHECKSUM_BYTES);
    for (let i = 0; i < CHECKSUM_BYTES; i++) {
      if (checksum[i] !== expected[i]) return null;
    }
    return '0x' + bytesToHex(addressBytes);
  } catch {
    return null;
  }
}

export function isBVAddress(hash: string): boolean {
  return BV_REGEXP.test(hash);
}
