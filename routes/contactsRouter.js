import express from "express";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getContactsController);

contactsRouter.get("/:id", contactsControllers.getOneContactController);

contactsRouter.delete("/:id", contactsControllers.deleteContactController);

contactsRouter.post(
  "/",
  upload.single("avatar"),
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.createContactController
);

contactsRouter.put(
  "/:id",
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContactController
);

contactsRouter.patch(
  "/:contactId/favorite",
  validateBody(updateContactSchema),
  contactsControllers.updateFavoriteController
);

export default contactsRouter;
