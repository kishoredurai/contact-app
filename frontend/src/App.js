import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
    const [contacts, setContacts] = useState([]);
    const [phones, setPhones] = useState([]);
    const [contact, setContact] = useState('');

    const [newContact, setNewContact] = useState({ name: '', number: '' });
    const [showAddFields, setShowAddFields] = useState(false);
    const [highlightedContactIndex, setHighlightedContactIndex] = useState(-1);

    const [showStatusCard, setShowStatusCard] = useState(false);
    const [stats, setStats] = useState({});

    
  
    const toggleStatusCard = () => {
      setShowStatusCard(!showStatusCard);
      fetchStats();
    };
  
    // Function to refresh the status card
    const refreshStatusCard = () => {
      fetchStats();
    };

    useEffect(() => {
        // Fetch contacts from the API and update the state
        fetchContacts();
    }, []); // This empty dependency array means this effect runs once after initial render

    const fetchContacts = () => {
        fetch('http://localhost:5001/api/contacts')
            .then((response) => response.json())
            .then((data) => {
                setContacts(data); // Update the state with fetched contacts
            })
            .catch((error) => {
                console.error('Error fetching contacts:', error);
            });
    };

    const fetchPhonenumber = (id) => {
        fetch(`http://localhost:5001/api/contacts/${id}/phones`)
            .then((response) => response.json())
            .then((data) => {
                setPhones(data); // Update the state with fetched contacts
            })
            .catch((error) => {
                console.error('Error fetching contacts:', error);
            });
    };

    const fetchStats = () => {

        fetch('http://localhost:5001/api/stats')
            .then((response) => response.json())
            .then((data) => {
                setStats(data); 
            })
            .catch((error) => {
                console.error('Error fetching contacts:', error);
            });
    };

    const handleNameChange = (e) => {
        setContact(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setNewContact({ ...newContact, number: e.target.value });
    };

    const handlePhoneNameChange = (e) => {
        setNewContact({ ...newContact, name: e.target.value });
    };

    const addContact = () => {
        // Prepare the contact data to send as JSON
        const contactData = {
            name: contact,
        };

        fetch('http://localhost:5001/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Handle the response from the server if needed
                console.log('Contact added:', data);

                fetchContacts();
            })
            .catch((error) => {
                // Handle errors, e.g., network errors or server errors
                console.error('Error:', error);
            });
    };


    const addPhone = (id) => {
        // Prepare the contact data to send as JSON
        const PhoneData = {
            name: newContact.name,
            number: newContact.number,
        };

        fetch(`http://localhost:5001/api/contacts/${id}/phones`, { // Replace :contactId with the actual contact ID
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(PhoneData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                // After successfully adding a contact, fetch the updated contacts list
                fetchPhonenumber(id);
            })
            .catch((error) => {
                console.error('Error adding contact:', error);
            });

    };


    const deleteContact = (contactId) => {
        fetch(`http://localhost:5001/api/contacts/${contactId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    // If the DELETE request is successful, remove the contact from the state.
                    const updatedContacts = contacts.filter((contact) => contact.id !== contactId);
                    setContacts(updatedContacts);
                } else {
                    // Handle errors here
                    console.error('Error deleting contact:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const deletePhone = (contactId,phoneId) => {
        fetch(`http://localhost:5001/api/contacts/${contactId}/phones/${phoneId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    // If the DELETE request is successful, remove the contact from the state.
                    const updatedPhone =phones.filter((phone) => phone.id !== phoneId);
                    setPhones(updatedPhone);
                } else {
                    // Handle errors here
                    console.error('Error deleting contact:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };



    const toggleHighlight = (index, id) => {
        if (index === highlightedContactIndex) {
            // Toggle off
            setHighlightedContactIndex(-1);
            setShowAddFields(false);

        } else {
            // Toggle on
            fetchPhonenumber(id)
            setShowAddFields(true);

            setHighlightedContactIndex(index);
        }
    };

    return (<>
    
        <div className='container'>
        <div className="main-card">
            <div className="custom-card"> {/* Use a custom CSS class */}
                <h1 className="custom-title">Contacts</h1> {/* Use custom CSS class for title */}
                <input
                    type="text"
                    placeholder="Enter a contact name"
                    value={contact}
                    onChange={handleNameChange}
                    className="custom-input" 
                />
                <button
                    onClick={addContact}
                    className="custom-button" 
                >
                    Add Contact
                </button>

                {contacts.length > 0 && (
                    <div className="mt-4">
                        <h2 className="custom-subtitle">Contact List</h2> {/* Use custom CSS class for subtitle */}
                        <ul>
                            {contacts.map((contact, index) => (
                                <div key={index}>
                                    <li
                                        className={`custom-list-item ${index === highlightedContactIndex ? 'custom-highlighted' : ''}`}
                                    >
                                        <div>
                                            <span
                                                className={`custom-link ${showAddFields && index === highlightedContactIndex ? 'custom-highlighted-text' : ''}`}
                                                onClick={() => {
                                                    toggleHighlight(index, contact.id);
                                                }}
                                            >
                                                {contact.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteContact(contact.id)}
                                            className="custom-delete-button" 
                                        >
                                            Delete
                                        </button>
                                    </li>
                                    {showAddFields && highlightedContactIndex === index && (
                                        <div className="custom-add-fields">
                                            <div className="inner-custom-card">
                                                <div className="flex items-center space-x-2 p-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        onChange={handlePhoneNameChange}
                                                        className="custom-input" 
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Phone Number"
                                                        onChange={handlePhoneNumberChange}
                                                        className="custom-input" 
                                                    />
                                                    <button
                                                        onClick={() => addPhone(contact.id)}
                                                        className="custom-button" 
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                <div className="custom-table">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Phone Number</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        {phones.length > 0 && (
                                                            <tbody>
                                                                {phones.map((phone, index) => (
                                                                    <tr key={index}>
                                                                        <td>{phone.name}</td>
                                                                        <td>{phone.number}</td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() => deletePhone(contact.id, phone.id)}
                                                                                className="custom-delete-button" 
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        )}
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        <div >
            <button
                onClick={toggleStatusCard}
                className="status-button" 
            >
                {showStatusCard ? "Hide Status" : "Show Status"}
            </button>
        </div>

        <div id="status-card">
        {showStatusCard && stats &&(
        <div>
          <div className='status-table'>
            <h1 >Status</h1>
            <h4 >
              Number of Contacts: {stats.numberOfContacts}
            </h4>
       

            <h4 >
              Number of Phones: {stats.numberOfPhoneNumbers}
            </h4>
           
            <h4 >
              Newest Contact Timestamp: {stats.mostRecentContact}
            </h4>
           
            <h4 >
              Oldest Contact Timestamp: {stats.oldestContact}
            </h4 >
           
            <div >
          <button
            onClick={refreshStatusCard}
            
          >
            Refresh
          </button>
        </div>
          </div>
        </div>
      )}
        </div>
        
    </div>
   
    </>
    );
}

export default App;
