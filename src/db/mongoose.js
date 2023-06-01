const mongoose = require("mongoose")

const startServer = async (app, PORT, MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Connected to url")
        app.listen(PORT, () => {
            console.log(`connecting to port ${PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = startServer;