// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import User from '../modules/userManagementModule/model/user.model';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export const apiKeyAuthMiddleware = async (req: any, res: any, next: NextFunction) => {
  try {
    // Step 1: Get API Key from request header
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
      return res.status(401).json({ message: 'API Key is required' });
    }

    // Step 2: Find the vendor by API Key
    const vendor = await User.findOne({ apiKey });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid API Key' });
    }

    // Step 3: Decrypt and verify the API Key (not really necessary if you store it securely)
    // In this case, we don't need to decrypt as we are storing it as a plain string (but encrypted keys could be used if needed)

    // Step 4: Attach vendor to request object


    if(apiKey) {
        // vendor is making a request to our api
        // req.vendor = vendor;
        try {
            const decoded = jwt.verify(apiKey, process.env.JWT_SECRET_KEY!);
            const vendor = await User.findById(decoded.vendorId); // Assume the decoded API key contains the vendor ID
        
            if (!vendor) {
              return res.status(401).json({ message: 'Invalid API Key' });
            }
        
            req.vendor = vendor; // Attach the vendor to the request for further use
            next();
          } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired API Key' });
          }
    }

    // else check if this is just a buyer
   
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
