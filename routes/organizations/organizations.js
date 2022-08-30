const express = require('express');
const router = express.Router();
const organizationsController = require('../../controllers/organizations/organizations');

router.get('/organizations', organizationsController.getOrganizations);

router.get('/organizations/choices/:fieldName', organizationsController.getOrganizationFilterChoices);

router.get('/organizations/:organizationId', organizationsController.getOrganization);

router.post('/organizations/table', [], organizationsController.getOrganizationsTable);

router.post('/organizations', [], organizationsController.createOrganization);

router.put('/organizations/:organizationId', [], organizationsController.updateOrganization);

router.delete('/organizations/:organizationId', organizationsController.deleteOrganization);

module.exports = router;