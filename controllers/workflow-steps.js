const WorkflowSteps = require('../models/workflow-steps');

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
    const stepId = req.params.stepId;
    WorkflowSteps.findByPk(stepId)
    .then(workflowStep => { 
        res.status(200).json(workflowStep);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createWorkflowStep = (req, res, next) => {
    WorkflowSteps.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        name: req.body.name,
        description: req.body.description,
        position: req.body.position,
        type: req.body.type,
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
    const stepId = req.params.stepId;
    WorkflowSteps.findByPk(stepId)
    .then(workflowStep => { 
        workflowStep.interfaceId = req.body.interfaceId,
        workflowStep.systemId = req.body.systemId,
        workflowStep.organizationId = req.body.organizationId,
        workflowStep.name = req.body.name,
        workflowStep.description = req.body.description,
        workflowStep.position = req.body.position,
        workflowStep.type = req.body.type,
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
    const stepId = req.params.stepId;
    WorkflowSteps.findByPk(stepId)
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