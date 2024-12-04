// src/services/WorkspaceService.ts
import User from '../../modules/userManagementModule/model/user.model';
import { IWorkspace, Workspace } from '../models/vendorWorkSpace';
import { Plan } from '../models/planModel';
import { generateApiKey, generateLicenseKey } from '../utils/generateKeys';
import { sendOtpEmail, sendApprovalEmail,sendawaitingApprovalWorspaceEmail } from '../utils/emailUtils';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class WorkspaceService {

    // Step 1: Create Workspace, but don't activate it until payment is verified
    static async createWorkspace(userId: string, planId: string, workSpaceName: string) {
        const plan = await Plan.findById(planId);
        if (!plan) {
            throw new Error('Plan not found');
        }
        const newWorkspace = new Workspace({
            id: 'workspace123',
            name: workSpaceName ?? 'My Workspace',
            supported_currencies: [
                { currency_code: 'NGN', exchange_rate: 1 },
                { currency_code: 'USD', exchange_rate: 1 },
                { currency_code: 'EUR', exchange_rate: 0.85 },
            ],
            payment_status: "pending",
            default_sales_channel_id: null,
            default_region_id: null,
            default_location_id: null,
            metadata: { customSetting: true },
        });

        const vendorSpace = await newWorkspace.save()
        await vendorSpace.save();
        return vendorSpace; // Workspace is created, but not yet verified
    }


     // Step 1: Vendor Login
  static async login(email: string, password: string) {
    const vendor:any = await User.findOne({ email });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, vendor.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Step 2: Generate API key for the vendor
    const apiKey = generateApiKey();

    // Save the generated API Key
    vendor.apiKey = apiKey;
    await vendor.save();

    return {
      apiKey, // Send the API key to the client for future requests
    
    };
  }
    // User signup with OTP generation
    public static async signup(email: string, password: string, planId: string, workspaceName: string): Promise<string> {
        const plan = await Plan.findById(planId);
        if (!plan) return 'Plan not found';

        const userExists = await User.findOne({ email });
        if (userExists) return 'Email already exists';


        // Step 3: Direct user to payment gateway (simulated)
        const paymentSuccess = await this.simulatePayment(planId, email, workspaceName);

        if (!paymentSuccess) {
            throw new Error('Payment failed, please try again');
        }

        // send otp only if payment was made
        const otp = this.generateOtp();
        const passwordHash = await this.hashPassword(password);

        const newUser = new User({
            email,
            passwordHash,
            role: 'owner',
            otp,
            otpVerified: false,
        });

        await newUser.save();

        sendOtpEmail(email, otp);  // Send OTP email to user
        return 'OTP sent to email';
    }

    // Simulate the payment process
    private static async simulatePayment(planId: any, email: any, workSpaceName: string): Promise<boolean> {
        // Here, integrate with your payment gateway (e.g., Stripe, PayPal)
        // For this simulation, assume the payment is successful

        //todo payment subscription service

        // aftr sucess in paymen
        const success = true
        if (success) {
            const workspace = await this.createWorkspace(email, planId, workSpaceName)
            if (workspace) {
                return true;
            }
            return false

        }
        await this.rollBackUser(email)
        return false

    }

    private static async rollBackUser(email: string): Promise<any> {
        // Here, integrate with your payment gateway (e.g., Stripe, PayPal)
        // For this simulation, assume the payment is successful
        const user = await User.findOne({ email })
        // aftr sucess in paymen

        if (user) {
            await User.findByIdAndDelete({ email })
            return "Failed to complete payment purchase of Work Space"
        }
        return "Payment was successful"

    }

    // OTP Verification
    public static async verifyOTP(email: string, otp: string): Promise<string> {
        const user = await User.findOne({ email });
        if (!user) return 'User not found';

        if (user.otp !== otp) return 'Invalid OTP';
        user.otpVerified = true;

        await user.save();
        sendawaitingApprovalWorspaceEmail(user.email);
        return 'OTP verified, your workspace is being processed';
    }

    // Admin approves Workspace/Vendor
    public static async approveWorkspace(userId: string, workspaceId: string,): Promise<string> {

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return 'Workspace not found';

        workspace.status = 'active';
        workspace.api_key = generateApiKey();
        workspace.license_key = generateLicenseKey();
        workspace.license_expiry_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year expiration

        await workspace.save();

        // Send email to vendor with API key and License key
        const user = await User.findById(workspace.owner_id);
        if (user) sendApprovalEmail(user.email, workspace.api_key, workspace.license_key);

        return 'Workspace approved and license key sent';
    }

    // Generate OTP (for simplicity, using a static value for now)
    private static generateOtp(): string {
        return Math.random().toString(36).slice(-6);  // Generates a random 6 digit string
    }

    // Hash user password
    private static async hashPassword(password: string): Promise<string> {
        // Use bcryptjs to hash the password
        const bcrypt = require('bcryptjs');
        return bcrypt.hash(password, 10);
    }


    // 2. List and Count Stores (with optional filters)
  static async listAndCountStores(vendorId: string, filter = {}, limit = 10, skip = 0) {
    const stores = await Workspace.find({ vendorId, ...filter })
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Workspace.countDocuments({ vendorId, ...filter }).exec();
    return { stores, count };
  }

  // 3. List Stores (basic without filters)
  static async listStores(vendorId: string, limit = 10, skip = 0) {
    return await Workspace.find({ vendorId, isActive: true })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 4. Retrieve a Store by ID
  static async retrieveStore(storeId: string, vendorId: string) {
    return await Workspace.findOne({ _id: storeId, vendorId }).exec();
  }

  // 5. Soft Delete a Store (set `isActive` to false and set `deleted_at` timestamp)
  static async softDeleteStore(storeId: string, vendorId: string) {
    const store = await Workspace.findOne({ _id: storeId, vendorId }).exec();
    if (!store) {
      throw new Error('Store not found');
    }
    store.isActive = false;
    store.deleted_at = new Date();
    store.updated_at = new Date();
    await store.save();
    return store;
  }

  // 6. Restore a Soft Deleted Store
  static async restoreStore(storeId: string, vendorId: string) {
    const store = await Workspace.findOne({ _id: storeId, vendorId }).exec();
    if (!store || store.isActive) {
      throw new Error('Store is not soft deleted');
    }
    store.isActive = true;
    store.deleted_at = null;
    store.updated_at = new Date();
    await store.save();
    return store;
  }

  // 7. Delete Store Permanently
  static async deleteStore(storeId: string, vendorId: string) {
    const store = await Workspace.findOneAndDelete({ _id: storeId, vendorId }).exec();
    if (!store) {
      throw new Error('Store not found');
    }
    
    return { message: 'Store deleted successfully' };
  }


   // 8. Update Store (Partial update)
   static async updateStore(storeId: string | null |undefined, vendorId: string, storeData: Partial<IWorkspace>) {
    const store = await Workspace.findOne({ _id: storeId, vendorId }).exec();
    if (!store) {
      throw new Error('Store not found');
    }
    Object.assign(store, storeData);
    store.updated_at = new Date();
    await store.save();
    return store;
  }

  // 9. Upsert Store (Create or update)
  static async upsertStore(storeId: string | null |undefined, vendorId: string, storeData: Partial<IWorkspace>) {
    const planId: any =storeData.plan_id
    const workspaceName: any = storeData.name
    const store = storeId
  
      ? await Workspace.findOne({ _id: storeId, vendorId }).exec()
      : null;

    if (store) {
      // Update the store
      return await WorkspaceService.updateStore(storeId, vendorId, storeData);
    } else {
      // Create new store
      return await WorkspaceService.createWorkspace(vendorId, planId, workspaceName);
    }
  }

  // 10. Get Paginated List of Stores (with filters)
  static async getPaginatedListOfStores(vendorId: string, filter = {}, limit = 10, skip = 0) {
    const stores = await Workspace.find({ vendorId, ...filter })
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await Workspace.countDocuments({ vendorId, ...filter }).exec();
    return { stores, count };
  }
}

export default WorkspaceService;
