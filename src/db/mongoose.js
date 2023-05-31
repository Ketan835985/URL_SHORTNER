const mongoose  = require("mongoose")

const startServer = async(app, PORT, URI) => {
    try {
        await mongoose.connect(URI)
         console.log("Connected to url")
         app.listen(PORT, () => {
             console.log(`connecting to port ${PORT}`)
         })
     } catch (error) {
         console.log(error);
     }
}

module.exports = startServer;