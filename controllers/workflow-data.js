
const WorkflowDatas = require('../models/workflow-data');
const { Op, Sequelize } = require("sequelize");

exports.getWorkflowDatas = (req, res, next) => {
    WorkflowDatas.findAll({
        order: [ [ 'updatedAt', 'DESC' ]],
    })
    .then(WorkflowDatas => { 
        res.status(200).json(WorkflowDatas);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowDataFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    WorkflowDatas.findAll({
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

exports.getWorkflowDatasStep = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const recordId = req.body.whereCondition.recordId;

    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId},
        {stepId: stepId},
        {recordId: recordId});


    WorkflowDatas.findAll(tableConditions)
    .then(workflowDatasStep => { 
        res.status(200).json(workflowDatasStep);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getWorkflowData = (req, res, next) => {
    const workflowDataId = req.params.workflowDataId;
    WorkflowDatas.findByPk(workflowDataId)
    .then(workflowData => { 
        res.status(200).json(workflowData);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowDatasTable = (req, res, next) => {
    const orderBy = [[ 'workflowDataId', 'DESC' ]];
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const recordId = req.body.whereCondition.recordId;
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
        {interfaceId: interfaceId},
        {stepId: stepId},
        {recordId: recordId});

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
            if (!whereCondition[objKeys[i]].arrayFilter.value) {
                const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                Object.assign(tableConditions.where, textFilterObj)
            } else {
                const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                Object.assign(tableConditions.where, textFilterObj)
            }
        } 
    }

    WorkflowDatas.findAndCountAll(tableConditions)
    .then(workflowDatas => { 
        res.status(200).json(workflowDatas);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowData = (req, res, next) => {
    WorkflowDatas.create({
        objectId: req.body.objectId,
        recordId: req.body.recordId,
        itemId: req.body.itemId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        objectParentId: req.body.objectParentId,
        name: req.body.name,
        description: req.body.description,
        label: req.body.label,
        level: req.body.level,
        value: req.body.value,
        type: req.body.type,
        comment: req.body.comment,
        commentType: req.body.commentType,
        choices: req.body.choices,
        defaultSelected: req.body.defaultSelected,
        isSelected: req.body.isSelected,
        isRequired: req.body.isRequired,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowData => { 
        res.status(201).json({
            message: 'Post Success',
            post: workflowData
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateWorkflowData = (req, res, next) => {
    const workflowDataId = req.params.workflowDataId;
    WorkflowDatas.findByPk(workflowDataId)
    .then(workflowData => { 
        workflowData.objectId = req.body.objectId,
        workflowData.recordId = req.body.recordId,
        workflowData.itemId = req.body.itemId,
        workflowData.stepId = req.body.stepId,
        workflowData.interfaceId = req.body.interfaceId,
        workflowData.systemId = req.body.systemId,
        workflowData.organizationId = req.body.organizationId,
        workflowData.objectParentId = req.body.objectParentId,
        workflowData.name = req.body.name,
        workflowData.description = req.body.description,
        workflowData.label = req.body.label,
        workflowData.level = req.body.level,
        workflowData.value = req.body.value,
        workflowData.type = req.body.type,
        workflowData.comment = req.body.comment,
        workflowData.commentType = req.body.commentType,
        workflowData.choices = req.body.choices,
        workflowData.defaultSelected = req.body.defaultSelected,
        workflowData.isRequired = req.body.isRequired,
        workflowData.isSelected = req.body.isSelected,
        workflowData.config = req.body.config,
        workflowData.createdById = req.body.createdById,
        workflowData.createdByName = req.body.createdByName,
        workflowData.updatedById = req.body.updatedById,
        workflowData.updatedByName = req.body.updatedByName
        return workflowData.save();
    })
    .then(workflowData => {
        res.status(201).json({
            message: 'Put Success',
            post: workflowData
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteWorkflowData = (req, res, next) => {
    const workflowDataId = req.params.workflowDataId;
    WorkflowDatas.findByPk(workflowDataId)
    .then(workflowData => { 
        return workflowData.destroy();
    })
    .then(workflowData => {
        res.status(201).json({
            message: 'Delete Success',
            post: workflowData
        });
    })
    .catch(err => {
        console.log(err)
    });
};