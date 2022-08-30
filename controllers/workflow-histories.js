const WorkflowHistories = require('../models/workflow-histories');

exports.getWorkflowHistories = (req, res, next) => {
    WorkflowHistories.findAll()
    .then(workflowHistories => { 
        res.status(200).json(workflowHistories);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowHistory = (req, res, next) => {
    const historyId = req.params.historyId;
    WorkflowHistories.findByPk(historyId)
    .then(workflowHistory => { 
        res.status(200).json(workflowHistory);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowHistory = (req, res, next) => {
    WorkflowHistories.create({
        objectId: req.body.objectId,
        recordId: req.body.recordId,
        itemId: req.body.itemId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        objectParentId: req.body.objectParentId,
        name: req.body.name,
        type: req.body.type,
        label: req.body.label,
        level: req.body.level,
        value: req.body.value,
        comment: req.body.comment,
        config: req.body.config,
        isRequired: req.body.isRequired,
        commentType: req.body.commentType,
        description: req.body.description,
        defaultSelected: req.body.defaultSelected,
        isSelected: req.body.isSelected,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowHistory => { 
        res.status(201).json({
            message: 'Post Success',
            post: workflowHistory
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateWorkflowHistory = (req, res, next) => {
    const historyId = req.params.historyId;
    WorkflowHistories.findByPk(historyId)
    .then(workflowHistory => { 
        workflowData.objectId = req.body.objectId,
        workflowData.recordId = req.body.recordId,
        workflowData.itemId = req.body.itemId,
        workflowData.stepId = req.body.stepId,
        workflowData.interfaceId = req.body.interfaceId,
        workflowData.systemId = req.body.systemId,
        workflowData.organizationId = req.body.organizationId,
        workflowData.objectParentId = req.body.objectParentId,
        workflowData.name = req.body.name,
        workflowData.type = req.body.type,
        workflowData.label = req.body.label,
        workflowData.level = req.body.level,
        workflowData.value = req.body.value,
        workflowData.comment = req.body.comment,
        workflowData.config = req.body.config,
        workflowData.isRequired = req.body.isRequired,
        workflowData.commentType = req.body.commentType,
        workflowData.description = req.body.description,
        workflowData.defaultSelected = req.body.defaultSelected,
        workflowData.isSelected = req.body.isSelected,
        workflowData.createdById = req.body.createdById,
        workflowData.createdByName = req.body.createdByName,
        workflowData.updatedById = req.body.updatedById,
        workflowData.updatedByName = req.body.updatedByName
        return workflowHistory.save();
    })
    .then(workflowHistory => {
        res.status(201).json({
            message: 'Put Success',
            post: workflowHistory
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteWorkflowHistory = (req, res, next) => {
    const historyId = req.params.historyId;
    WorkflowHistories.findByPk(historyId)
    .then(workflowHistory => { 
        return workflowHistory.destroy();
    })
    .then(workflowHistory => {
        res.status(201).json({
            message: 'Delete Success',
            post: workflowHistory
        });
    })
    .catch(err => {
        console.log(err)
    });
};