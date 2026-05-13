const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define(
  'Lead',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{10}$/,
          msg: 'Please provide a valid 10-digit phone number',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address',
        },
      },
    },
    selectedCourse: {
      type: DataTypes.ENUM(
        'Mechanical CAD',
        'Civil Engineering',
        'IT & Software',
        'Interior Design',
        'Electrical CAD',
        'Digital Marketing',
        'Cyber Security',
        'AI & ML',
        'Data Science',
        'Cloud & DevOps'
      ),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please select a course',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('New', 'Contacted', 'Interested', 'Enrolled', 'Not Interested'),
      defaultValue: 'New',
    },
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'leads',
  }
);

module.exports = Lead;
