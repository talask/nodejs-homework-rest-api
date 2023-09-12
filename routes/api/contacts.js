const express = require('express')

const router = express.Router()

const ctrl = require('../../controllers/contacts')

const { validateBody, isBody, isValidId, authenticate } = require('../../middlewares')

const schemas = require('../../schemas/contacts')

router.get('/', authenticate, ctrl.listContacts)

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById)

router.post('/', authenticate, validateBody(schemas.schema), ctrl.addContact)

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact)

router.put('/:contactId', authenticate, isValidId, isBody('put'), validateBody(schemas.schema), ctrl.updateContact)

router.patch('/:contactId/favorite', authenticate, isValidId, isBody('patch'), validateBody(schemas.schemaUpdateFavorite), ctrl.updateFavorite)

module.exports = router
