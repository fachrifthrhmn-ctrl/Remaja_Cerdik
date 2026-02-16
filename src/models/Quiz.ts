import mongoose, { Schema, Document, Model } from 'mongoose';

export type QuizType = 'pre-test' | 'post-test';

export interface IQuiz extends Document {
    _id: mongoose.Types.ObjectId;
    judul: string;
    tipe: QuizType;
    deskripsi: string;
    createdAt: Date;
}

const quizSchema = new Schema<IQuiz>({
    judul: {
        type: String,
        required: [true, 'Judul kuis wajib diisi'],
        trim: true,
    },
    tipe: {
        type: String,
        required: [true, 'Tipe kuis wajib diisi'],
        enum: ['pre-test', 'post-test'],
    },
    deskripsi: {
        type: String,
        required: [true, 'Deskripsi kuis wajib diisi'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', quizSchema);

export default Quiz;
