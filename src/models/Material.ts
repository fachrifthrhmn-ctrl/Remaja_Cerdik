import mongoose, { Schema, Document, Model } from 'mongoose';

export type MaterialCategory = 'Diabetes' | 'Hipertensi' | 'Obesitas' | 'Jantung';

export interface IMaterial extends Document {
    _id: mongoose.Types.ObjectId;
    judul: string;
    kategori: MaterialCategory;
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
    kategori: {
        type: String,
        required: [true, 'Kategori wajib diisi'],
        enum: ['Diabetes', 'Hipertensi', 'Obesitas', 'Jantung'],
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
