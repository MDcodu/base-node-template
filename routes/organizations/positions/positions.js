const express = require('express');
const router = express.Router();
const positionsController = require('../../../controllers/organizations/positions/positions');

router.get('/positions', positionsController.getPositions);

router.get('/positions/choices/:fieldName', positionsController.getPositionFilterChoices);

router.get('/positions/:positionId', positionsController.getPosition);

router.post('/positions/table', [], positionsController.getPositionsTable);

router.post('/positions', [], positionsController.createPosition);

router.put('/positions/:positionId', [], positionsController.updatePosition);

router.delete('/positions/:positionId', positionsController.deletePosition);

module.exports = router;