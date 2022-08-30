const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const WorkflowForms = sequelize.define('workflowforms', {
    dataId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    historyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    recordId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    stepId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    interfaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    systemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    value:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    jsonData:  {
        type: Sequelize.JSON,
        allowNull: false,
    },
    createdById:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdByName:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    updatedById:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    updatedByName:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = WorkflowForms;