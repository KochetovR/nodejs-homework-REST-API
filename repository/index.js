const Contact = require('../model/contact')

const listContacts = async () => {
  const res = await Contact.find({})
  return res
}

const getContactById = async (contactId) => {
  const res = await Contact.findById(contactId)
  return res
}

const removeContact = async (contactId) => {
  const res = await Contact.findByIdAndRemove({_id: contactId})
  return res
}

const addContact = async (body) => {
  const res = await Contact.create(body)
  return res
}

const updateContact = async (contactId, body) => {
  const res = await Contact.findByIdAndUpdate(
    {_id: contactId},
    {...body},
    {new: true},
    )
  return res
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
