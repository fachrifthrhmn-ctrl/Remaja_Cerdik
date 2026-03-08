export interface ReportResult {
    _id: string;
    skor: number;
    tanggal_selesai: string;
    user_id: { _id: string; nama: string; email: string; sekolah: string };
    kuis_id: { judul: string; tipe: string };
}

export interface HistoryItem {
    _id: string;
    skor: number;
    tanggal_selesai: string;
    kuis_id: { judul: string; tipe: string };
}
