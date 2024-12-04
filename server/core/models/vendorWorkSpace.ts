// src/models/Workspace.ts
import { Schema, model, Document, Types } from 'mongoose';
// Define the interface for the supported currencies collection
interface IStoreCurrency {
    currency_code: string;
    exchange_rate?: number;  // Optional field for exchange rates if necessary
  }

export interface IWorkspace extends Document {
  name: string;
  owner_id: Types.ObjectId;  // Reference to the user who owns the workspace
  plan_id: string;   // Subscription plan
  api_key: string;
  license_key: string;
  license_expiry_date: Date;
  status: 'pending' | 'active' | 'declined' |  'deleted';
  user_limit: number; // Max users based on the selected plan
  verified_at: Date | null; // Date when the workspace was verified by admin
  isActive: boolean; // To track active or soft-deleted stores


  supported_currencies: IStoreCurrency[]; // List of supported currencies
  default_sales_channel_id: string | null; // Default sales channel ID (optional)
  default_region_id: string | null;       // Default region ID (optional)
  default_location_id: string | null;     // Default location ID (optional)
  metadata: Record<string, unknown> | null; // Metadata for additional information (optional)
  created_at: Date;                    // Timestamp of creation
  updated_at: Date;                    // Timestamp of last update
  deleted_at: Date | null;             // Timestamp of soft deletion (optional)
}

const workspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan_id: { type: String, required: true },
  api_key: { type: String, required: true },
  user_limit: { type: Number, required: true }, // Max users based on plan
  isActive: { type: Boolean, default: true },
  verified_at: { type: Date, default: null }, // Admin verification date
  license_key: { type: String, required: true },
  license_expiry_date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'active', 'declined', 'deleted'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Add a pre-save hook to update `updated_at` and handle `deleted_at`
workspaceSchema.pre<IWorkspace>('save', function (next) {
    if (this.isModified()) {
      this.updated_at = new Date();
    }
  
    // Handle soft deletion logic if `deleted_at` is set
    if (this.deleted_at) {
      this.status = 'deleted';  // Optionally, you can set a "deleted" status
    }
    
    next();
  });
  
  // Add a method to perform soft delete (set the `deleted_at` field)
  workspaceSchema.methods.softDelete = function (): void {
    this.deleted_at = new Date();  // Set the soft delete timestamp
  };
  

export const Workspace = model<IWorkspace>('Workspace', workspaceSchema);


//usg
// import { Workspace } from './models/Workspace';

// const workspaceId = 'workspace123';

// Workspace.findOne({ id: workspaceId })
//   .then((workspace) => {
//     if (workspace) {
//       workspace.softDelete();
//       workspace.save()
//         .then(() => console.log('Workspace soft deleted'))
//         .catch((err) => console.log('Error saving workspace:', err));
//     } else {
//       console.log('Workspace not found');
//     }
//   })
//   .catch((err) => console.log('Error fetching workspace:', err));
