import mongoose from 'mongoose';

export async function startConnection() {
  const url = encodeURI(process.env.MONGO_URI);
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function closeConnection() {
  await mongoose.disconnect();
}
