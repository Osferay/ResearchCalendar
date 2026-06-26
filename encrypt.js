// encrypt.js
const crypto = require('crypto');
const fs = require('fs');

const PASSWORD = process.env.CALENDAR_PASSWORD || 'password';
const raw = fs.readFileSync('events.json', 'utf8');

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(PASSWORD, salt, 100000, 32, 'sha256');

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(raw, 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag().toString('hex');

const payload = { salt: salt.toString('hex'), iv: iv.toString('hex'), authTag, encrypted };
fs.writeFileSync('events.enc.json', JSON.stringify(payload));
console.log('Encrypted to events.enc.json');