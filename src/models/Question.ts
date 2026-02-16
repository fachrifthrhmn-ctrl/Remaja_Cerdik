import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
    _id: mongoose.Types.ObjectId;
    kuis_id: mongoose.Types.ObjectId;
    pertanyaan: string;
    pilihan_ganda: string[];
    kunci_jawaban: number;
}

const questionSchema = new Schema<IQuestion>({
    kuis_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    pertanyaan: {
        type: String,
        required: [true, 'Pertanyaan wajib diisi'],
    },
    pilihan_ganda: {
        type: [String],
        required: [true, 'Pilihan ganda wajib diisi minimal 2 opsi'],
        validate: {
            validator: function (v: string[]) {
                return v.length >= 2;
            },
            message: 'Minimal harus ada 2 pilihan jawaban',
        },
    },
    kunci_jawaban: {
        type: Number,
        required: [true, 'Kunci jawaban wajib diisi (index 0-based)'],
        min: [0, 'Kunci jawaban tidak boleh negatif'],
        max: [3, 'Kunci jawaban harus antara 0-3 (4 pilihan)'],
    },
});

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
