
const WorkflowDatas = require('../../models/workflow/workflow-data');
const WorkflowRecords = require('../../models/workflow/workflow-records');
const Users = require('../../models/users/users');
const { Op, Sequelize, QueryTypes } = require("sequelize");
const sequelize = require('../../helpers/database');

exports.getWorkflowDatasUpdateInfo = (req, res, next) =>  {

    const recordId = req.body.recordId;
    const records = sequelize.query(`SELECT distinct 
    max(createdAt) as createdAt, 
    max(updatedAt) as updatedAt, recordId, stepId, createdById, 
    createdByName, updatedById, updatedByName 
    FROM oblongsquare.workflowdata where recordId = :recordId
    group by recordId, stepId, createdById, 
    createdByName, updatedById, updatedByName `, {
        replacements: { recordId: recordId },
        type: QueryTypes.SELECT
    });

    records.then(updateInfo => { 
        res.status(200).json(updateInfo);
    })
    .catch(err => {
        console.log(err)
    });
}

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

exports.getWorkflowDataActiveStep  = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const recordId = req.body.recordId;

    const records = sequelize.query(`select stepNo - 1 as activeStep, stepId from
    (select a.*, rank() over (partition by interfaceId order by stepId) as rn 
    from
    (select a.stepId, a.interfaceId, b.stepId as stepRef, 
    rank() over (partition by a.interfaceId order by a.stepId) as stepNo 
    from
    (SELECT organizationId, systemId, interfaceId, stepId FROM oblongsquare.steps
    where organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId) a
    left outer join
    (SELECT distinct stepId
    FROM oblongsquare.workflowdata where value is not null and recordId = :recordId) b
    on a.stepId = b.stepId) a
    where stepRef is null) b
    where rn = 1 group by stepId`, {
        replacements: { 
            recordId: recordId, 
            interfaceId: interfaceId,
            systemId: systemId,
            organizationId: organizationId},
        type: QueryTypes.SELECT
    });

    records.then(activeStep => { 
        if (activeStep.length > 0) {
            res.status(200).json(activeStep);
        } else {
            const records2 = sequelize.query(`select * from
            (SELECT count(stepId) as activeStep, stepId,
            rank() over (partition by interfaceId order by stepId) as rn  
            FROM oblongsquare.steps
            where organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId) a
            where rn = 1`, {
                replacements: { 
                    interfaceId: interfaceId,
                    systemId: systemId,
                    organizationId: organizationId},
                type: QueryTypes.SELECT
            });
            records2.then(activeStep => { 
                res.status(200).json(activeStep);
            })
            .catch(err => {
                console.log(err)
            });
        }

    })
    .catch(err => {
        console.log(err)
    });
}

exports.getWorkflowDataFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions.where, {name: fieldName})

    WorkflowDatas.findAll(tableConditions)
    .then(choices => { 

        res.status(200).json(choices);
    })
    .catch(err => {
        console.log(err)
    });
}

exports.getWorkflowDatasSystemStep = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;

    const records = sequelize.query(`select * from
    (SELECT 
    rank() over (partition by organizationId, systemId, interfaceId, stepId, name order by workflowDataId desc) as rn, 
    a.*  
    FROM oblongsquare.workflowdata a
    where level = 1 and organizationId = :organizationId and systemId = :systemId and interfaceId = :interfaceId and stepId = :stepId
    )  a WHERE rn = 1`, {
        replacements: { organizationId: organizationId, systemId: systemId, interfaceId: interfaceId, stepId: stepId },
        type: QueryTypes.SELECT
    });

    records.then(updateInfo => { 
        res.status(200).json(updateInfo);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowDatasDetails = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const recordId = req.body.recordId;
    const filterFields = req.body.filterFields;

    WorkflowDatas.findAll({
        attributes: ['workflowDataId', 'recordId','name', 'label','value', 'type'],
        where: {
        organizationId: organizationId, 
        systemId: systemId, 
        interfaceId: interfaceId,
        recordId: recordId,
        name: {[Op.in]: filterFields}
    }})
    .then(workflowDatasDetails => { 
        WorkflowRecords.findAll({    
            attributes: ['recordId', 'activeStep', 'stepStatus','createdAt', 'updatedAt'],
            where: {
                recordId: recordId
            }
        }).then(workflowRecords => { 
            data = workflowDatasDetails;

            data.push({label: 'Active Step', name: 'activeStep', recordId: recordId, type: {id: 1, code: 'we', name: 'textbox'}, value: workflowRecords[0].activeStep});
            data.push({label: 'Step Status', name: 'stepStatus', recordId: recordId, type: {id: 1, code: 'we', name: 'textbox'}, value: workflowRecords[0].stepStatus});
            data.push({label: 'Created At', name: 'createdAt', recordId: recordId, type: {id: 3, code: 'we', name: 'textboxDate'}, value: workflowRecords[0].createdAt});
            data.push({label: 'Updated At', name: 'updatedAt', recordId: recordId, type: {id: 3, code: 'we', name: 'textboxDate'}, value: workflowRecords[0].updatedAt});
        
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err)
        });
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getWorkflowDatasStepObjectParent = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const recordId = req.body.recordId;
    const objectParentId = req.body.objectParentId;

    let tableConditions = {};
    Object.assign(tableConditions, {
        attributes:['value'],
        where: {}});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId},
        {stepId: stepId},
        {recordId: recordId},
        {objectParentId: objectParentId});


    WorkflowDatas.findAll(tableConditions)
    .then(workflowDatasStep => { 
        res.status(200).json(workflowDatasStep);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.getWorkflowDatasStepObject = (req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const recordId = req.body.recordId;
    const objectId = req.body.objectId;

    let tableConditions = {};
    Object.assign(tableConditions, {
        attributes:['value'],
        where: {}});
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId},
        {stepId: stepId},
        {recordId: recordId},
        {objectId: objectId});

    WorkflowDatas.findAll(tableConditions)
    .then(workflowDatasStep => { 

        res.status(200).json(workflowDatasStep);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowDatasAssigned = async(req, res, next) => {
    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const stepId = req.body.stepId;
    const recordId = req.body.recordId;
    const name = req.body.name;

    const records = sequelize.query(`select 
    json_unquote(json_extract(value, '$')) as value 
    FROM oblongsquare.workflowdata 
    where organizationId = :organizationId and 
    systemId = :systemId and 
    interfaceId = :interfaceId and 
    recordId = :recordId and
    name = :name limit 1 offset 0`, {
        replacements: { 
            organizationId: organizationId, 
            systemId: systemId, 
            interfaceId: interfaceId, 
            recordId: recordId,
            name: name
        },
        type: QueryTypes.SELECT
    });

    records.then(responseId => { 
        const userId = responseId[0].value;
        const companyId = responseId[0].value;
        const nationalId = responseId[0].value;
        let tableConditions = { 
            attributes: ['userId','companyId','username','firstName','middleName','lastName','email'],
            where: {}};
        if (userId) {

            Object.assign(tableConditions.where, {[Op.or]: 
                [
                    {userId: { [Op.like]: `${userId}` }}, 
                    {companyId: { [Op.like]: `${companyId}` }}, 
                    {nationalId: { [Op.like]: `${nationalId}` }}
                ]
            });
        }
    
        Users.findOne(tableConditions)
        .then(users => { 
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err)
        });
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
    Object.assign(tableConditions, {
        attributes:['objectId', 'stepId', 'isSelected', 'value', 'comment'],
        where: {}
    });
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