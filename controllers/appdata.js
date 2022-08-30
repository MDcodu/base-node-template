
const AppData = require('../models/appdata');

exports.getAppDatas = (req, res, next) => {
    AppData.findAll()
    .then(appData => { 
        res.status(200).json(appData);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getAppData = (req, res, next) => {
    const dataId = req.params.dataId;
    AppData.findByPk(dataId)
    .then(appData => { 
        res.status(200).json(appData);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createAppData = (req, res, next) => {
    AppData.create({
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        entityId: req.body.entityId,
        dataName: req.body.dataName,
        jsonData: req.body.jsonData,
        modifiedBy: req.body.modifiedBy,
        inputBy: req.body.inputBy
    })
    .then(appData => { 
        res.status(201).json({
            message: 'Post Success',
            post: appData
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateAppData = (req, res, next) => {
    const dataId = req.params.dataId;
    AppData.findByPk(dataId)
    .then(appData => { 
        appData.interfaceId = req.body.interfaceId,
        appData.systemId = req.body.systemId,
        appData.entityId = req.body.entityId,
        appData.dataName = req.body.dataName,
        appData.jsonData = req.body.jsonData,
        appData.modifiedBy = req.body.modifiedBy
        return appData.save();
    })
    .then(appData => {
        res.status(201).json({
            message: 'Put Success',
            post: appData
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteAppData = (req, res, next) => {
    const dataId = req.params.dataId;
    AppData.findByPk(dataId)
    .then(appData => { 
        return appData.destroy();
    })
    .then(appData => {
        res.status(201).json({
            message: 'Delete Success',
            post: appData
        });
    })
    .catch(err => {
        console.log(err)
    });
};