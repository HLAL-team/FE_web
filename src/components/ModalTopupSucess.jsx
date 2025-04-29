import React from "react";
import success from "../assets/success.svg";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom"; // Jika menggunakan React Router

const ModalTopupSuccess = ({ isOpen, onClose, transferData }) => {
    const navigate = useNavigate();  // Pastikan hanya digunakan jika perlu routing

    if (!isOpen) return null;

    // Fungsi untuk mendownload PDF
    const downloadReceipt = (e) => {
        // Mencegah perilaku default dari event klik dan propagasi ke event lain
        e.preventDefault();
        e.stopPropagation();

        const doc = new jsPDF();

        // Menambahkan judul
        doc.setFontSize(18);
        doc.text("Top Up Successful!", 20, 20);

        // Menambahkan informasi transaksi
        doc.setFontSize(12);
        doc.text(`Amount: Rp ${Number(transferData.jumlah).toLocaleString("id-ID")}`, 20, 30);
        doc.text(`Transaction Id: ${transferData.idTransaksi}`, 20, 40);
        doc.text(`Time: ${transferData.waktu}`, 20, 50);
        doc.text(`Top Up Method: ${transferData.metode}`, 20, 60);
        doc.text(`Notes: ${transferData.catatan}`, 20, 70);

        // Menyimpan dan mendownload PDF
        doc.save("bukti_transfer.pdf");

        // Pastikan tidak ada navigasi atau perubahan halaman yang tidak sengaja
        // navigate("/dashboard"); // Pastikan tidak ada perintah navigasi yang mengarah ke halaman lain
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-16 max-w-md w-full relative animate-fade-in">
                {/* Tombol Close untuk menutup modal */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                >
                    &times;
                </button>

                {/* Gambar ikon sukses */}
                <div className="flex justify-center mb-4">
                    <img src={success} alt="Success Icon" className="w-20 h-20" />
                </div>

                {/* Judul Modal */}
                <h2 className="text-2xl font-semibold text-primary mb-4">
                    Top Up Successful!
                </h2>
                <br />

                {/* Informasi Transaksi */}
                <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        <span className="font-bold">
                            Rp {Number(transferData.jumlah).toLocaleString("id-ID")}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Transaction Id</span>
                        {transferData.idTransaksi}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Time</span>
                        {transferData.waktu}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Top Up Method</span>
                        {transferData.metode}
                    </p>

                    <p className="flex justify-between">
                        <span className="font-medium">Notes</span>
                        {transferData.catatan}
                    </p>
                </div>

                <br /> <br />

                {/* Tombol untuk Print dan Close */}
                <div className="mt-6 flex justify-center gap-x-4">
                    <button
                        type="button" // Pastikan type="button" agar tidak mengirimkan form secara tidak sengaja
                        onClick={(e) => downloadReceipt(e)}  // Panggil fungsi downloadReceipt
                        className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition"
                    >
                        Print
                    </button>

                    <button
                        onClick={onClose} // Menutup modal
                        className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTopupSuccess;
