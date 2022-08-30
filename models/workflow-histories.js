const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const WorkflowHistories = sequelize.define('workflowhistories', {
    historyId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    objectId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    recordId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    itemId:  {
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
    objectParentId:  {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    name:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    type:  {
        type: Sequelize.JSON,
        allowNull: false,
    },
    label:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    level:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    value:  {
        type: Sequelize.JSON,
        allowNull: true,
    },
    comment:  {
        type: Sequelize.JSON,
        allowNull: true,
    },
    config:  {
        type: Sequelize.JSON,
        allowNull: true,
    },
    isRequired:  {
        type: Sequelize.JSON,
        allowNull: false,
    },
    commentType:  {
        type: Sequelize.JSON,
        allowNull: true,
    },
    description:  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    defaultSelected:  {
        type: Sequelize.JSON,
        allowNull: true,
    },
    isSelected:  {
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

module.exports = WorkflowHistories;