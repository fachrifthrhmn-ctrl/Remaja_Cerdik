import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo extends Document {
    _id: mongoose.Types.ObjectId;
    judul: string;
    url_video: string;
    deskripsi: string;
    durasi: string;
    tanggal_upload: Date;
}

const videoSchema = new Schema<IVideo>({
    judul: {
        type: String,
        required: [true, 'Judul video wajib diisi'],
        trim: true,
    },
    url_video: {
        type: String,
        required: [true, 'URL video wajib diisi'],
    },
    deskripsi: {
        type: String,
        required: [true, 'Deskripsi video wajib diisi'],
    },
    durasi: {
        type: String,
        required: [true, 'Durasi video wajib diisi'],
    },
    tanggal_upload: {
        type: Date,
        default: Date.now,
    },
});

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', videoSchema);

export default Video;
