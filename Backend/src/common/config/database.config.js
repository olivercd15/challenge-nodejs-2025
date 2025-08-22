require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_migrations',
    seederStorageTableName: 'sequelize_seeders',
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_migrations',
    seederStorageTableName: 'sequelize_seeders',
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true
    }
  },
};