import Contact from "../db/models/Contact.js";

export const listContacts = (query) =>
  Contact.findAll({
    where: query,
  });

export const getContactById = (id) => Contact.findByPk(id);

export const getContact = (query) =>
  Contact.findOne({
    where: query,
  });

export const addContactById = (data) => Contact.create(data);

export const removeContact = async (query) => {
  const contact = await getContact(query);
  if (!contact) return null;

  await contact.destroy({
    where: query,
  });
  return contact;
};

export const updateContact = async (query, data) => {
  const contact = await getContact(query);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};

export const updateStatusContact = async (contactId, owner, data) => {
  const contact = await getContact({ id: contactId, owner });
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};
