import React from 'react';

import config from 'configs/app';
import type { AddressFormat } from 'types/views/address';
import { useSettingsContext } from 'lib/contexts/settings';
import { Switch } from 'toolkit/chakra/switch';

const FORMAT_LABELS: Record<AddressFormat, string> = {
  base16: '0x (Hex)',
  bech32: config.UI.views.address.hashFormat.bech32Prefix ? `${ config.UI.views.address.hashFormat.bech32Prefix }1 (Bech32)` : 'Bech32',
  bv: 'BV (Base58Check)',
};

const SettingsAddressFormat = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.UI.views.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;

  const isBV = addressFormat === 'bv';
  const isBech32 = addressFormat === 'bech32';
  const isChecked = isBech32 || isBV;

  return (
    <Switch
      id="address-format"
      defaultChecked={ isChecked }
      onChange={ toggleAddressFormat }
      mt={ 4 }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
    >
      Show { FORMAT_LABELS[addressFormat] } format
    </Switch>
  );
};

export default React.memo(SettingsAddressFormat);
