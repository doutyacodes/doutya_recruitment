import CryptoJS from 'crypto-js';

// Secret key for encryption and decryption
const SECRET_KEY = 'your-secret-key';

// Function to encrypt an ID
export const encryptId = (id) => {
  const ciphertext = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
  return encodeURIComponent(ciphertext);
};

// Function to decrypt an encrypted ID
export const decryptId = (encryptedId) => {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
