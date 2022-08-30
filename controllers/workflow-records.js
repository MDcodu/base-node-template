const WorkflowRecords = require('../models/workflow-records');
const WorkflowDatas = require('../models/workflow-data');
const WorkflowHistories = require('../models/workflow-histories');
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

exports.getWorkflowRecordsTable = (req, res, next) => {
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


    for (let i = 0; objKeys.length > i; i++) {

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'text') {

            if (whereCondition[objKeys[i]].isFileData) {
                const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
                Object.assign(tableConditions.where.objectData, {[objKeys[i]]: { value:  textFilterObj}});
            } else {
                const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj});
            }

        } 

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'number') {

            if (whereCondition[objKeys[i]].isFileData) {
                const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
                Object.assign(tableConditions.where.objectData, {[objKeys[i]]: { value:  textFilterObj}});
            } else { 
                const textFilterObj = {[Op.like]: `%${whereCondition[objKeys[i]].value}%`};
                Object.assign(tableConditions.where, {[objKeys[i]]: textFilterObj});
            }

        } 

        if (objKeys[i] && whereCondition[objKeys[i]].type === 'date') {

            if (whereCondition[objKeys[i]].isFileData) {
                if (whereCondition[objKeys[i]].dateFilter) {
                    const textFilterObj = {[Op.and]: [
                        { [Op.gte]: new Date(whereCondition[objKeys[i]].dateFilter.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                        { [Op.lte]: new Date(whereCondition[objKeys[i]].dateFilter.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
                    ]};
                    Object.assign(tableConditions.where.objectData, {[objKeys[i]]: { value: textFilterObj }});
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
                if (!whereCondition[objKeys[i]].arrayFilter.value) {
                    const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                    Object.assign(tableConditions.where.objectData, { value: textFilterObj });
                } else {
                    const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                    Object.assign(tableConditions.where.objectData, { value: textFilterObj });
                }
            } else { 
                if (!whereCondition[objKeys[i]].arrayFilter.value) {
                    const textFilterObj = {[objKeys[i]]: {name: whereCondition[objKeys[i]].arrayFilter.name } };
                    Object.assign(tableConditions.where, textFilterObj);
                } else {
                    const textFilterObj = {[objKeys[i]]: {value: { name: whereCondition[objKeys[i]].arrayFilter.value.name} } };
                    Object.assign(tableConditions.where, textFilterObj);
                }
            }

        } 
    }

    WorkflowRecords.findAndCountAll(tableConditions)
    .then(workflowRecords => { 

        let workflowRecordsData = {
            count: workflowRecords.count,
            rows: JSON.parse(JSON.stringify(workflowRecords.rows)),
            fileDataHeaders: []
        };

        for (let i = 0; workflowRecords.rows.length > i; i++) {
            if (workflowRecords.rows[i].fileData.length > 0) {
                for (let j = 0; workflowRecords.rows[i].fileData.length > j; j++) {
                    Object.assign(workflowRecordsData.rows[i], {[workflowRecords.rows[i].fileData[j].name]: workflowRecords.rows[i].fileData[j].value});
                    workflowRecordsData.fileDataHeaders.push(workflowRecords.rows[i].fileData[j].name);
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

exports.updateWorkflowRecord = (req, res, next) => {
    const recordId = req.params.recordId;
    WorkflowRecords.findByPk(recordId)
    .then(workflowRecord => { 
        workflowRecord.interfaceId = req.body.interfaceId,
        workflowRecord.systemId = req.body.systemId,
        workflowRecord.organizationId = req.body.organizationId,
        workflowRecord.activeStep = req.body.activeStep,
        workflowRecord.stepStatus = req.body.stepStatus,
        workflowRecord.fileStatus = req.body.fileStatus,
        workflowRecord.isEmployee = req.body.isEmployee,
        workflowRecord.isSupervisor = req.body.isSupervisor,
        workflowRecord.isManager = req.body.isManager,
        workflowRecord.isSubmitted = req.body.isSubmitted,
        workflowRecord.jsonData = req.body.jsonData,
        workflowRecord.fileData = req.body.fileData,
        workflowRecord.objectData = req.body.objectData,
        workflowRecord.deleteFlag = req.body.deleteFlag,
        workflowRecord.createdById = req.body.createdById,
        workflowRecord.createdByName = req.body.createdByName,
        workflowRecord.updatedById = req.body.updatedById,
        workflowRecord.updatedByName = req.body.updatedByName
        return workflowRecord.save();
    })
    .then(workflowRecord => {
        WorkflowDatas.destroy({
            where: {
                recordId: workflowRecord.recordId,
            }
        }).then(() => {
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
            });
        });
    })
    .catch(err => {
        console.log(err)
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
            res.status(201).json({
                message: 'Delete Success',
                post: workflowRecord
            });
        });
    })
    .catch(err => {
        console.log(err)
    });
};