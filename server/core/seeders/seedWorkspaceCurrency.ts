// src/utils/seedWorkspace.ts
import { Workspace } from '../models/vendorWorkSpace';
import { WorkspaceCurrency } from '../models/vendorSpaceCurrency';
import { currencies } from '../utils/currencyIsos';
import mongoose from 'mongoose';

const seedWorkspaceData = async () => {
  const workspace = new Workspace({
    name: 'Global Workspace',
    supported_currencies: currencies.map(currency => ({
      currency_code: currency.code,
      is_default: currency.code === 'USD',  // Default currency set to USD
    })),
    created_at: new Date(),
    updated_at: new Date(),
  });

  await workspace.save();
  console.log('Workspace seeded successfully!');

  // Now seed WorkspaceCurrency for all supported currencies
  for (const currency of currencies) {
    const workspaceCurrency = new WorkspaceCurrency({
      currency_code: currency.code,
      store_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      is_default: currency.code === 'USD', // Default currency
    });

    await workspaceCurrency.save();
  }
  
  console.log('Currencies seeded successfully!');
};

// Call the seeding function
seedWorkspaceData().then(() => mongoose.connection.close());
