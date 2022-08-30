const StepPermissions = require('../../models/steps/step-permissions');
const { Op, Sequelize } = require("sequelize");

exports.getStepPermissions = (req, res, next) => {
    StepPermissions.findAll()
    .then(stepPermissions => { 
        res.status(200).json(stepPermissions);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepPermissionFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    StepPermissions.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col(`${fieldName}`)) ,'choices'],
        ]
    })
    .then(choices => { 
        res.status(200).json(choices);
    })
    .catch(err => {
        console.log(err)
    });
}

exports.getStepPermissionsTable = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const orderBy = [[ 'stepId', 'ASC' ]];

    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId});
    for (let i = 0; objKeys.length > i; i++) {
        if (objKeys[i] && whereCondition[objKeys[i]].type === 'arrayMultiple') {
            const textFilterObj = {[Op.in]: whereCondition[objKeys[i]].value };
            Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj})
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

    StepPermissions.findAndCountAll(tableConditions)
    .then(stepPermissions => { 
        res.status(200).json(stepPermissions);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepPermission = (req, res, next) => {
    const stepPermissionId = req.params.stepPermissionId;
    StepPermissions.findByPk(stepPermissionId)
    .then(stepPermission => { 
        res.status(200).json(stepPermission);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStepPermissionByOrganization = (req, res, next) => {
    const organizationId = req.params.organizationId;
    StepPermissions.findAll({
        where: { organizationId: organizationId},
        order: [ [ 'createdAt', 'DESC' ]],
    })
    .then(stepPermission => { 
        res.status(200).json(stepPermission);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createStepPermission = async(req, res, next) => {
    let stepPermissionData;
    await StepPermissions.create({
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        position: req.body.position,
        name: req.body.name,
        description: req.body.description,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(stepPermission => { 
        stepPermissionData = stepPermission;
        res.status(201).json({
            message: 'Post Success',
            post: stepPermission
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(400).send({
            message: 'This is an error!'
         });
    });

    StepPermissions.findByPk(stepPermissionData.stepPermissionId)
    .then(stepPermission => { 
        stepPermission.stepId = req.body.stepId,
        stepPermission.interfaceId = req.body.interfaceId,
        stepPermission.systemId = req.body.systemId,
        stepPermission.organizationId = req.body.organizationId,
        stepPermission.position = stepPermissionData.stepPermissionId,    
        stepPermission.name = req.body.name,
        stepPermission.description = req.body.description,
        stepPermission.config = req.body.config,
        stepPermission.createdById = req.body.createdById,
        stepPermission.createdByName = req.body.createdByName,
        stepPermission.updatedById = req.body.updatedById,
        stepPermission.updatedByName = req.body.updatedByName
        return stepPermission.save();
    });
};

exports.updateStepPermission = (req, res, next) => {
    const stepPermissionId = req.params.stepPermissionId;
    StepPermissions.findByPk(stepPermissionId)
    .then(stepPermission => { 
        stepPermission.stepId = req.body.stepId,
        stepPermission.interfaceId = req.body.interfaceId,
        stepPermission.systemId = req.body.systemId,
        stepPermission.organizationId = req.body.organizationId,
        stepPermission.position = req.body.position,    
        stepPermission.name = req.body.name,
        stepPermission.description = req.body.description,
        stepPermission.config = req.body.config,
        stepPermission.createdById = req.body.createdById,
        stepPermission.createdByName = req.body.createdByName,
        stepPermission.updatedById = req.body.updatedById,
        stepPermission.updatedByName = req.body.updatedByName
        return stepPermission.save();
    })
    .then(stepPermission => {
        res.status(201).json({
            message: 'Put Success',
            post: stepPermission
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteStepPermission = (req, res, next) => {
    const stepPermissionId = req.params.stepPermissionId;
    StepPermissions.findByPk(stepPermissionId)
    .then(stepPermission => { 
        return stepPermission.destroy();
    })
    .then(stepPermission => {
        res.status(201).json({
            message: 'Delete Success',
            post: stepPermission
        });
    })
    .catch(err => {
        console.log(err)
    });
};
