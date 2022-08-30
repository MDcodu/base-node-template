const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const WorkflowAmend = sequelize.define('workflowamend', {
    workflowAmendId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    recordId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    stepId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    interfaceId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    systemId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    organizationId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    amendReason:  {
        type: Sequelize.JSON,
        allowNull: true,
    },
    amendNotes:  {
        type: Sequelize.STRING,
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

module.exports = WorkflowAmend;