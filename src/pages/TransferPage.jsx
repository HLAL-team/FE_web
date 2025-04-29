import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ModalTransferSuccess from "../components/ModalTransferSuccess";
import FavoriteAccountList from "../components/FavoriteAccount";
import { blockInvalidChar, currencyFormatter, inputCurrencyFormatter } from "../helper/helper";
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
  const [accountCheckResult, setAccountCheckResult] = useState(null);
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [favoriteAccounts, setFavoriteAccounts] = useState([]);


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
    setSelectedAccount({ accountNo: accountNumber, accountName: "" });
    setAccountCheckResult(null);
    setIsFavorite(false);
    setFavoriteId(null);
  };

  const handleCheckAccount = async () => {
    const accountNo = selectedAccount?.accountNo?.toString().trim();

    if (!accountNo) {
      setSelectedAccount((prev) => ({ ...prev, accountName: "" }));
      setAccountCheckResult(null);
      setIsFavorite(false);
      setFavoriteId(null);
      alert("Masukkan nomor rekening terlebih dahulu.");
      return;
    }

    setIsCheckingAccount(true);
    try {
      const response = await fetch("http://localhost:8080/api/transactions/checking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ recipientAccountNumber: accountNo }),
      });

      if (!response.ok) {
        throw new Error("Gagal cek rekening");
      }

      const data = await response.json();

      if (!data.status || data.data.status !== "Success") {
        throw new Error("Rekening tidak ditemukan");
      }

      setSelectedAccount((prev) => ({
        ...prev,
        accountName: data.data.recipientName,
      }));

      setAccountCheckResult(data.data.recipientName);

      const favRes = await fetch("http://localhost:8080/api/transactions/favorite", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const favData = await favRes.json();
      const foundFavorite = favData.data.find((fav) => fav.accountNumber === accountNo);

      if (foundFavorite) {
        setIsFavorite(true);
        setFavoriteId(foundFavorite.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }

    } catch (err) {
      setAccountCheckResult(null);
      setIsFavorite(false);
      setFavoriteId(null);
      alert(err.message);
    } finally {
      setIsCheckingAccount(false);
    }
  };

  const handleAddFavorite = async () => {
    const accountNo = selectedAccount?.accountNo?.toString();
    if (!accountNo) {
      alert("Nomor rekening tidak valid!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/transactions/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          favoriteAccountNumber: accountNo,
        }),
      });
  
      const data = await response.json();
      if (data.status && data.data) {
        setIsFavorite(true);
        setFavoriteId(data.data.id);
        setFavoriteAccounts((prev) => [...prev, data.data]); 
      } else {
        alert("Gagal menambahkan ke favorit");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    }
  };
  
  

  const handleRemoveFavorite = async () => {
    const accountNo = selectedAccount?.accountNo?.toString();
    if (!accountNo) return;
  
    setIsFavoriteLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/transactions/favorite?favoriteAccountNumber=${accountNo}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Gagal menghapus favorite");
      }
  
      setIsFavorite(false);
      setFavoriteId(null);
      setFavoriteAccounts((prev) => prev.filter((fav) => fav.accountNumber !== accountNo));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rawAmountInput <= 0 || rawAmountInput > balance) {
      alert("Jumlah transfer tidak valid");
      return;
    }

    const now = new Date();
    const tanggal = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const jam = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
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
            <div className="mt-6 mx-auto w-full max-w-lg shadow-md bg-white dark:bg-black p-14 rounded-3xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex bg-gray-50 dark:bg-gray-950 shadow-sm rounded-2xl pr-2">
                  <label className="py-3 px-8 rounded-2xl bg-gray-200 dark:bg-gray-800 font-bold text-lg flex items-center">
                    To
                  </label>

                  <div className="flex-1 bg-gray-50 dark:bg-gray-950 shadow-sm rounded-2xl px-6 py-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={selectedAccount ? selectedAccount.accountNo : ""}
                        onChange={(e) => handleSelectAccount(e.target.value)}
                        placeholder="Masukkan nomor rekening"
                        className="w-full px-2 py-2 rounded-xl border dark:bg-black bg-white dark:border-white border-gray-300 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCheckAccount}
                        disabled={isCheckingAccount}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCheckingAccount ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Check"
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 px-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {accountCheckResult ? accountCheckResult : " "}
                      </span>
                      {accountCheckResult && (
                        <button
                          type="button"
                          onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
                          disabled={isFavoriteLoading}
                          className="text-yellow-500 hover:text-yellow-600 text-xl transition duration-200 ease-in-out"
                          title={isFavorite ? "Remove from Favorite" : "Add to Favorite"}
                        >
                          {isFavoriteLoading ? (
                            <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            isFavorite ? "★" : "☆"
                          )}
                        </button>
                      )}
                    </div>
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
                        className="pl-14 text-3xl font-semibold block w-full bg-transparent px-3 py-1.5 border-b border-black dark:border-white focus:outline-none"
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
                        className="pl-14 text-sm block w-full bg-transparent px-3 py-1.5 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-xl bg-primary px-3 py-1.5 font-semibold text-white dark:text-black drop-shadow-xl hover:drop-shadow-none hover:shadow-inner"
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
