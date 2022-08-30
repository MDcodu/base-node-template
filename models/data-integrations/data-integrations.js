const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const DataIntegrations = sequelize.define('dataintegrations', {
    dataIntegrationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dataSource: {
        type: Sequelize.JSON,
        allowNull: true,
    },
    destination: {
        type: Sequelize.JSON,
        allowNull: true,
    },
    mapping: {
        type: Sequelize.JSON,
        allowNull: true,
    },
    schedule: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    isActive: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    createdById: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdByName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    updatedById: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    updatedByName: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = DataIntegrations;