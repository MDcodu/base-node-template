const Steps = require('../models/steps');

exports.getSteps = (req, res, next) => {
    Steps.findAll()
    .then(steps => { 
        res.status(200).json(steps);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getStep = (req, res, next) => {
    const stepId = req.params.stepId;
    Steps.findByPk(stepId)
    .then(step => { 
        res.status(200).json(step);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createStep = (req, res, next) => {
    Steps.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        entityId: req.body.entityId,
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(step => { 
        res.status(201).json({
            message: 'Post Success',
            post: step
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateStep = (req, res, next) => {
    const stepId = req.params.stepId;
    Steps.findByPk(stepId)
    .then(step => { 
        step.interfaceId = req.body.interfaceId,
        step.systemId = req.body.systemId,
        step.entityId = req.body.entityId,
        step.dataName = req.body.dataName,
        step.jsonData = req.body.jsonData,
        step.modifiedBy = req.body.modifiedBy
        return step.save();
    })
    .then(step => {
        res.status(201).json({
            message: 'Put Success',
            post: step
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteStep = (req, res, next) => {
    const stepId = req.params.stepId;
    Steps.findByPk(stepId)
    .then(step => { 
        return step.destroy();
    })
    .then(step => {
        res.status(201).json({
            message: 'Delete Success',
            post: step
        });
    })
    .catch(err => {
        console.log(err)
    });
};