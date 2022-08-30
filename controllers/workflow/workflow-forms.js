
const WorkflowForms = require('../../models/workflow/workflow-forms');

exports.getWorkflowForms = (req, res, next) => {
    WorkflowForms.findAll()
    .then(workflowForms => { 
        res.status(200).json(workflowForms);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowForm = (req, res, next) => {
    const dataId = req.params.dataId;
    WorkflowForms.findByPk(dataId)
    .then(workflowForm => { 
        res.status(200).json(workflowForm);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowForm = (req, res, next) => {
    WorkflowForms.create({
        historyId: req.body.historyId,
        recordId: req.body.recordId,
        itemId: req.body.itemId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        value: req.body.value,
        jsonData: req.body.jsonData,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowForm => { 
        res.status(201).json({
            message: 'Post Success',
            post: workflowForm
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateWorkflowForm = (req, res, next) => {
    const dataId = req.params.dataId;
    WorkflowForms.findByPk(dataId)
    .then(workflowForm => { 
        workflowForm.historyId = req.body.historyId,
        workflowForm.recordId = req.body.recordId,
        workflowForm.itemId = req.body.itemId,
        workflowForm.stepId = req.body.stepId,
        workflowForm.interfaceId = req.body.interfaceId,
        workflowForm.systemId = req.body.systemId,
        workflowForm.organizationId = req.body.organizationId,
        workflowForm.value = req.body.value,
        workflowForm.jsonData = req.body.jsonData,
        workflowForm.createdById = req.body.createdById,
        workflowForm.createdByName = req.body.createdByName,
        workflowForm.updatedById = req.body.updatedById,
        workflowForm.updatedByName = req.body.updatedByName
        return workflowForm.save();
    })
    .then(workflowForm => {
        res.status(201).json({
            message: 'Put Success',
            post: workflowForm
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteWorkflowForm = (req, res, next) => {
    const dataId = req.params.dataId;
    WorkflowForms.findByPk(dataId)
    .then(workflowForm => { 
        return workflowForm.destroy();
    })
    .then(workflowForm => {
        res.status(201).json({
            message: 'Delete Success',
            post: workflowForm
        });
    })
    .catch(err => {
        console.log(err)
    });
};