// src/utils/generateKeys.ts
export const generateApiKey = (): string => {
    return Math.random().toString(36).substr(2, 9); // Generate random API key
  };
  
  export const generateLicenseKey = (): string => {
    return Math.random().toString(36).substr(2, 12); // Generate random License key
  };
  