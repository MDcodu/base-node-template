const express = require('express');
const router = express.Router();
const stepsController = require('../../controllers/steps/steps');

router.get('/steps', stepsController.getSteps);

router.get('/steps/choices/:fieldName', stepsController.getStepFilterChoices);

router.get('/steps/:stepId', stepsController.getStep);

router.post('/steps/systems', [], stepsController.getStepsByOrganizationSystem);

router.post('/steps/table', [], stepsController.getStepsTable);

router.get('/steps/organization/:organizationId', stepsController.getStepByOrganization);

router.post('/steps', [], stepsController.createStep);

router.put('/steps/:stepId', [], stepsController.updateStep);

router.delete('/steps/:stepId', stepsController.deleteStep);

router.post('/steps/moveup', [], stepsController.moveStepUp);

router.post('/steps/movedown', [], stepsController.moveStepDown);

module.exports = router;