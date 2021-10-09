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

router.get('/', getContacts)

router.get('/:contactId', validateContactId, getContact)

router.post('/', validateContact, saveContact)

router.delete('/:contactId', validateContactId, removeContact)

router.put('/:contactId', [validateContactId, validateContact], updateContact)

router.patch('/:contactId/favorite', validateContactId, validateStatusContact, updateStatusContact)



module.exports = router
