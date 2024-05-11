const db = require("../models");
const Phones = db.phones;
const Contacts = db.contacts;
const Op = db.Sequelize.Op;

// Calculate stats
exports.calculate = async (req, res) => {
  try {
    // Calculate the number of contacts in the database
    const numberOfContacts = await Contacts.count();

    // Calculate the number of phone numbers in the database
    const numberOfPhoneNumbers = await Phones.count();

    // Find the most recently created contact
    const mostRecentContact = await Contacts.findOne({
      order: [['createdAt', 'DESC']],
    });

    // Find the oldest contact created
    const oldestContact = await Contacts.findOne({
      order: [['createdAt', 'ASC']],
    });

    // Create the JSON response object
    const stats = {
      numberOfContacts,
      numberOfPhoneNumbers,
      mostRecentContact: mostRecentContact ? mostRecentContact.createdAt : null,
      oldestContact: oldestContact ? oldestContact.createdAt : null,
    };

    // Send the response as JSON
    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Internal Server Errorss' });
  }
};
