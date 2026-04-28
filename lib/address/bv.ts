import bs58 from 'bs58';
import { sha256 } from 'js-sha256';

const BV_PREFIX = 'BV';
const ADDRESS_BYTES = 20;
const CHECKSUM_BYTES = 4;

export const BV_REGEXP = /^BV[1-9A-HJ-NP-Za-km-z]{24,40}$/;

export function toBVAddress(hash: string): string {
  if (!hash || !hash.startsWith('0x') || hash.length !== 42) {
    return hash;
  }
  try {
    const bytes = Buffer.from(hash.slice(2), 'hex');
    const checksum = new Uint8Array(sha256.arrayBuffer(bytes)).slice(0, CHECKSUM_BYTES);
    const combined = Buffer.concat([bytes, Buffer.from(checksum)]);
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
    const expected = new Uint8Array(sha256.arrayBuffer(addressBytes)).slice(0, CHECKSUM_BYTES);
    for (let i = 0; i < CHECKSUM_BYTES; i++) {
      if (checksum[i] !== expected[i]) return null;
    }
    return '0x' + Buffer.from(addressBytes).toString('hex');
  } catch {
    return null;
  }
}

export function isBVAddress(hash: string): boolean {
  return BV_REGEXP.test(hash);
}
