import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const dbConfig = {
      USER: process.env.DB_USER,
      PASSWORD: process.env.DB_PASSWORD,
      CLUSTER: process.env.DB_CLUSTER,
      TLD: process.env.DB_TLD,
      DB: process.env.DB_NAME,
    };

    const uri = `mongodb+srv://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.CLUSTER}.${dbConfig.TLD}.mongodb.net/${dbConfig.DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri, {
      dbName: dbConfig.DB,
    } as mongoose.ConnectOptions);

    console.log('✅ Connected to MongoDB!');

    // Create a simple test schema
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });

    const TestModel = mongoose.model('TestCollection', TestSchema);

    console.log('Creating a test document...');
    const doc = new TestModel({ name: 'Connection Test' });
    await doc.save();
    console.log('✅ Document created successfully:', doc.id);

    console.log('Fetching documents...');
    const docs = await TestModel.find();
    console.log(`✅ Found ${docs.length} document(s) in TestCollection.`);

    console.log('Cleaning up...');
    await TestModel.deleteMany({ name: 'Connection Test' });
    console.log('✅ Cleanup successful.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB or creating collections:', error);
  }
};

testDB();
