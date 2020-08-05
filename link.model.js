import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const urlSchema = new Schema({
 original_url: String,
 short_url: String
})
const UR = mongoose.model('URL', urlSchema);

export default URL;