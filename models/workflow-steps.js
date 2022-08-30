const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const WorkflowSteps = sequelize.define('workflowsteps', {
    stepId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    icon: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    position: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    reference: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    config: {
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
});

module.exports = WorkflowSteps;