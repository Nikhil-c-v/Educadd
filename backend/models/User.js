const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters long',
        },
      },
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide your full name',
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: 'Please provide a valid 10-digit phone number',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('student', 'admin'),
      defaultValue: 'student',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    refreshToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Method to compare passwords
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
