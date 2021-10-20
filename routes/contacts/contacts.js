const express = require('express')
const router = express.Router()
const {validateContact, validateStatusContact, validateContactId} = require('./validate')
const {
    getContact, 
    getContacts, 
    removeContact, 
    saveContact, 
    updateContact,
    updateStatusContact} = require('../../controllers/contacts')

const guard = require('../../helpers/guard')
const wrapError = require('../../helpers/errorHandler')

router.get('/', guard, getContacts)

router.get('/:contactId', guard, validateContactId, wrapError(getContact))

router.post('/', guard, validateContact, wrapError(saveContact))

router.delete('/:contactId', guard, validateContactId, wrapError(removeContact))

router.put('/:contactId', guard, [validateContactId, validateContact], wrapError(updateContact))

router.patch('/:contactId/favorite', guard,
 validateContactId, validateStatusContact, wrapError(updateStatusContact))

module.exports = router
