const crypto = require('crypto');
const secp256k1 = require('secp256k1');

// Server's private key (must be 32 bytes hex string without 0x prefix)
const serverPrivateKeyHex = '...';

// Convert the server's private key to a Buffer
const serverPrivateKeyBuffer = Buffer.from(serverPrivateKeyHex, 'hex');

// Client's public key received by the server (hex string)
const clientPublicKeyHex = '...';
const clientPublicKeyBuffer = Buffer.from(clientPublicKeyHex, 'hex');

// Server generates the shared secret using its private key and client's public key
const sharedSecret = secp256k1.ecdh(clientPublicKeyBuffer, serverPrivateKeyBuffer);

// Create a SHA-256 hash of the shared secret to use as the key for AES-256
const key = crypto.createHash('sha256').update(sharedSecret).digest();

const payload = '...'; // The hex string received that includes the IV and encrypted data

// Extract the IV from the beginning of the payload
const iv = Buffer.from(payload.substring(0, 32), 'hex'); // IV is 16 bytes, hence 32 hex characters
const encryptedMessage = payload.substring(32);

// Perform decryption using the extracted IV
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log('Decrypted message:', decrypted);