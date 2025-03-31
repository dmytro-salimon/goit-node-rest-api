import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getContactsController = async (req, res, next) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
};

const getOneContactController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(contact);
};

const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.removeContactById(id);

  if (!contact) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json({ message: "Contact deleted" });
};

const createContactController = async (req, res) => {
  const contact = await contactsService.addContactById(req.body);
  res.status(201).json(contact);
};

const updateContactController = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.updateContactById(id, req.body);

  if (!contact) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(contact);
};

export default {
  getContactsController: ctrlWrapper(getContactsController),
  getOneContactController: ctrlWrapper(getOneContactController),
  deleteContactController: ctrlWrapper(deleteContactController),
  createContactController: ctrlWrapper(createContactController),
  updateContactController: ctrlWrapper(updateContactController),
};
