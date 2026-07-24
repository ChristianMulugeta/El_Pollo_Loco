let contacts = [ // JSON = Javascript Object Notation
    new Contact('Max', 'Mustermann', '076 812 34 56'),
    new Friend('Jude', 'Bellingham')
];

function addContact(fn, ln) {
    let myContact = new Contact(fn, ln);
    contacts.push(myContact);
};

addContact("Chris", "Brown","076 812 34 56");
addContact("Leo", "Messi","076 812 34 56");
addContact("Neymar", "Junior","076 812 34 56");