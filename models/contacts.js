const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {

  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);

  return contacts;
}



const getContactById = async (contactId) => {

  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);

  const findContact = contacts.find(({ id }) => id === contactId);

  return findContact ? findContact : null;

}



const removeContact = async (contactId) => {

  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);

  const findContact = contacts.find(({id}) =>  id === contactId );
   
  if (findContact) {

    const filterContact = contacts.filter(({id}) =>  id !== contactId );
    
    await fs.writeFile(contactsPath, JSON.stringify(filterContact))          
               
    return findContact;

  }else {
     
      return null;
    }

}

const addContact = async (body) => {

  const  {
    name,
    email,
    phone,
  } = body;

  body.id = uuidv4();
  

  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
    
  const findContact = contacts.find(contact =>  contact.name === name && contact.email === email && contact.phone === phone );

  if(findContact) { 
    return null;
    }

  contacts.push(body);
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return body;

}

const updateContact = async (contactId, body) => {

  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);

  const idx = contacts.findIndex(({id}) =>  id === contactId );

  if(idx === -1) return null;

  const newId = { id: contactId }
  contacts[idx] = {...newId, ...body};
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts[idx];
  
}



module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
