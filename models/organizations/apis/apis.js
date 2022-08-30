const Sequelize = require('sequelize');
const sequelize = require('../../../helpers/database');

const Apis = sequelize.define('apis', {
    apiId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    costCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    label: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    description: {
        type: Sequelize.STRING,
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
});

module.exports = Apis;