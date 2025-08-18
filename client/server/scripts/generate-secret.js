#!/usr/bin/env node

const crypto = require('crypto');

// Generate a secure random string for JWT secret
const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

const secret = generateSecret();

console.log('🔐 Generated JWT Secret:');
console.log('='.repeat(50));
console.log(secret);
console.log('='.repeat(50));
console.log('\n📝 Copy this secret and set it as your JWT_SECRET environment variable in Render.');
console.log('⚠️  Keep this secret secure and never commit it to version control!');
