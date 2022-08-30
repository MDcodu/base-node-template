const Groups = require('../models/groups');
const GroupRoles = require('../models/group-roles');
const UserRoles = require('../models/users/user-roles/user-roles');
const { Op, Sequelize } = require("sequelize");

exports.getGroups = (req, res, next) => {
    Groups.findAll()
    .then(group => { 
        res.status(200).json(group);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getGroup = (req, res, next) => {
    const groupId = req.params.groupId;
    Groups.findByPk(groupId)
    .then(group => { 
        res.status(200).json(group);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getGroupTable = (req, res, next) => {
    const orderBy = [[ 'groupId', 'DESC' ]];

    const organizationId = req.body.organizationId;
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    if (req.body.createdById !== '1') {
        Object.assign(tableConditions.where, {organizationId: organizationId});
    }
    for (let i = 0; objKeys.length > i; i++) {
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'recordPermission') {
            const keyName = objKeys[i].replace('Permission','');
            const textFilterObj = {[keyName] : {[Op.in]: whereCondition[objKeys[i]].arrayFilter}};
            console.log('xxxxxxx', textFilterObj)
            Object.assign(tableConditions.where, {['permission']: textFilterObj})
        } 
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

    Groups.findAndCountAll(tableConditions)
    .then(groups => {
        res.status(200).json(groups);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createGroup = (req, res, next) => {
    Groups.create({
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName,
        permission: req.body.permission
    })
    .then(group => { 
        res.status(201).json({
            message: 'Post Success',
            post: group
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateGroup = (req, res, next) => {
    const groupId = req.params.groupId;
    Groups.findByPk(groupId)
    .then(group => { 
        group.organizationId = req.body.organizationId,
        group.name = req.body.name,
        group.description = req.body.description,
        group.createdById = req.body.createdById,
        group.createdByName = req.body.createdByName,
        group.updatedById = req.body.updatedById,
        group.updatedByName = req.body.updatedByName,
        group.permission = req.body.permission
        return group.save();
    })
    .then(group => {
        res.status(201).json({
            message: 'Put Success',
            post: group
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteGroup = async(req, res, next) => {
    const groupId = req.params.groupId;
    await UserRoles.destroy({
        where: {
            groupId: groupId
        }
    });
    await GroupRoles.destroy({
        where: {
            groupId: groupId
        }
    });
    Groups.findByPk(groupId)
    .then(group => { 
        return group.destroy();
    })
    .then(group => {
        res.status(201).json({
            message: 'Delete Success',
            post: group
        });
    })
    .catch(err => {
        console.log(err)
    });
};