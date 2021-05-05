import mongoose from 'mongoose';

const url = 'mongodb+srv://user:1234567890@cluster0.ecduv.mongodb.net/test';
const connection = mongoose
    .connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log(`DB::connected`);
    })
    .catch((e) => {
        console.log(`DB::disconnected`);
    });
export default connection;
