import CryptoJS from 'crypto-js';

// Secret key for encryption and decryption
const SECRET_KEY = 'your-secret-key';

export const encryptId = (id) => {
  return CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
};

export const decryptId = (encryptedId) => {
  const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
