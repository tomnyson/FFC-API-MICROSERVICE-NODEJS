const mongoose = require("mongoose");

const mongodbUrl = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.9bac1.mongodb.net/admin?retryWrites=true&w=majority`;

console.log("url", mongodbUrl);

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'ConnetFailed'));
connection.once('open', () => {
 console.log("MongoDB Connecting");
})

export default connection;