import mongoose from 'mongoose';

const url = 'mongodb+srv://ievents:Fr7vFnlsQdSFIbCA@cluster0.ga88x.mongodb.net/test';
const connection = mongoose
    .connect(url)
    .then(() => {
        console.log(`DB::connected`);
    })
    .catch((e) => {
        console.log(`DB::disconnected`);
    });
export default connection;
