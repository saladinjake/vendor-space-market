export interface IUser {
    id: string;
    email: string;
    passwordHash: string;
    workspace_id?: string; // Reference to Workspace/Vendor after admin verification
    role: 'owner' | 'admin' | 'collaborator';
    created_at: Date;
    updated_at: Date;
  }
  


  // src/models/User.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'owner' | 'admin' | 'collaborator';
  workspace_id?: string;  // Reference to workspace if verified
  otp: string;
  otpVerified: boolean;
  created_at: Date;
  updated_at: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['owner', 'admin', 'collaborator'], default: 'owner' },
  workspace_id: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  otp: { type: String, required: true },
  otpVerified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

 const UserModel = model<IUser>('User', userSchema);
 export default UserModel



  
