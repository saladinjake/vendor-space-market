// src/models/Plan.ts
import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  users_limit: number;
  deadline: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  users_limit: { type: Number, required: true },
  deadline: { type: Date, required: true },
  price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Plan = model<IPlan>('Plan', planSchema);
