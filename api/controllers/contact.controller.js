const db = require("../models");
const Contacts = db.contacts;
const Phones = db.phones;
const Op = db.Sequelize.Op;

// Create contact
exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const contact = await Contacts.create({ name });
    res.status(201).send(contact); 
  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).send({ message: "An error occurred while creating the contact." });
  }
};

// Get all contacts
exports.findAll = async (req, res) => {
  try {
    const contacts = await Contacts.findAll();

    res.status(200).send(contacts);
  } catch (err) {
    console.error("Error retrieving contacts:", err);
    res.status(500).send({ message: "An error occurred while retrieving contacts." });
  }
};

// Get one contact by id doubt
exports.findOne = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const contact = await Contacts.findByPk(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }

    res.status(200).send(contact); 
  } catch (err) {
    console.error("Error retrieving contact:", err);
    res.status(500).send({ message: "An error occurred while retrieving the contact." });
  }
};


// Update one contact by id
exports.update = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const { name } = req.body;

    const contact = await Contacts.findByPk(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }
    contact.name = name; 
    await contact.save();
    res.status(200).send(contact);
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).send({ message: "An error occurred while updating the contact." });
  }
};


// Delete one contact by id
exports.delete = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const transaction = await db.sequelize.transaction();

    const contact = await Contacts.findByPk(contactId, { transaction });

    if (!contact) {
      await transaction.rollback(); 
      return res.status(404).send({ message: "Contact not found." });
    }

    await Phones.destroy({
      where: { contactId },
      transaction,
    });

    await contact.destroy({ transaction });

    await transaction.commit();

    res.status(204).send(); 
  } catch (err) {
    console.error("Error deleting contact and phone numbers:", err);

    if (transaction) {
      await transaction.rollback(); 
    }

    res.status(500).send({ message: "An error occurred while deleting the contact and phone numbers." });
  }
};

 
