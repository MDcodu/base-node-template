const express = require('express');
const router = express.Router();
const stepRulesController = require('../../controllers/steps/step-rules');

router.get('/steprules', stepRulesController.getStepRules);

router.get('/steprules/choices/:fieldName', stepRulesController.getStepRuleFilterChoices);

router.get('/steprules/:stepRuleId', stepRulesController.getStepRule);

router.post('/steprules/table', [], stepRulesController.getStepRulesTable);

router.get('/steprules/organization/:organizationId', stepRulesController.getStepRuleByOrganization);

router.post('/steprules', [], stepRulesController.createStepRule);

router.put('/steprules/:stepRuleId', [], stepRulesController.updateStepRule);

router.delete('/steprules/:stepRuleId', stepRulesController.deleteStepRule);

module.exports = router;