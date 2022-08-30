const Sequelize = require('sequelize');
const sequelize = require('../../../helpers/database');

const UserSupervisors = sequelize.define('usersupervisors', {
    userSupervisorId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    supervisorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    companyId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nationalId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    middleName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
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

module.exports = UserSupervisors;