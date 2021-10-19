const Contact = require('../model/contact')

const listContacts = async (userId, query) => {
  const { sortBy, sortByDesc, limit = 20, page = 1,
  } = query
  const searchOptions = { owner: userId }
  const results = await Contact.paginate(searchOptions, {
    limit,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: -1 } : {}), // { favorite=true -1 }
      ...(sortByDesc ? { [`${sortByDesc}`]: 1 } : {}), // { favorite=false 1 }
    },
    populate: {
      path: 'owner'
    },
  })
  const { docs: contacts } = results
  delete results.docs
  return { ...results, contacts }
}

const getContactById = async (contactId, userId) => {
  const res = await Contact.findOne({ _id: contactId, owner: userId }).populate({ path: 'owner',})
  return res
}

const removeContact = async (contactId, userId) => {
  const res = await Contact.findOneAndRemove({ _id: contactId, owner: userId })
  return res
}

const addContact = async (body) => {
  const res = await Contact.create(body)
  return res
}

const updateContact = async (contactId, body, userId) => {
  const res = await Contact.findOneAndUpdate(
    {_id: contactId, owner: userId},
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
