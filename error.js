class ExposedError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "ExposedError";
        this.status = status;
        this.expose = true;
    }
}

module.exports = ExposedError;