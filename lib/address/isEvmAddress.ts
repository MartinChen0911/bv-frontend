import { ADDRESS_REGEXP, BV_ADDRESS_REGEXP } from 'toolkit/utils/regexp';

export function isEvmAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return ADDRESS_REGEXP.test(trimmed) || BV_ADDRESS_REGEXP.test(trimmed);
}
