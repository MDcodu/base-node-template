const WorkflowSteps = require('../../models/workflow/workflow-steps');

exports.getWorkflowSteps = (req, res, next) => {
    WorkflowSteps.findAll()
    .then(workflowSteps => { 
        res.status(200).json(workflowSteps);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowStep = (req, res, next) => {
    const stepRecordId = req.params.stepRecordId;
    WorkflowSteps.findByPk(stepRecordId)
    .then(workflowStep => { 
        res.status(200).json(workflowStep);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getWorkflowStepRecord = (req, res, next) => {
    const recordId = req.body.recordId;
    WorkflowSteps.findAll({
        // attributes: ['stepRecordId', 'name', 'reference'],
        where: {recordId: recordId}})
    .then(workflowSteps => { 
        res.status(200).json(workflowSteps);
    })
    .catch(err => {
        console.log(err)
    });
};


exports.createWorkflowStep = (req, res, next) => {
    WorkflowSteps.create({
        recordId: req.body.recordId,
        stepId: req.body.stepId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        position: req.body.position,
        type: req.body.type,
        icon: req.body.icon,
        unlocked: req.body.unlocked,
        index: req.body.index,
        stepStatus: req.body.stepStatus,
        activeStep: req.body.activeStep,
        fileStatus: req.body.fileStatus,
        reference: req.body.reference,
        config: req.body.config,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName
    })
    .then(workflowStep => { 
        res.status(201).json({
            message: 'Post Success',
            post: workflowStep
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateWorkflowStep = (req, res, next) => {
    const stepRecordId = req.body.stepRecordId;
    WorkflowSteps.findByPk(stepRecordId)
    .then(workflowStep => { 
        workflowStep.recordId = req.body.recordId,
        workflowStep.stepId = req.body.stepId,
        workflowStep.interfaceId = req.body.interfaceId,
        workflowStep.systemId = req.body.systemId,
        workflowStep.organizationId = req.body.organizationId,
        workflowStep.name = req.body.name,
        workflowStep.description = req.body.description,
        workflowStep.position = req.body.position,
        workflowStep.type = req.body.type,
        workflowStep.icon = req.body.icon,
        workflowStep.unlocked = req.body.unlocked,
        workflowStep.index = req.body.index,
        workflowStep.stepStatus = req.body.stepStatus,
        workflowStep.activeStep = req.body.activeStep,
        workflowStep.fileStatus = req.body.fileStatus,
        workflowStep.reference = req.body.reference,
        workflowStep.config = req.body.config,
        workflowStep.createdById = req.body.createdById,
        workflowStep.createdByName = req.body.createdByName,
        workflowStep.updatedById = req.body.updatedById,
        workflowStep.updatedByName = req.body.updatedByName
        return workflowStep.save();
    })
    .then(workflowStep => {
        res.status(201).json({
            message: 'Put Success',
            post: workflowStep
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteWorkflowStep = (req, res, next) => {
    const stepRecordId = req.params.stepId;
    WorkflowSteps.findByPk(stepRecordId)
    .then(workflowStep => { 
        return workflowStep.destroy();
    })
    .then(workflowStep => {
        res.status(201).json({
            message: 'Delete Success',
            post: workflowStep
        });
    })
    .catch(err => {
        console.log(err)
    });
};