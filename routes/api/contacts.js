const express = require('express')

const router = express.Router()

const ctrl = require('../../controllers/contacts')

const { validateBody, isBody } = require('../../middlewares')

const schemas = require('../../schemas/contacts')

router.get('/', ctrl.listContacts)

router.get('/:contactId', ctrl.getContactById)

router.post('/', validateBody(schemas.schema), ctrl.addContact)

router.delete('/:contactId', ctrl.removeContact)

router.put('/:contactId', isBody(), validateBody(schemas.schema), ctrl.updateContact)

module.exports = router
