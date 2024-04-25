const mongoose = require('mongoose');

module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await mongoose.connect(process.env.DB, connectionParams);
    console.log('Connected to Mongo DB');
    console.log("");
  } catch (error) {
    console.log(error);
    console.log('Could not connect to Mongo DB');
  }
};
