const express = require('express');
const router = express.Router();
const stepPermissionsController = require('../../controllers/steps/step-permissions');

router.get('/steppermissions', stepPermissionsController.getStepPermissions);

router.get('/steppermissions/choices/:fieldName', stepPermissionsController.getStepPermissionFilterChoices);

router.get('/steppermissions/:stepPermissionId', stepPermissionsController.getStepPermission);

router.post('/steppermissions/table', [], stepPermissionsController.getStepPermissionsTable);

router.get('/steppermissions/organization/:organizationId', stepPermissionsController.getStepPermissionByOrganization);

router.post('/steppermissions', [], stepPermissionsController.createStepPermission);

router.put('/steppermissions/:stepPermissionId', [], stepPermissionsController.updateStepPermission);

router.delete('/steppermissions/:stepPermissionId', stepPermissionsController.deleteStepPermission);

module.exports = router;