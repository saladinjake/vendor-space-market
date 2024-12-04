// src/routes/workspace.routes.ts
import express from 'express';
import WorkspaceService from '../services/vendorWorkSpace.services';
import {apiKeyAuthMiddleware  } from "../../middlewares/apiKey.middleware"
import { Request, Response, NextFunction } from 'express';
const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
  const { email, password, planId, workSpaceName } = req.body;
  const response = await WorkspaceService.signup(email, password, planId, workSpaceName);
  res.send(response);
});

// Vendor login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { apiKey } = await  WorkspaceService.login(email, password);
    res.json({ apiKey });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});
// OTP Verification
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const response = await WorkspaceService.verifyOTP(email, otp);
  res.send(response);
});

// Admin approval of vendor workspace
router.post('/approve-workspace', async (req, res) => {
  const { workspaceId, userId } = req.body;
  const response = await WorkspaceService.approveWorkspace(userId, workspaceId);
  res.send(response);
});

// Protected route - Requires API Key
router.get('/protected', apiKeyAuthMiddleware, (req: Request, res: Response) => {
  // This route is protected by the API Key validation
  const vendor = req.vendor;
  res.json({ message: 'Protected route accessed', vendor });
});




// 2. List and Count Stores
router.get('/list-and-count', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { limit, skip, filter } = req.query;
    const stores = await WorkspaceService.listAndCountStores(vendor._id, filter, Number(limit), Number(skip));
    res.status(200).json(stores);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

// 3. List Stores
router.get('/list', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { limit, skip } = req.query;
    const stores = await WorkspaceService.listStores(vendor._id, Number(limit), Number(skip));
    res.status(200).json(stores);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Retrieve Store by ID
router.get('/retrieve/:storeId', apiKeyAuthMiddleware, async (req: any, res: any) => {
  try {
    const { vendor } = req;
    const { storeId } = req.params;
    const store = await WorkspaceService.retrieveStore(storeId, vendor._id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Soft Delete Store
router.patch('/soft-delete/:storeId', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { storeId } = req.params;
    const deletedStore = await WorkspaceService.softDeleteStore(storeId, vendor._id);
    res.status(200).json(deletedStore);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Restore Soft Deleted Store
router.patch('/restore/:storeId', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { storeId } = req.params;
    const restoredStore = await WorkspaceService.restoreStore(storeId, vendor._id);
    res.status(200).json(restoredStore);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

// 7. Delete Store Permanently
router.delete('/delete/:storeId', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { storeId } = req.params;
    const result = await WorkspaceService.deleteStore(storeId, vendor._id);
    res.status(200).json(result);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});


// 9. Upsert Store (Create or Update)
router.post('/upsert/:storeId?', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { storeId }= req.params;
    const storeData = req.body;
    const upsertedStore = await WorkspaceService.upsertStore(storeId, vendor._id, storeData);
    res.status(200).json(upsertedStore);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
// 10. Get Paginated List of Stores
router.get('/paginated', apiKeyAuthMiddleware, async (req, res) => {
  try {
    const { vendor } = req;
    const { limit, skip, filter } = req.query;
    const paginatedStores = await WorkspaceService.getPaginatedListOfStores(
      vendor._id,
      filter,
      Number(limit),
      Number(skip)
    );
    res.status(200).json(paginatedStores);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
