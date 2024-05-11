const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Create phone
exports.create = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const { name, number } = req.body;

    const contact = await Contacts.findByPk(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }

    const phone = await Phones.create({ name, number, contactId });

    res.status(201).send(phone); // Return the created phone number
  } catch (err) {
    console.error("Error creating phone number:", err);
    res.status(500).send({ message: "An error occurred while creating the phone number." });
  }
};


// Get all phones
exports.findAll = async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const contact = await Contacts.findByPk(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }

    const phones = await Phones.findAll({ where: { contactId } });

    res.status(200).send(phones); 
  } catch (err) {
    console.error("Error retrieving phone numbers:", err);
    res.status(500).send({ message: "An error occurred while retrieving phone numbers." });
  }
};


// Get one phone by id
exports.findOne = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const phoneId = req.params.phoneId;

    const contact = await Contacts.findByPk(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }

    const phone = await Phones.findOne({ where: { id: phoneId, contactId } });

    if (!phone) {
      return res.status(404).send({ message: "Phone number not found." });
    }

    res.status(200).send(phone); 
  } catch (err) {
    console.error("Error retrieving phone number:", err);
    res.status(500).send({ message: "An error occurred while retrieving the phone number." });
  }
};


// Update one phone by id
exports.update = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const phoneId = req.params.phoneId;
    const { name, number } = req.body;

    const contact = await Contacts.findByPk(contactId);

    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }

    const phone = await Phones.findOne({ where: { id: phoneId, contactId } });

    if (!phone) {
      return res.status(404).send({ message: "Phone number not found." });
    }

    phone.name = name; // Update other attributes as needed
    phone.number = number;

    await phone.save();

    res.status(200).send(phone); // Return the updated phone number
  } catch (err) {
    console.error("Error updating phone number:", err);
    res.status(500).send({ message: "An error occurred while updating the phone number." });
  }
};


// Delete one phone by id
exports.delete = async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const phoneId = req.params.phoneId;
    const contact = await Contacts.findByPk(contactId);
    if (!contact) {
      return res.status(404).send({ message: "Contact not found." });
    }
    const phone = await Phones.findOne({ where: { id: phoneId, contactId } });
    if (!phone) {
      return res.status(404).send({ message: "Phone number not found." });
    }
    await phone.destroy();
    res.status(204).send(); // Return a 204 No Content response upon successful deletion
  } catch (err) {
    console.error("Error deleting phone number:", err);
    res.status(500).send({ message: "An error occurred while deleting the phone number." });
  }
};
