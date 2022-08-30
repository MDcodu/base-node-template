const express = require('express');
const router = express.Router();
const sectionsController = require('../../../controllers/organizations/departments/sections');

router.get('/sections', sectionsController.getSections);

router.get('/sections/choices/:fieldName', sectionsController.getSectionFilterChoices);

router.get('/sections/:sectionId', sectionsController.getSection);

router.post('/sections/table', [], sectionsController.getSectionsTable);

router.post('/sections', [], sectionsController.createSection);

router.put('/sections/:sectionId', [], sectionsController.updateSection);

router.delete('/sections/:sectionId', sectionsController.deleteSection);

module.exports = router;