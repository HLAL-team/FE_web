import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  blockInvalidChar,
  currencyFormatter,
  inputCurrencyFormatter,
} from "../helper/helper";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import ModalTopupSuccess from "../components/ModalTopupSucess";

const TopUpPage = () => {
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [rawAmountInput, setRawAmountInput] = useState(0);
  const [notesInput, setNotesInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const getTopUpMethodName = (id) => {
    const method = transactionTypes.find((item) => item.id === parseInt(id));
    return method ? method.name : "Unknown Method";
  };

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setErrorMessage("Token tidak ditemukan. Silakan login kembali.");
          return;
        }

        const response = await fetch("http://localhost:8080/api/transactions/topupmethod", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setErrorMessage("Unauthorized. Silakan login kembali.");
            return;
          }
          setErrorMessage("Gagal mengambil data jenis transaksi.");
          return;
        }

        const responseData = await response.json();
        if (Array.isArray(responseData.data)) {
          setTransactionTypes(responseData.data);
          setSelectedSource(responseData.data[0]?.id || "");
        } else {
          throw new Error("Data transaksi tidak valid.");
        }
      } catch (err) {
        setErrorMessage(`Error: ${err.message}`);
      }
    };

    fetchTransactionTypes();
  }, []);

  const handleAmountInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = parseInt(rawValue, 10) || 0;

    if (numericValue <= 0) {
      setAmountInput("");
      setRawAmountInput(0);
      return;
    }

    setAmountInput(inputCurrencyFormatter.format(numericValue));
    setRawAmountInput(numericValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rawAmountInput <= 0) {
      alert("Harap masukkan jumlah yang valid untuk top-up.");
      return;
    }

    const now = new Date();
    const tanggal = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const jam = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const waktu = `${tanggal} ${jam}`;

    const transactionData = {
      transactionTypeId: 1,
      amount: rawAmountInput,
      description: notesInput || "Tidak ada catatan",
      topUpMethodId: selectedSource,
    };

    try {
      const response = await fetch("http://localhost:8080/api/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gagal top-up: ${errorData.message || "Terjadi kesalahan pada server"}`);
      }

      const data = await response.json();

      setTransferData({
        metode: getTopUpMethodName(selectedSource),
        jumlah: rawAmountInput,
        waktu,
        idTransaksi: data.data.transactionId,
        catatan: notesInput,
      });

      setModalOpen(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Layout>
      <div className="dark:text-white">
        <Navbar />
        <h2 className="mx-8 text-4xl text-left font-bold">Top Up</h2>

        <div className="flex min-h-full flex-1 flex-col justify-center px-6 mb-6 lg:px-8">
          
          

          <div className="mt-6 mx-auto w-full max-w-lg shadow-md bg-white dark:bg-black p-14 rounded-3xl">

          <div className="flex bg-gray-50 dark:bg-gray-950 shadow-sm ">
                <label className="py-3 px-4 rounded-xl bg-gray-200 dark:bg-gray-800 font-bold">
                  From
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="pl-1 bg-gray-50 dark:bg-gray-950 text-sm w-full focus-visible:outline-none"
                >
                  {Array.isArray(transactionTypes) && transactionTypes.length > 0 ? (
                    transactionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No transaction types available</option>
                  )}
                </select>
              </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="bg-gray-50 dark:bg-gray-950 py-4 rounded-2xl">
                <label htmlFor="amount" className="block text-sm text-left font-semibold">
                  Amount
                </label>
                <div className="mt-2 relative bg-transparent">
                  <div className="absolute inset-y-0 left-0 flex items-center font-semibold text-3xl">
                    <p>Rp</p>
                  </div>
                  <div>
                    <input
                      id="amount"
                      name="amount"
                      type="text"
                      value={amountInput}
                      onChange={handleAmountInputChange}
                      onKeyDown={blockInvalidChar}
                      required
                      className="pl-14 text-3xl font-semibold block w-full bg-transparent px-3 py-1.5 border-b border-black dark:border-white focus-visible:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
  <div className="flex flex-col gap-2">
    {[10000, 20000, 50000].map((val) => (
      <button
        key={val}
        type="button"
        onClick={() => {
          setAmountInput(inputCurrencyFormatter.format(val));
          setRawAmountInput(val);
        }}
        className="bg-gray-200 dark:bg-gray-800 text-sm py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        {inputCurrencyFormatter.format(val)}
      </button>
    ))}
  </div>
  <div className="flex flex-col gap-2">
    {[100000, 200000, 500000].map((val) => (
      <button
        key={val}
        type="button"
        onClick={() => {
          setAmountInput(inputCurrencyFormatter.format(val));
          setRawAmountInput(val);
        }}
        className="bg-gray-200 dark:bg-gray-800 text-sm py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        {inputCurrencyFormatter.format(val)}
      </button>
    ))}
  </div>
</div>


              <div className="bg-gray-50 dark:bg-gray-950  rounded-2xl text-left">
                  <label className="text-sm font-semibold" htmlFor="notes">
                    Notes
                  </label>
                  <div className="mt-2 relative bg-transparent">
                    <div>
                      <input
                        id="notes"
                        name="notes"
                        type="text"
                        placeholder="Optional"
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        className="text-sm block w-full bg-gray-100 px-3 py-4 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-xl bg-primary px-3 py-1.5 font-semibold text-white dark:text-black drop-shadow-xl hover:drop-shadow-none hover:shadow-inner"
                >
                  Top Up
                </button>
              </div>
            </form>
          </div>

          <ModalTopupSuccess
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              navigate("/");
            }}
            transferData={transferData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TopUpPage;
