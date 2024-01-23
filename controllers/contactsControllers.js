import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  refreshContact,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
      throw HttpError(404);
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteContact = await removeContact(id);
    if (!deleteContact) {
      throw HttpError(404);
    }
    res.json(deleteContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, `Contact with id=${contactId} not found`);
    }
    const newContact = await addContact(req.body);

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length > 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400);
    }
    const { id } = req.params;
    const updateContact = await refreshContact(id, req.body);
    if (!updateContact) {
      throw HttpError(404);
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
