import mongoose from 'mongoose';

export default async function startConnection() {
  const url = encodeURI(process.env.MONGO_URI);
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
