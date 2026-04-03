export interface AdminUser {
    _id: string;
    nama: string;
    email: string;
    kelas: string;
    usia: number;
    createdAt: string;
}

export interface Statistics {
    counts: {
        totalUsers: number;
        totalAdmins: number;
        totalMaterials: number;
        totalQuizzes: number;
        totalAttempts: number;
    };
    averageScore: number;
    recentResults: Array<{
        _id: string;
        skor: number;
        tanggal_selesai: string;
        user_id: { nama: string; email: string; kelas: string };
        kuis_id: { judul: string; tipe: string };
    }>;
    recentUsers: Array<{
        _id: string;
        nama: string;
        email: string;
        kelas: string;
        createdAt: string;
    }>;
}
