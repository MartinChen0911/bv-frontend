import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import { fromBech32Address, isBech32Address } from 'lib/address/bech32';
import { fromBVAddress, isBVAddress } from 'lib/address/bv';

export default function useCheckAddressFormat(hash: string) {
  const router = useRouter();
  const hasBech32Format = config.UI.views.address.hashFormat.availableFormats.includes('bech32') && isBech32Address(hash);
  const hasBVFormat = config.UI.views.address.hashFormat.availableFormats.includes('bv') && isBVAddress(hash);
  const [ isLoading, setIsLoading ] = React.useState(hasBech32Format || hasBVFormat);

  React.useEffect(() => {
    if (!isLoading) {
      return;
    }

    let base16Hash: string | null = hash;

    if (hasBech32Format) {
      base16Hash = fromBech32Address(hash);
    } else if (hasBVFormat) {
      base16Hash = fromBVAddress(hash);
    }

    if (base16Hash && base16Hash !== hash) {
      router.replace({ pathname: '/address/[hash]', query: { ...router.query, hash: base16Hash } });
    } else {
      setIsLoading(false);
    }
  }, [ hash, isLoading, router, hasBech32Format, hasBVFormat ]);

  return isLoading;
}
