import * as XLSX from 'xlsx';

export function downloadReportsExcel(data: any[], filename: string = 'Laporan_Kuis_RemajaCerdik.xlsx') {
    // 1. Format the data to match Google Forms dump structure
    const formattedData = data.map((item) => {
        // Build the base row with static information
        const row: Record<string, any> = {
            'Timestamp': item.tanggal_selesai 
                ? new Date(item.tanggal_selesai).toLocaleString('en-US', { hour12: false }).replace(',', '')
                : '-',
            'Email Address': item.user_id?.email || '-',
            'Nama': item.user_id?.nama || '-',
            'Usia': item.user_id?.usia || '-',
            'Jenis Kelamin': item.user_id?.jenis_kelamin || '-',
            'Kelas': item.user_id?.kelas || '-',
        };

        // Dynamically add quiz questions and user's answers if detail_jawaban_user exists
        if (item.detail_jawaban_user && Array.isArray(item.detail_jawaban_user)) {
            item.detail_jawaban_user.forEach((detail: any, index: number) => {
                // Ensure soal_id (populated question) exists
                if (detail.soal_id && detail.soal_id.pertanyaan) {
                    // Create the header using the question number and text
                    const questionHeader = `${index + 1}. ${detail.soal_id.pertanyaan}`;
                    
                    // Retrieve the string text of the answer based on user's chosen index
                    let answerText = '-';
                    if (detail.jawaban_user !== undefined && detail.soal_id.pilihan_ganda) {
                         const pilihanGanda = detail.soal_id.pilihan_ganda;
                         if (pilihanGanda[detail.jawaban_user]) {
                             answerText = pilihanGanda[detail.jawaban_user];
                         }
                    }
                    
                    row[questionHeader] = answerText;
                }
            });
        }

        return row;
    });

    // 2. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // 3. Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Kuis');

    // 4. Download file
    XLSX.writeFile(workbook, filename);
}
