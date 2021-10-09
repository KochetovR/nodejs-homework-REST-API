const Contacts = require('../repository')

const getContacts = async(req, res, next) => {
    try {
        console.log(req.method)
        const contacts = await Contacts.listContacts()
        res.json({status: 'success', code: 200, data: {contacts}})
    } catch (error) {
        next(error)
    }
}

const getContact = async (req, res, next) => {
    try {
        const contact = await Contacts.getContactById(req.params.contactId)
        console.log(contact)
        console.log(contact.contactId)
        if (contact) {
        return res
            .status(200)
            .json({ status: 'success', code: 200, data: { contact } })
        }
        return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not Found' })
    } catch (error) {
        next(error)
    }
}

const saveContact = async (req, res, next) => {
    try {
      const contact = await Contacts.addContact(req.body)
      res.status(201).json({ status: 'success', code: 201, data: { contact } })
    } catch (error) {
      next(error)
    }
}

const removeContact = async (req, res, next) => {
    try {
      const contact = await Contacts.removeContact(req.params.contactId)
      if (contact) {
        return res
          .status(200)
          .json({ status: 'success', code: 200, data: { contact } })
      }
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not Found' })
    } catch (error) {
      next(error)
    }
}

const updateContact = async (req, res, next) => {
    try {
        console.log(req.method)
        const contact = await Contacts.updateContact(req.params.contactId, req.body)
        if (contact) {
        return res
            .status(200)
            .json({ status: 'success', code: 200, data: { contact } })
        }
        return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not Found' })
    } catch (error) {
        next(error)
    }
}

const updateStatusContact = async (req, res, next) => {
    try {
      const contact = await Contacts.updateContact(req.params.contactId, req.body)
      if (contact) {
        return res
          .status(200)
          .json({ status: 'success', code: 200, data: { contact } })
      }
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not Found' })
    } catch (error) {
      next(error)
    }
  }

  module.exports = {
    getContacts,
    getContact,
    saveContact,
    removeContact,
    updateContact,
    updateStatusContact
  }