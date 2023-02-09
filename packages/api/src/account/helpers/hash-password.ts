import CryptoJS from "crypto-js";

// hashes a password using either the given `salt` argument, or creates a new
// salt and hashes using that. Either way, returns an array with [hash, salt]
export const hashPassword = (text: string, salt?: string) => {
  const useSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString();

  return [
    CryptoJS.PBKDF2(text, useSalt, { keySize: 256 / 32 }).toString(),
    useSalt,
  ];
};
