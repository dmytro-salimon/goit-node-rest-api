import User from "../db/models/Contact.js";

export const listContacts = () => User.findAll();

export const getContactById = (id) => User.findByPk(id);

export const addContactById = (data) => User.create(data);

export const removeContactById = async (id) => {
  const contact = await getContactById(id);
  if (!contact) return null;

  await contact.destroy();
  return contact;
};

export const updateContactById = async (id, data) => {
  const contact = await getContactById(id);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};

export const updateStatusContact = async (contactId, data) => {
  const contact = await getContactById(contactId);
  if (!contact) return null;

  return contact.update(data, {
    returning: true,
  });
};
