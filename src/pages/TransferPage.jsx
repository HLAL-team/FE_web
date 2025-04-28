import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ModalTransferSuccess from "../components/ModalTransferSuccess";
import FavoriteAccountList from "../components/FavoriteAccount";
import {
  blockInvalidChar,
  currencyFormatter,
  inputCurrencyFormatter,
} from "../helper/helper";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";

const TransferPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amountInput, setAmountInput] = useState("");
  const [rawAmountInput, setRawAmountInput] = useState(0);
  const [notesInput, setNotesInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [transferData, setTransferData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setAccounts(data.accounts || []); 
        setBalance(data.balance); 
        if (data.accounts && data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]); 
        }
      } catch (err) {
        alert(err.message);
      }
    };

    fetchProfile();
  }, []); 

  const handleAmountInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = parseInt(rawValue, 10) || 0;

    if (numericValue <= balance) {
      setAmountInput(inputCurrencyFormatter.format(numericValue));
      setRawAmountInput(numericValue);
    }

    if (numericValue <= 0) {
      setAmountInput("");
      setRawAmountInput(0);
    }
  };

  const handleSelectAccount = (accountNumber) => {
    const account = accounts.find((acc) => acc.accountNo === accountNumber);
    if (account) {
      setSelectedAccount(account);
    } else {
      setSelectedAccount({ accountNo: accountNumber, accountName: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rawAmountInput <= 0 || rawAmountInput > balance) {
      alert("Jumlah transfer tidak valid");
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
      recipientWalletId: selectedAccount.walletId, 
      transactionTypeId: 2, 
      topUpMethodId: 1, 
      amount: rawAmountInput, 
      description: notesInput || "Transfer", 
      recipient: selectedAccount.accountName, 
      recipientAccountNumber: selectedAccount.accountNo,
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
        throw new Error("Transaksi gagal dibuat!");
      }

      const data = await response.json();
      setTransferData({
        namaPenerima: data.data.recipient,
        noRekening: selectedAccount.accountNo,
        jumlah: rawAmountInput,
        waktu,
        idTransaksi: data.data.transactionId, 
        catatan: notesInput,
      });

      setModalOpen(true); 

    } catch (err) {
      alert(err.message); 
    }
  };

  return (
    <Layout>
      <div className="dark:text-white">
        <Navbar />
        <h2 className="mt-10 pl-8 text-left text-3xl/9 font-bold tracking-tight">
          Transfer
        </h2>

        <div className="flex min-h-full flex-1 flex-row justify-center px-6 py-12 lg:px-8">
          <div className="mx-auto w-full max-w-lg">
            <div className="mt-6 mx-auto w-full max-w-lg shadow-md bg-red dark:bg-black p-14 rounded-3xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex bg-gray-50 dark:bg-gray-950 shadow-sm rounded-2xl pr-2">
                  <label className="py-3 px-8 rounded-2xl bg-gray-200 dark:bg-gray-800 font-bold text-lg flex items-center">
                    To
                  </label>

                  <div className="bg-gray-50 dark:bg-gray-950 shadow-sm rounded-2xl px-6 py-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={selectedAccount ? selectedAccount.accountNo : ""}
                      onChange={(e) => handleSelectAccount(e.target.value)}
                      placeholder="Masukkan nomor rekening"
                      className="w-full px-2 py-2 rounded-xl border dark:bg-black bg-white dark:border-white border-gray-300 focus:outline-none"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mx-1 text-left">
                      <span className="font-semibold">
                        {selectedAccount?.accountName || " "}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 px-6 py-3 rounded-2xl">
                  <label htmlFor="amount" className="block text-sm text-left font-semibold">
                    Amount
                  </label>
                  <div className="mt-2 relative bg-transparent">
                    <div className="absolute inset-y-0 left-0 flex items-center font-semibold text-3xl">
                      <p>IDR</p>
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
                        className="pl-14 text-3xl font-semibold block w-full bg-transparent px-3 py-1.5 border-b border-black dark:border-white focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 text-left">
                  <p>Balance:</p>
                  <p className="text-green-600">{`IDR ${currencyFormatter.format(balance)}`}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-950 px-6 rounded-2xl">
                  <div className="mt-2 relative bg-transparent">
                    <div className="absolute inset-y-0 left-0 flex items-center font-semibold text-3xl">
                      <label className="text-sm text-left font-semibold" htmlFor="notes">
                        Notes:
                      </label>
                    </div>
                    <div>
                      <input
                        id="notes"
                        name="notes"
                        type="text"
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        className="pl-14 text-sm block w-full bg-transparent px-3 py-1.5  focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-xl bg-primary px-3 py-1.5 text- font-semibold text-white dark:text-black drop-shadow-xl hover:drop-shadow-none hover:shadow-inner"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </div>

            <ModalTransferSuccess
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                navigate("/"); 
              }}
              transferData={transferData}
            />
          </div>

          <div className="mt-6 mx-auto w-full max-w-lg shadow-md bg-white dark:bg-black p-14 rounded-3xl">
            <FavoriteAccountList onSelectAccount={handleSelectAccount} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransferPage;
