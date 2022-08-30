
const GroupRoles = require('../models/group-roles');

exports.getGroupRoles = (req, res, next) => {
    GroupRoles.findAll()
    .then(groupRoles => { 
        res.status(200).json(groupRoles);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getGroupRole = (req, res, next) => {
    const groupRoleId = req.params.groupRoleId;
    GroupRoles.findByPk(groupRoleId)
    .then(groupRole => { 
        res.status(200).json(groupRole);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getGroupRoleData = (req, res, next) => {
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    for (let i = 0; objKeys.length > i; i++) {
        Object.assign(tableConditions.where, {[objKeys[i]]: whereCondition[objKeys[i]]})       
    }

    GroupRoles.findAll(tableConditions.where)
    .then(groupRoles => { 
        res.status(200).json(groupRoles);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createGroupRole = (req, res, next) => {
    GroupRoles.create({
        groupId: req.body.groupId,
        itemId: req.body.itemId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        roleType: req.body.roleType,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(groupRole => { 
        res.status(201).json({
            message: 'Post Success',
            post: groupRole
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateGroupRole = (req, res, next) => {
    const groupRoleId = req.params.groupRoleId;
    GroupRoles.findByPk(groupRoleId)
    .then(groupRole => { 
        groupRole.groupId = req.body.groupId,
        groupRole.itemId = req.body.itemId,
        groupRole.stepId = req.body.stepId,
        groupRole.interfaceId = req.body.interfaceId,
        groupRole.systemId = req.body.systemId,
        groupRole.organizationId = req.body.organizationId,
        groupRole.name = req.body.name,
        groupRole.roleType = req.body.roleType,
        groupRole.config = req.body.config,
        groupRole.updatedById = req.body.updatedById,
        groupRole.updatedByName = req.body.updatedByName
        return groupRole.save();
    })
    .then(groupRole => {
        res.status(201).json({
            message: 'Put Success',
            post: groupRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteGroupRole = (req, res, next) => {
    const groupRoleId = req.params.groupRoleId;
    GroupRoles.findByPk(groupRoleId)
    .then(groupRole => { 
        return groupRole.destroy();
    })
    .then(groupRole => {
        res.status(201).json({
            message: 'Delete Success',
            post: groupRole
        });
    })
    .catch(err => {
        console.log(err)
    });
};