//XOR encryption/decryption function
const xorCipher = (text, key) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };
  
  const ENCRYPTION_KEY = "MaplePay";
  
  export const encrypt = (text) => {
    const encrypted = xorCipher(text, ENCRYPTION_KEY);
    return Buffer.from(encrypted).toString('base64');
  };
  
  export const decrypt = (encryptedText) => {
    const text = Buffer.from(encryptedText, 'base64').toString('utf-8');
    return xorCipher(text, ENCRYPTION_KEY);
  };