const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const WorkflowSteps = sequelize.define('workflowsteps', {
    stepRecordId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    recordId: {
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
        type: Sequelize.JSON,
        allowNull: false,
    },
    unlocked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    index: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    stepStatus: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    activeStep: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    fileStatus: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    reference: {
        type: Sequelize.JSON,
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