// src/models/WorkspaceCurrency.ts
import { Schema, model, Document } from 'mongoose';

// Define the WorkspaceCurrency model interface
export interface IWorkspaceCurrency extends Document {
  currency_code: string; // Currency code (e.g., 'USD', 'EUR')
  store_id: string | null; // Store ID associated with the workspace, nullable
  store: any; // Reference to the Store model (optional)
  created_at: Date; // Timestamp of when the record was created
  updated_at: Date; // Timestamp of when the record was last updated
  deleted_at: Date | null; // Soft deletion timestamp, nullable
  is_default: boolean; // Whether this currency is the default currency for the workspace
}

// Define the WorkspaceCurrency schema
const workspaceCurrencySchema = new Schema<IWorkspaceCurrency>({
  currency_code: { type: String, required: true },   // Currency code, e.g., 'USD'
  store_id: { type: String, default: null },          // Store ID (nullable)
  store: { type: Schema.Types.ObjectId, ref: 'Store', default: null }, // Reference to Store model (nullable)
  created_at: { type: Date, default: Date.now },      // Creation timestamp
  updated_at: { type: Date, default: Date.now },      // Last update timestamp
  deleted_at: { type: Date, default: null },         // Soft delete timestamp (nullable)
  is_default: { type: Boolean, default: false },      // Whether this is the default currency
});

// Add pre-save hook to automatically update the `updated_at` field
workspaceCurrencySchema.pre<IWorkspaceCurrency>('save', function (next) {
  if (this.isModified()) {
    this.updated_at = new Date();
  }
  next();
});

// Method to perform a soft delete (sets `deleted_at` to current date)
workspaceCurrencySchema.methods.softDelete = function (): void {
  this.deleted_at = new Date();
};

// Create the WorkspaceCurrency model
export const WorkspaceCurrency = model<IWorkspaceCurrency>('WorkspaceCurrency', workspaceCurrencySchema);
