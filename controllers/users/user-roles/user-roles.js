const UserRoles = require('../../../models/users/user-roles/user-roles');
const sequelize = require('../../../helpers/database');
const { QueryTypes } = require('sequelize');

exports.getUserRoles = (req, res, next) => {
    UserRoles.findAll()
    .then(userRoles => { 
        res.status(200).json(userRoles);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserRole = (req, res, next) => {
    const userRoleId = req.params.userRoleId;
    UserRoles.findByPk(userRoleId)
    .then(userRole => { 
        res.status(200).json(userRole);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserByRole = (req, res, next) => {

    const records = sequelize.query(`select a.groupId, b.* from
    (SELECT * FROM oblongsquare.userroles
    where groupId = :groupId) a
    left outer join
    (select * from oblongsquare.users) b
    on a.userId = b.userId`, {
        replacements: { groupId: req.body.groupId },
        type: QueryTypes.SELECT
    });

    records.then(userRoles => { 
        res.status(200).json(userRoles);
    })
    .catch(err => {
        console.log(err)
    });
}

exports.getUserRoleTable = (req, res, next) => {
    const orderBy = req.body.order? req.body.order : [ [ 'userRoleId', 'DESC' ]];
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    if (whereCondition.userId) {
        Object.assign(tableConditions, {where: whereCondition});
    }
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    for (let i = 0; objKeys.length > i; i++) {
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'text') {
            const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'number') {
            const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'date') {
            if (whereCondition[objKeys[i]].dateFilter) {
                const textFilterObj = {[Op.and]: [
                    { [Op.gte]: new Date(whereCondition[objKeys[i]].dateFilter.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                    { [Op.lte]: new Date(whereCondition[objKeys[i]].dateFilter.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
                ]};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
            }
        } 
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'array') {
            if (whereCondition[objKeys[i]].arrayFilter) {
                if (!whereCondition[objKeys[i]].arrayFilter.value) {
                    const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                    Object.assign(tableConditions.where, textFilterObj)
                } else {
                    const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                    Object.assign(tableConditions.where, textFilterObj)
                }
            }
        } 
    }
    UserRoles.findAndCountAll(tableConditions)
    .then(userRoles => { 
        res.status(200).json(userRoles);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createUserRole = (req, res, next) => {
    UserRoles.create({
        userId: req.body.userId,
        groupId: req.body.groupId,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(userRole => { 
        res.status(201).json({
            message: 'Post Success',
            post: userRole
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateUserRole = (req, res, next) => {
    const userRoleId = req.params.userRoleId;
    UserRoles.findByPk(userRoleId)
    .then(userRole => { 
        userRole.userId = req.body.userId,
        userRole.groupId = req.body.groupId,
        userRole.createdById = req.body.createdById,
        userRole.createdByName = req.body.createdByName,
        userRole.updatedById = req.body.updatedById,
        userRole.updatedByName = req.body.updatedByName
        return userRole.save();
    })
    .then(userRole => {
        res.status(201).json({
            message: 'Put Success',
            post: userRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteUserRole = (req, res, next) => {
    const userRoleId = req.params.userRoleId;
    UserRoles.findByPk(userRoleId)
    .then(userRole => { 
        return userRole.destroy();
    })
    .then(userRole => {
        res.status(201).json({
            message: 'Delete Success',
            post: userRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};