import fs from "node:fs/promises";
import path from "node:path";
import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const avatarsDir = path.resolve("public", "avatars");

const getContactsController = async (req, res) => {
  const { id: owner } = req.user;
  const contacts = await contactsService.listContacts({ owner });
  res.status(200).json(contacts);
};

const getOneContactController = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await contactsService.getContact({ id, owner });

  if (!contact) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(contact);
};

const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await contactsService.removeContact({ id, owner });

  if (!contact) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }

  res.status(200).json(contact);
};

const createContactController = async (req, res) => {
  let avatar = null;
  if (req.file) {
    const { path: tempPath, filename } = req.file;
    const newPath = path.join(avatarsDir, filename);
    await fs.rename(tempPath, newPath);
    avatar = path.join("avatars", filename);
  }
  const { id: owner } = req.user;
  const data = await contactsService.addContactById({
    ...req.body,
    avatar,
    owner,
  });
  res.status(201).json(data);
};

const updateContactController = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await contactsService.updateContact({ id, owner }, req.body);

  if (!contact) {
    throw HttpError(404, `Contact with id ${id} not found`);
  }
  res.status(200).json(contact);
};

const updateFavoriteController = async (req, res) => {
  const { contactId } = req.params;
  const { id: owner } = req.user;
  const { favorite } = req.body;

  if (!favorite) {
    throw HttpError(400, "missing field favorite");
  }

  const contact = await contactsService.updateContact(
    { id: contactId, owner },
    { favorite }
  );

  if (!contact) {
    throw HttpError(404, `Contact with id ${contactId} not found`);
  }
  res.status(200).json(contact);
};

export default {
  getContactsController: ctrlWrapper(getContactsController),
  getOneContactController: ctrlWrapper(getOneContactController),
  deleteContactController: ctrlWrapper(deleteContactController),
  createContactController: ctrlWrapper(createContactController),
  updateContactController: ctrlWrapper(updateContactController),
  updateFavoriteController: ctrlWrapper(updateFavoriteController),
};
