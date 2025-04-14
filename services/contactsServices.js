import Contact from "../db/models/Contact.js";

export const listContacts = () => Contact.findAll();

export const getContactById = (id) => Contact.findByPk(id);

export const addContactById = (data) => Contact.create(data);

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
