// __tests__/storeService.test.ts
import   StoreService  from '../core/services/vendorWorkSpace.services';
import { Workspace, IWorkspace } from '../core/models/vendorWorkSpace';

import mongoose from 'mongoose';
import { jest } from '@jest/globals';

jest.mock('../core/models/vendorWorkSpace'); // Mock Store model

// describe('StoreService Tests', () => {
//   const vendorId = new mongoose.Types.ObjectId().toString();

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create a new store', async () => {
//     const storeData: Partial<IStore> = {
//       name: 'Test Store',
//       currency: 'USD',
//     };

//     // Mocking Store save method
//     const storeMock = { ...storeData, vendorId, save: jest.fn().mockResolvedValue(storeData) };
//     Store.mockImplementationOnce(() => storeMock);

//     const store = await StoreService.createStore(vendorId, storeData);

//     expect(store).toEqual(storeData);
//     expect(storeMock.save).toHaveBeenCalled();
//   });

//   it('should update an existing store', async () => {
//     const storeId = new mongoose.Types.ObjectId().toString();
//     const storeData: Partial<IStore> = { name: 'Updated Store' };

//     // Mocking the existing store retrieval and update
//     const storeMock = {
//       _id: storeId,
//       vendorId,
//       name: 'Old Store',
//       save: jest.fn().mockResolvedValue({ ...storeData, ...storeMock }),
//     };
//     Store.findOne = jest.fn().mockResolvedValue(storeMock);

//     const updatedStore = await StoreService.updateStore(storeId, vendorId, storeData);

//     expect(updatedStore.name).toBe('Updated Store');
//     expect(storeMock.save).toHaveBeenCalled();
//   });

//   it('should upsert a store (create)', async () => {
//     const storeData: Partial<IStore> = {
//       name: 'New Store',
//       currency: 'USD',
//     };

//     Store.findOne = jest.fn().mockResolvedValue(null); // Mock store does not exist

//     // Mock store creation
//     const storeMock = { ...storeData, save: jest.fn().mockResolvedValue(storeData) };
//     Store.mockImplementationOnce(() => storeMock);

//     const upsertedStore = await StoreService.upsertStore(null, vendorId, storeData);

//     expect(upsertedStore).toEqual(storeData);
//     expect(storeMock.save).toHaveBeenCalled();
//   });

//   it('should upsert a store (update)', async () => {
//     const storeId = new mongoose.Types.ObjectId().toString();
//     const storeData: Partial<IStore> = { name: 'Updated Store' };

//     const storeMock = {
//       _id: storeId,
//       vendorId,
//       name: 'Old Store',
//       save: jest.fn().mockResolvedValue({ ...storeData, ...storeMock }),
//     };
//     Store.findOne = jest.fn().mockResolvedValue(storeMock);

//     const upsertedStore = await StoreService.upsertStore(storeId, vendorId, storeData);

//     expect(upsertedStore.name).toBe('Updated Store');
//     expect(storeMock.save).toHaveBeenCalled();
//   });

//   it('should list stores with pagination', async () => {
//     const storesMock = [{ name: 'Store 1' }, { name: 'Store 2' }];
//     Store.find = jest.fn().mockResolvedValue(storesMock);

//     const result = await StoreService.listStores(vendorId, 2, 0);
    
//     expect(result).toEqual(storesMock);
//     expect(Store.find).toHaveBeenCalledWith({ vendorId, isActive: true }).skip(0).limit(2);
//   });

//   it('should delete a store permanently', async () => {
//     const storeId = new mongoose.Types.ObjectId().toString();
//     const storeMock = { _id: storeId, vendorId, remove: jest.fn().mockResolvedValue({ message: 'Store deleted successfully' }) };
//     Store.findOne = jest.fn().mockResolvedValue(storeMock);

//     const result = await StoreService.deleteStore(storeId, vendorId);

//     expect(result).toEqual({ message: 'Store deleted successfully' });
//     expect(storeMock.remove).toHaveBeenCalled();
//   });
// });
