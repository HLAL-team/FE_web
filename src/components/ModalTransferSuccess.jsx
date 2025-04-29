import React from "react";
import success from "../assets/success.svg";
import { jsPDF } from "jspdf";

const ModalTransferSuccess = ({ isOpen, onClose, transferData }) => {
    if (!isOpen) return null;

    // Fungsi untuk mendownload PDF
    const downloadReceipt = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Transfer Successful!", 20, 20);

        doc.setFontSize(12);
        doc.text(`Transaction ID: ${transferData.idTransaksi}`, 20, 40);
        doc.text(`Recipient Name: ${transferData.namaPenerima}`, 20, 50);
        doc.text(`Account Number: ${transferData.noRekening}`, 20, 60);
        doc.text(`Amount: Rp ${Number(transferData.jumlah).toLocaleString("id-ID")}`, 20, 70);
        doc.text(`Time: ${transferData.waktu}`, 20, 80);
        doc.text(`Notes: ${transferData.catatan || '-'}`, 20, 90);

        doc.save("bukti_transfer.pdf");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-16 max-w-md w-full relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                >
                    &times;
                </button>

                <div className="flex justify-center mb-4">
                    <img src={success} alt="Success Icon" className="w-20 h-20" />
                </div>

                <h2 className="text-2xl font-semibold text-primary mb-4">
                    Transfer Successful!
                </h2>

                <br />

                <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex justify-between">
                        <span className="font-medium">Transaction ID:</span>
                        {transferData.idTransaksi}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Recipient Name:</span>
                        {transferData.namaPenerima}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Account Number:</span>
                        {transferData.noRekening}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Amount:</span>
                        Rp {Number(transferData.jumlah).toLocaleString("id-ID")}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Time:</span>
                        {transferData.waktu}
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Notes:</span>
                        {transferData.catatan}
                    </p>
                </div>

                <br /> <br />

                <div className="mt-6 flex justify-center gap-x-4">
                    <button
                        type="button"
                        onClick={downloadReceipt}
                        className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition"
                    >
                        Print
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalTransferSuccess;
