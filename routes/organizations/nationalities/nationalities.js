const express = require('express');
const router = express.Router();
const nationalitiesController = require('../../../controllers/organizations/nationalities/nationalities');

router.get('/nationalities', nationalitiesController.getNationalities);

router.get('/nationalities/choices/:fieldName', nationalitiesController.getNationalityFilterChoices);

router.get('/nationalities/:nationalityId', nationalitiesController.getNationality);

router.post('/nationalities/table', [], nationalitiesController.getNationalitiesTable);

router.post('/nationalities', [], nationalitiesController.createNationality);

router.put('/nationalities/:nationalityId', [], nationalitiesController.updateNationality);

router.delete('/nationalities/:nationalityId', nationalitiesController.deleteNationality);

module.exports = router;