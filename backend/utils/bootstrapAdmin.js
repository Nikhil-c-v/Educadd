const User = require('../models/User');

let bootstrapPromise = null;

const normalizeEmail = (value) => (value || '').trim().toLowerCase();

const bootstrapAdmin = async () => {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
    const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
    const adminFullName = (process.env.ADMIN_FULL_NAME || 'Admin User').trim();
    const forcePasswordReset = process.env.ADMIN_PASSWORD_RESET === 'true';

    if (!adminEmail || !adminPassword) {
      return null;
    }

    if (adminPassword.length < 6) {
      throw new Error('ADMIN_PASSWORD must be at least 6 characters long');
    }

    const existingUser = await User.findOne({ where: { email: adminEmail } });

    if (!existingUser) {
      const createdAdmin = await User.create({
        email: adminEmail,
        password: adminPassword,
        fullName: adminFullName,
        role: 'admin',
        isActive: true,
      });

      console.log(`Bootstrap admin created: ${createdAdmin.email}`);
      return createdAdmin;
    }

    const updates = {};

    if (existingUser.role !== 'admin') {
      updates.role = 'admin';
    }

    if (!existingUser.isActive) {
      updates.isActive = true;
    }

    if (forcePasswordReset) {
      updates.password = adminPassword;
    }

    if (Object.keys(updates).length > 0) {
      await existingUser.update(updates);
      console.log(`Bootstrap admin updated: ${existingUser.email}`);
    }

    return existingUser;
  })().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
};

module.exports = { bootstrapAdmin };