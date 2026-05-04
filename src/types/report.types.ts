export interface ReportResult {
    _id: string;
    skor: number;
    tanggal_selesai: string;
    user_id: { _id: string; nama: string; email: string; kelas: string };
    kuis_id: { judul: string; tipe: string };
    detail_jawaban_user?: any[];
}

export interface HistoryItem {
    _id: string;
    skor: number;
    tanggal_selesai: string;
    kuis_id: { judul: string; tipe: string };
}
