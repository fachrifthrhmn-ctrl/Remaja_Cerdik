import * as XLSX from 'xlsx';

export function downloadReportsExcel(data: any[], filename: string = 'Laporan_Kuis_RemajaCerdik.xlsx') {
    // LANGKAH 1: Kumpulkan SEMUA pertanyaan unik dari seluruh data siswa
    // Ini mencegah masalah kolom terpotong jika siswa urutan pertama tidak menjawab semua soal.
    const allQuestionsMap = new Map<string, string>();
    
    data.forEach(item => {
        if (item.detail_jawaban_user && Array.isArray(item.detail_jawaban_user)) {
            item.detail_jawaban_user.forEach((detail: any) => {
                if (detail.soal_id && detail.soal_id._id && detail.soal_id.pertanyaan) {
                    allQuestionsMap.set(detail.soal_id._id.toString(), detail.soal_id.pertanyaan);
                }
            });
        }
    });

    // Buat array pertanyaan yang konsisten untuk digunakan sebagai header
    const uniqueQuestions = Array.from(allQuestionsMap.entries());

    // LANGKAH 2: Format data menjadi baris Excel
    const formattedData = data.map((item) => {
        // Kolom Statis
        const row: Record<string, any> = {
            'Timestamp': item.tanggal_selesai 
                ? new Date(item.tanggal_selesai).toLocaleString('en-US', { hour12: false }).replace(',', '')
                : '-',
            'Email Address': item.user_id?.email || '-',
            'Nama': item.user_id?.nama || '-',
            'Usia': item.user_id?.usia || '-',
            'Jenis Kelamin': item.user_id?.jenis_kelamin || '-',
            'Kelas': item.user_id?.kelas || '-',
            'Judul Kuis': item.kuis_id?.judul || '-',
            'Tipe': item.kuis_id?.tipe || '-',
            'Skor': item.skor !== undefined ? Math.round(item.skor) : '-'
        };

        // Buat map jawaban khusus untuk siswa ini agar pencariannya cepat
        const userAnswers: Record<string, any> = {};
        if (item.detail_jawaban_user && Array.isArray(item.detail_jawaban_user)) {
            item.detail_jawaban_user.forEach((detail: any) => {
                if (detail.soal_id && detail.soal_id._id) {
                    userAnswers[detail.soal_id._id.toString()] = detail;
                }
            });
        }

        // Loop melalui SEMUA pertanyaan unik dan isi jawabannya
        uniqueQuestions.forEach(([qId, qText], index) => {
            const questionHeader = `${index + 1}. ${qText}`;
            let answerText = '-'; // Default jika siswa tidak menjawab soal ini

            const detail = userAnswers[qId];
            if (detail) {
                // BUG FIX: Cek secara eksplisit menggunakan !== undefined dan !== null
                // Sebelumnya "if (pilihanGanda[detail.jawaban_user])" menyebabkan angka 0 (opsi A) dianggap falsy
                if (detail.jawaban_user !== undefined && detail.jawaban_user !== null && detail.soal_id?.pilihan_ganda) {
                    const pilihanGanda = detail.soal_id.pilihan_ganda;
                    if (pilihanGanda[detail.jawaban_user] !== undefined) {
                        answerText = pilihanGanda[detail.jawaban_user];
                    }
                }
            }
            row[questionHeader] = answerText;
        });

        return row;
    });

    // 3. Buat worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 4. Buat workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Kuis');

    // 5. Download file
    XLSX.writeFile(workbook, filename);
}
