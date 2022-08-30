const TableFilter = require('../../models/table/table-filter');

exports.getTableFilters = (req, res, next) => {
    TableFilter.findAll()
    .then(tableFilters => { 
        res.status(200).json(tableFilters);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getLastTableFilter = (req, res, next) => {
    const organizationId = req.params.organizationId;
    const systemId = req.params.systemId;
    const interfaceId = req.params.interfaceId;
    const sessionId = req.params.sessionId;
    TableFilter.findOne({
        where: { 
            organizationId: organizationId,
            systemId: systemId,
            interfaceId: interfaceId,
            sessionId: sessionId
        },
        order: [ [ 'createdAt', 'DESC' ]],
    })
    .then(tableFilter => { 
        res.status(200).json(tableFilter);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.getTableFilter = (req, res, next) => {
    const tableFilterId = req.params.tableFilterId;
    TableFilter.findByPk(tableFilterId)
    .then(tableFilter => { 

        res.status(200).json(tableFilter);
    })
    .catch(err => {
        console.log(err)
    });
};

exports.createTableFilter = (req, res, next) => {
    TableFilter.create({
        sessionId: req.body.sessionId,
        interfaceId: req.body.interfaceId,
        systemId: req.body.systemId,
        organizationId: req.body.organizationId,
        whereCondition: req.body.whereCondition,
        offset: req.body.offset,
        limit: req.body.limit,
        order: req.body.order,
        createdById: req.body.createdById,
        createdByName: req.body.createdByName,
        updatedById: req.body.updatedById,
        updatedByName: req.body.updatedByName,
        fromComponent: req.body.fromComponent,
    })
    .then(tableFilter => { 
        res.status(201).json({
            message: 'Post Success',
            post: tableFilter
        });
    })
    .catch(err => { 
        console.log(err) 
    });
};

exports.updateTableFilter = (req, res, next) => {
    const tableFilterId = req.params.tableFilterId;
    TableFilter.findByPk(tableFilterId)
    .then(tableFilter => { 
        tableFilter.sessionId = req.body.sessionId,
        tableFilter.interfaceId = req.body.interfaceId,
        tableFilter.systemId = req.body.systemId,
        tableFilter.organizationId = req.body.organizationId,
        tableFilter.whereCondition = req.body.whereCondition,
        tableFilter.offset = req.body.offset,
        tableFilter.limit = req.body.limit,
        tableFilter.order = req.body.order,
        tableFilter.createdById = req.body.createdById,
        tableFilter.createdByName = req.body.createdByName,
        tableFilter.updatedById = req.body.updatedById,
        tableFilter.updatedByName = req.body.updatedByName,
        tableFilter.fromComponent = req.body.fromComponent
        return tableFilter.save();
    })
    .then(tableFilter => {
        res.status(201).json({
            message: 'Put Success',
            post: tableFilter
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.deleteTableFilter = (req, res, next) => {
    const tableFilterId = req.params.tableFilterId;
    TableFilter.findByPk(tableFilterId)
    .then(tableFilter => { 
        return tableFilter.destroy();
    })
    .then(tableFilter => {
        res.status(201).json({
            message: 'Delete Success',
            post: tableFilter
        });
    })
    .catch(err => {
        console.log(err)
    });
};