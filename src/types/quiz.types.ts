export interface Quiz {
    _id: string;
    judul: string;
    tipe: string;
    deskripsi: string;
}

export interface Question {
    _id: string;
    pertanyaan: string;
    pilihan_ganda: string[];
    kunci_jawaban: number;
}

export interface QuizStatus {
    quizId: string;
    judul: string;
    tipe: string;
    isCompleted: boolean;
    score: number | null;
}

export interface CompletionData {
    quizStatus: QuizStatus[];
    hasCompletedPretest: boolean;
    canTakePosttest: boolean;
}

export interface SubmitResult {
    message: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    resultId: string;
}
