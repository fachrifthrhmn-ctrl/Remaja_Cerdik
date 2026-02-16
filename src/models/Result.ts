import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswerDetail {
    soal_id: mongoose.Types.ObjectId;
    jawaban_user: number;
}

export interface IResult extends Document {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    kuis_id: mongoose.Types.ObjectId;
    skor: number;
    detail_jawaban_user: IAnswerDetail[];
    tanggal_selesai: Date;
}

const resultSchema = new Schema<IResult>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    kuis_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    skor: {
        type: Number,
        required: true,
    },
    detail_jawaban_user: [
        {
            soal_id: {
                type: Schema.Types.ObjectId,
                ref: 'Question',
            },
            jawaban_user: Number,
        },
    ],
    tanggal_selesai: {
        type: Date,
        default: Date.now,
    },
});

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', resultSchema);

export default Result;
