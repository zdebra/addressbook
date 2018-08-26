class Contact {
    constructor(id, userId, name, address, phone) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.address = address;
        this.phone = phone;
    }

    isValid() {
        if (!this.id || !this.userId) {
            return false;
        }
        return true;
    }

    get short() {
        return {
            id: this.id,
            userId: this.userId,
            name: this.name,
            address: this.address,
            phone: this.phone
        }
    }
}

module.exports = Contact;