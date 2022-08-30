const UserManagers = require('../../../models/users/user-managers/user-managers');

exports.getUserManagers = (req, res, next) => {
    UserManagers.findAll()
    .then(userManagers => { 
        res.status(200).json(userManagers);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserManager = (req, res, next) => {
    const userManagerId = req.params.userManagerId;
    UserManagers.findByPk(userManagerId)
    .then(userManager => { 
        res.status(200).json(userManager);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserManagerTable = (req, res, next) => {
    const orderBy = req.body.order? req.body.order : [ [ 'userManagerId', 'DESC' ]];
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
    UserManagers.findAndCountAll(tableConditions)
    .then(userManagers => { 
        res.status(200).json(userManagers);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getUserManagerUser = (req, res, next) => {
    const whereCondition = req.body.whereCondition;
    UserManagers.findAll(whereCondition)
    .then(userManagers => { 
        res.status(200).json(userManagers);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createUserManager = (req, res, next) => {
    UserManagers.create({
        userId: req.body.userId,
        managerId: req.body.managerId,
        companyId: req.body.companyId,
        nationalId: req.body.nationalId,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(userManager => { 
        res.status(201).json({
            message: 'Post Success',
            post: userManager
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateUserManager = (req, res, next) => {
    const userManagerId = req.params.userManagerId;
    UserManagers.findByPk(userManagerId)
    .then(userManager => { 
        userManager.userId = req.body.userId,
        userManager.managerId = req.body.managerId,
        userManager.companyId = req.body.companyId,
        userManager.nationalId = req.body.nationalId,
        userManager.firstName = req.body.firstName,
        userManager.middleName = req.body.middleName,
        userManager.lastName = req.body.lastName,
        userManager.createdById = req.body.createdById,
        userManager.createdByName = req.body.createdByName,
        userManager.updatedById = req.body.updatedById,
        userManager.updatedByName = req.body.updatedByName
        return userManager.save();
    })
    .then(userManager => {
        res.status(201).json({
            message: 'Put Success',
            post: userManager
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteUserManager = (req, res, next) => {
    const userManagerId = req.params.userManagerId;
    UserManagers.findByPk(userManagerId)
    .then(userManager => { 
        return userManager.destroy();
    })
    .then(userManager => {
        res.status(201).json({
            message: 'Delete Success',
            post: userManager
        });
    })
    .catch(err => {
        console.log(err)
    });
};