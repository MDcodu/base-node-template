
const WorkflowAmends = require('../../models/workflow/workflow-amends');

exports.getWorkflowAmends = (req, res, next) => {
    WorkflowAmends.findAll()
    .then(workflowAmends => { 
        res.status(200).json(workflowAmends);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowAmend = (req, res, next) => {
    const dataId = req.params.dataId;
    WorkflowAmends.findByPk(dataId)
    .then(workflowAmend => { 
        res.status(200).json(workflowAmend);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowAmend = (req, res, next) => {
    WorkflowAmends.create({
        recordId: req.body.recordId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        amendReason: req.body.amendReason,
        amendNotes: req.body.amendNotes,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowAmend => { 
        res.status(201).json({
            message: 'Post Success',
            post: workflowAmend
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateWorkflowAmend = (req, res, next) => {
    const workflowAmendId = req.params.workflowAmendId;
    WorkflowAmends.findByPk(workflowAmendId)
    .then(workflowAmend => { 
        workflowAmend.workflowAmendId = req.body.workflowAmendId,
        workflowAmend.recordId = req.body.recordId,
        workflowAmend.stepId = req.body.stepId,
        workflowAmend.interfaceId = req.body.interfaceId,
        workflowAmend.systemId = req.body.systemId,
        workflowAmend.organizationId = req.body.organizationId,
        workflowAmend.amendReason = req.body.amendReason,
        workflowAmend.amendNotes = req.body.amendNotes,
        workflowAmend.createdById = req.body.createdById,
        workflowAmend.createdByName = req.body.createdByName,
        workflowAmend.updatedById = req.body.updatedById,
        workflowAmend.updatedByName = req.body.updatedByName
        return workflowAmend.save();
    })
    .then(workflowAmend => {
        res.status(201).json({
            message: 'Put Success',
            post: workflowAmend
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteWorkflowAmend = (req, res, next) => {
    const workflowAmendId = req.params.workflowAmendId;
    WorkflowAmends.findByPk(workflowAmendId)
    .then(workflowAmend => { 
        return workflowAmend.destroy();
    })
    .then(workflowAmend => {
        res.status(201).json({
            message: 'Delete Success',
            post: workflowAmend
        });
    })
    .catch(err => {
        console.log(err)
    });
};