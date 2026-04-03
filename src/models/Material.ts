import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMaterial extends Document {
    _id: mongoose.Types.ObjectId;
    judul: string;
    konten_teks: string;
    url_gambar: string;
    tanggal_upload: Date;
}

const materialSchema = new Schema<IMaterial>({
    judul: {
        type: String,
        required: [true, 'Judul materi wajib diisi'],
        trim: true,
    },
    konten_teks: {
        type: String,
        required: [true, 'Konten teks wajib diisi'],
    },
    url_gambar: {
        type: String,
        default: 'no-photo.jpg',
    },
    tanggal_upload: {
        type: Date,
        default: Date.now,
    },
});

const Material: Model<IMaterial> = mongoose.models.Material || mongoose.model<IMaterial>('Material', materialSchema);

export default Material;
