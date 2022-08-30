const AppDataItems = require('../models/appdataitems');

exports.getAppDataItems = (req, res, next) => {
    AppDataItems.findAll()
    .then(appDataItems => { 
        res.status(200).json(appDataItems);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getAppDataItem = (req, res, next) => {
    const stepDataItemId = req.params.stepDataItemId;
    AppDataItems.findByPk(stepDataItemId)
    .then(appDataItem => { 
        res.status(200).json(appDataItem);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createAppDataItem = (req, res, next) => {
    AppDataItems.create({
        stepDataId: req.body.stepDataId,
        dataId: req.body.dataId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        entityId: req.body.entityId,
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(appDataItem => { 
        res.status(201).json({
            message: 'Post Success',
            post: appDataItem
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateAppDataItem = (req, res, next) => {
    const stepDataItemId = req.params.stepDataItemId;
    AppDataItems.findByPk(stepDataItemId)
    .then(appDataItem => { 
        appDataItem.stepDataId = req.body.stepDataId,
        appDataItem.dataId = req.body.dataId,
        appDataItem.interfaceId = req.body.interfaceId,
        appDataItem.systemId = req.body.systemId,
        appDataItem.entityId = req.body.entityId,
        appDataItem.dataName = req.body.dataName,
        appDataItem.jsonData = req.body.jsonData,
        appDataItem.modifiedBy = req.body.modifiedBy
        return appDataItem.save();
    })
    .then(appDataItem => {
        res.status(201).json({
            message: 'Put Success',
            post: appDataItem
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteAppDataItem = (req, res, next) => {
    const stepDataItemId = req.params.stepDataItemId;
    AppDataItems.findByPk(stepDataItemId)
    .then(appDataItem => { 
        return appDataItem.destroy();
    })
    .then(appDataItem => {
        res.status(201).json({
            message: 'Delete Success',
            post: appDataItem
        });
    })
    .catch(err => {
        console.log(err)
    });
};