const WorkflowRecords = require('../../models/workflow/workflow-records');
const WorkflowDatas = require('../../models/workflow/workflow-data');
const WorkflowHistories = require('../../models/workflow/workflow-histories');
const WorkflowAssignments = require('../../models/workflow/workflow-assignments');

const Steps = require('../../models/steps/steps');
const { Op, Sequelize } = require("sequelize");

exports.getWorkflowRecords = (req, res, next) => {
    WorkflowRecords.findAll()
    .then(workflowRecords => { 
        res.status(200).json(workflowRecords);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowRecordsFilterChoices = (req, res, next) => {
    const fieldName = req.params.fieldName;
    WorkflowRecords.findAll({
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

exports.getWorkflowRecord = (req, res, next) => {
    const recordId = req.params.recordId;
    WorkflowRecords.findByPk(recordId)
    .then(workflowRecord => { 
        res.status(200).json(workflowRecord);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowRecordSmall = (req, res, next) => {
    const recordId = req.body.recordId;
    WorkflowRecords.findAll({
        attributes: ['recordId', 'activeStep', 'stepStatus','createdAt', 'updatedAt'],
        where: {recordId: recordId}})
    .then(workflowRecord => { 
        res.status(200).json(workflowRecord);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowRecordsTable = async(req, res, next) => {

    const organizationId = req.body.organizationId;
    const systemId = req.body.systemId;
    const interfaceId = req.body.interfaceId;
    const orderBy = [[ 'recordId', 'DESC' ]];
    const whereCondition = req.body.whereCondition;
    const objKeys = Object.keys(req.body.whereCondition);
    let tableConditions = {};
    Object.assign(tableConditions, {where: {}});
    Object.assign(tableConditions, {where: {objectData: {}}});
    Object.assign(tableConditions, {order: orderBy});
    Object.assign(tableConditions, {limit: req.body.limit});
    Object.assign(tableConditions, {offset: req.body.offset}); 
    Object.assign(tableConditions.where, 
        {organizationId: organizationId}, 
        {systemId: systemId}, 
        {interfaceId: interfaceId});

    const getRecordDataString = (name, value) => {
        return WorkflowDatas.findAll({where: {
            organizationId: organizationId,
            systemId: systemId,
            interfaceId: interfaceId,
            name: name,
            value: {[Op.like]: Sequelize.literal('UPPER(' + '\'%'+ value +'%\'' + ')')}
        }})
        .then(workflowDatas => { 
            let recordIdArray = [];
            for (let i = 0; workflowDatas.length > i; i++) {
                recordIdArray.push(workflowDatas[i].recordId);
            }
            return recordIdArray;
        })
    }

    const getRecordDataDate = (name, from, to) => {

        return WorkflowDatas.findAll({where: {
            organizationId: organizationId,
            systemId: systemId,
            interfaceId: interfaceId,
            name: name
        }})
        .then(workflowDatas => { 
            let recordIdArray = [];
            for (let i = 0; workflowDatas.length > i; i++) {

                const valueDate = new Date(workflowDatas[i].value).setUTCHours(0,0,0,0) + (3600 * 1000 * 24);

                if (valueDate >= from && valueDate <= to) {
                    recordIdArray.push(workflowDatas[i].recordId);
                }

            }

            return recordIdArray;
        }).catch(err => {
            console.log(err)
        });
    }

    const getRecordDataArray = (name) => {

        return WorkflowDatas.findAll({where: {
            organizationId: organizationId,
            systemId: systemId,
            interfaceId: interfaceId,
            name: name
        }})
        .then(workflowDatas => { 
            let recordIdArray = [];
            for (let i = 0; workflowDatas.length > i; i++) {
                if (workflowDatas[i].type.name === 'checkbox'&&
                    workflowDatas[i].isSelected) {
                    recordIdArray.push(workflowDatas[i].recordId);
                } else if (workflowDatas[i].type.name === 'dropdown' &&
                           workflowDatas[i].isSelected) {
                    recordIdArray.push(workflowDatas[i].recordId);
                }

            }

            return recordIdArray;
        }).catch(err => {
            console.log(err)
        });
    }


    let recordIdArray = [];

    for (let i = 0; objKeys.length > i; i++) {

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'text' && whereCondition[objKeys[i]].value) {
            
            if (whereCondition[objKeys[i]].isFileData) {

                const recordIdArrayPromise = await getRecordDataString(objKeys[i], whereCondition[objKeys[i]].value);
                recordIdArray = [...recordIdArray, ...recordIdArrayPromise]
            } else {
                const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj});
            }

        } 

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'number' && whereCondition[objKeys[i]].value) {

            if (whereCondition[objKeys[i]].isFileData) {

                const recordIdArrayPromise = await getRecordDataString(objKeys[i], whereCondition[objKeys[i]].value);
                recordIdArray = [...recordIdArray, ...recordIdArrayPromise]
            } else { 
                const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj});
            }

        } 

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'date') {

            if (whereCondition[objKeys[i]].isFileData) {
                if (whereCondition[objKeys[i]].dateFilter) {
                    const recordIdArrayPromise = await getRecordDataDate(objKeys[i], 
                        new Date(whereCondition[objKeys[i]].dateFilter.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24),
                        new Date(whereCondition[objKeys[i]].dateFilter.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24));
                    recordIdArray = [...recordIdArray, ...recordIdArrayPromise]
                }
            } else { 
                if (whereCondition[objKeys[i]].dateFilter) {
                    const textFilterObj = {[Op.and]: [
                        { [Op.gte]: new Date(whereCondition[objKeys[i]].dateFilter.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                        { [Op.lte]: new Date(whereCondition[objKeys[i]].dateFilter.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
                    ]};

                    Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj});
                }
            }

        } 

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'array') {

            if (whereCondition[objKeys[i]].isFileData) {

                if (whereCondition[objKeys[i]].arrayFilter && whereCondition[objKeys[i]].arrayFilter.name) {

                    const recordIdArrayPromise = await getRecordDataArray(whereCondition[objKeys[i]].arrayFilter.name)

                    recordIdArray = [...recordIdArray, ...recordIdArrayPromise]
                }
            } else { 

                if (whereCondition[objKeys[i]].arrayFilter && !whereCondition[objKeys[i]].arrayFilter.value) {
                    const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                    Object.assign(tableConditions.where, textFilterObj);
                } else if (whereCondition[objKeys[i]].arrayFilter && whereCondition[objKeys[i]].arrayFilter.value.name) {
                    const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                    Object.assign(tableConditions.where, textFilterObj);
                } else if (whereCondition[objKeys[i]].arrayFilter && whereCondition[objKeys[i]].arrayFilter.value) {

                    const textFilterObj = {[objKeys[i]]: whereCondition[objKeys[i]].arrayFilter.value };
                    Object.assign(tableConditions.where, textFilterObj);
                }
            }

        } 
    }

    if (recordIdArray.length > 0) {
        Object.assign(tableConditions.where, {recordId: {[Op.or]: recordIdArray}} )
    }

    WorkflowRecords.findAndCountAll(tableConditions)
    .then(workflowRecords => { 
        let rows = JSON.parse(JSON.stringify(workflowRecords.rows));

        rows.forEach(function(x){delete x.fileData});

        let workflowRecordsData = {
            count: workflowRecords.count,
            rows: rows,
            fileDataHeaders: []
        };

        for (let i = 0; workflowRecords.rows.length > i; i++) {
            if (workflowRecords.rows[i].fileData.length > 0) {
                for (let j = 0; workflowRecords.rows[i].fileData.length > j; j++) {
                    if (workflowRecords.rows[i].fileData[j].value) {
                        Object.assign(workflowRecordsData.rows[i], {[workflowRecords.rows[i].fileData[j].name]: workflowRecords.rows[i].fileData[j].value});
                        workflowRecordsData.fileDataHeaders.push(workflowRecords.rows[i].fileData[j].name);
                    }
                }
            }
        }


        res.status(200).json(workflowRecordsData);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowRecord = async(req, res, next) => {
    WorkflowRecords.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        activeStep: req.body.activeStep,
        lastActiveStep: req.body.lastActiveStep,
        stepStatus: req.body.stepStatus,
        fileStatus: req.body.fileStatus,
        isEmployee: req.body.isEmployee,
        isSupervisor: req.body.isSupervisor,
        isManager: req.body.isManager,
        isSubmitted: req.body.isSubmitted,
        jsonData: req.body.jsonData,
        fileData: req.body.fileData,
        objectData: req.body.objectData,
        deleteFlag: req.body.deleteFlag,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowRecord => { 
        let historyDumpFile = [];
        for (let i = 0; workflowRecord.fileData.length > i; i++) { 
            Object.assign(workflowRecord.fileData[i], {recordId: workflowRecord.recordId});
        }
        WorkflowDatas.bulkCreate(workflowRecord.fileData).then(() => {
            WorkflowHistories.bulkCreate(historyDumpFile).then(() => {
                res.status(201).json({
                    message: 'Post Success',
                    post: workflowRecord
                });
            }).catch(err => {
                console.log(err)
            });
        }).catch(err => { 
            console.log(err) 
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateWorkflowRecord = async(req, res, next) => {
    
    const recordId = req.params.recordId;
    let stepIndex = null;

    /*********************************/
    /* 1. Update the workflow record */
    /*********************************/

    const updateWorkflowRecord = await new Promise((resolve, reject) => {
        return WorkflowRecords.findByPk(recordId)
        .then(workflowRecord => { 
            stepIndex = workflowRecord.activeStep
            workflowRecord.interfaceId = req.body.interfaceId,
            workflowRecord.systemId = req.body.systemId,
            workflowRecord.organizationId = req.body.organizationId,
            workflowRecord.activeStep = req.body.activeStep,
            workflowRecord.lastActiveStep = req.body.lastActiveStep,
            workflowRecord.stepStatus = req.body.stepStatus,
            workflowRecord.fileStatus = req.body.fileStatus,
            workflowRecord.isEmployee = req.body.isEmployee,
            workflowRecord.isSupervisor = req.body.isSupervisor,
            workflowRecord.isManager = req.body.isManager,
            workflowRecord.isSubmitted = req.body.isSubmitted,
            workflowRecord.jsonData = {},
            workflowRecord.fileData = req.body.fileData,
            workflowRecord.objectData = {},
            workflowRecord.deleteFlag = req.body.deleteFlag,
            workflowRecord.createdById = req.body.createdById,
            workflowRecord.createdByName = req.body.createdByName,
            workflowRecord.updatedById = req.body.updatedById,
            workflowRecord.updatedByName = req.body.updatedByName
            return workflowRecord.save();
        })
        .then(workflowRecord => { 
            resolve(workflowRecord);
            return workflowRecord;
        });
    });

    /************************/
    /* 2. Find the step  id */
    /************************/

    const steps = await new Promise((resolve, reject) => { 
        return Steps.findAll({
            where: { 
                organizationId: req.body.organizationId,
                systemId: req.body.systemId,
                interfaceId: req.body.interfaceId,               
            },
            order: [ [ 'stepId', 'ASC' ]],
        })
        .then(steps => { 
            resolve(steps);
            return steps;
        })
        .catch(err => {
            reject(err);
            console.log(err);
        });
    });

    const fileData = await JSON.parse(JSON.stringify(req.body.fileData));
    const stepId = req.body.lastActiveStep;
    
    //const stepId = stepIndex.indexOf('Completed') >= 0? steps[steps.length].stepId : steps[parseInt(stepIndex.replace('Step: ', ''))].stepId;

    const recordsFileData = await fileData.filter(x => x.stepId === stepId);

    /*********************************************/
    /* 3. if exist on workflow data then destroy */
    /*********************************************/

    const destroyed = await new Promise((resolve, reject) => { 
        return WorkflowDatas.destroy({
            where: { 
                organizationId: req.body.organizationId,
                systemId: req.body.systemId,
                interfaceId: req.body.interfaceId,     
                stepId: stepId,
                recordId: recordId          
            },
        })
        .then(destroyed => { 
            resolve(destroyed);
            return destroyed;
        })
        .catch(err => {
            reject(err);
            console.log(err);
        });
    });

    /***************************************/
    /* 4. assign record id on records */
    /***************************************/

    let recordsFileDataCopy = JSON.parse(JSON.stringify(recordsFileData));

    for (let i = 0; recordsFileDataCopy.length > i; i++) { 
        Object.assign(recordsFileDataCopy[i], {recordId: recordId});
    }

    /***************************************/
    /* 5. create new workflow data records */
    /***************************************/

    const createdData = await new Promise((resolve, reject) => { 
        return WorkflowDatas.bulkCreate(recordsFileDataCopy)
        .then(created => { 
            resolve(created);
            return created;
        })
        .catch(err => {
            reject(err);
            console.log(err);
        });
    });

    /********************************************/
    /* 6. create new workflow histories records */
    /********************************************/

    const createdHistory = await new Promise((resolve, reject) => { 
        return WorkflowHistories.bulkCreate(recordsFileDataCopy)
        .then(created => { 
            resolve(created);
            return created;
        })
        .catch(err => {
            reject(err);
            console.log(err);
        });
    });


    res.status(201).json({
        message: 'Post Success',
        post: updateWorkflowRecord
    });

};

exports.deleteWorkflowRecord = (req, res, next) => {
    const recordId = req.params.recordId;
    WorkflowRecords.findByPk(recordId)
    .then(workflowRecord => { 
        return workflowRecord.destroy();
    })
    .then(workflowRecord => {
        WorkflowDatas.destroy({
            where: {
                recordId: workflowRecord.recordId,
            }
        }).then(() => {
            WorkflowAssignments.destroy({
                where: {
                    recordId: workflowRecord.recordId,
                }
            }).then(() => {
    
                res.status(201).json({
                    message: 'Delete Success',
                    post: workflowRecord
                });
            });
        });
    })
    .catch(err => {
        console.log(err.message)
        res.status(500).json({
            message: err,
        });
    });
};