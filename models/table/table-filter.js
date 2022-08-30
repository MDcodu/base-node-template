const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const TableFilters = sequelize.define('tablefilters', {
    tableFilterId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    sessionId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    interfaceId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    systemId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    organizationId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    whereCondition: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    offset: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    order: {
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
    },
    fromComponent: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

module.exports = TableFilters;