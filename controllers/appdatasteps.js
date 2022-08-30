const AppDataSteps = require('../models/appdatasteps');

exports.getAppDataSteps = (req, res, next) => {
    AppDataSteps.findAll()
    .then(appDataSteps => { 
        res.status(200).json(appDataSteps);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getAppDataStep = (req, res, next) => {
    const stepDataId = req.params.stepDataId;
    AppDataSteps.findByPk(stepDataId)
    .then(appDataStep => { 
        res.status(200).json(appDataStep);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createAppDataStep = (req, res, next) => {
    AppDataSteps.create({
        dataId: req.body.dataId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        entityId: req.body.entityId,
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(appDataStep => { 
        res.status(201).json({
            message: 'Post Success',
            post: appDataStep
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateAppDataStep = (req, res, next) => {
    const stepDataId = req.params.stepDataId;
    AppDataSteps.findByPk(stepDataId)
    .then(appDataStep => { 
        appDataStep.dataId = req.body.dataId,
        appDataStep.interfaceId = req.body.interfaceId,
        appDataStep.systemId = req.body.systemId,
        appDataStep.entityId = req.body.entityId,
        appDataStep.dataName = req.body.dataName,
        appDataStep.jsonData = req.body.jsonData,
        appDataStep.modifiedBy = req.body.modifiedBy
        return appDataStep.save();
    })
    .then(appDataStep => {
        res.status(201).json({
            message: 'Put Success',
            post: appDataStep
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteAppDataStep = (req, res, next) => {
    const stepDataId = req.params.stepDataId;
    AppDataSteps.findByPk(stepDataId)
    .then(appDataStep => { 
        return appDataStep.destroy();
    })
    .then(appDataStep => {
        res.status(201).json({
            message: 'Delete Success',
            post: appDataStep
        });
    })
    .catch(err => {
        console.log(err)
    });
};