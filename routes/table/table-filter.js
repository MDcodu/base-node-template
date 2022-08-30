const express = require('express');
const router = express.Router();
const tableFilterController = require('../../controllers/table/table-filter');

router.get('/table/table-filter', tableFilterController.getTableFilters);

router.get('/table/table-filter/organization/:organizationId/system/:systemId/interface/:interfaceId/session/:sessionId', tableFilterController.getLastTableFilter);

router.get('/table/table-filter/:tableFilterId', tableFilterController.getTableFilter);

router.post('/table/table-filter', [], tableFilterController.createTableFilter);

router.put('/table/table-filter/:tableFilterId', [], tableFilterController.updateTableFilter);

router.delete('/table/table-filter/:tableFilterId', tableFilterController.deleteTableFilter);

module.exports = router;