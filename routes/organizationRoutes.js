const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationController');

router.post('/', orgController.createOrganization);
router.get('/', orgController.getOrganizations);        
router.get('/:id', orgController.getOrganizationById);
router.put('/:id', orgController.updateOrganization);
router.delete('/:id', orgController.deleteOrganization);

module.exports = router;
