const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const WorkflowAssignments = sequelize.define('workflowassignments', {
    workflowAssignmentId: {
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
    userId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    username:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    firstName:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    middleName:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:  {
        type: Sequelize.JSON,
        allowNull: false,
    },
    subject:  {
        type: Sequelize.JSON,
        allowNull: false,
    },
    message:  {
        type: Sequelize.JSON,
        allowNull: false,
    },
    transaction:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isCompleted:  {
        type: Sequelize.JSON,
        allowNull: true,
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

module.exports = WorkflowAssignments;