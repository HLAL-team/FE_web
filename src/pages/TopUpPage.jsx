import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  blockInvalidChar,
  currencyFormatter,
  inputCurrencyFormatter,
} from "../helper/helper";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";

const TopUpPage = () => {
  const sources = ["Credit Card", "Bank Transfer"];

  const [selectedSource, setSelectedSource] = useState(sources[0]);

  const [amountInput, setAmountInput] = useState("");
  const [rawAmountInput, setRawAmountInput] = useState(0);

  const handleAmountInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = parseInt(rawValue, 10) || 0;

    setAmountInput(inputCurrencyFormatter.format(numericValue));
    setRawAmountInput(numericValue);

    if (numericValue <= 0) {
      setAmountInput("");
      setRawAmountInput(0);
    }
  };

  const [notesInput, setNotesInput] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Sukses top up sebesar Rp${currencyFormatter.format(
        rawAmountInput
      )} dari ${selectedSource} \nNotes: ${notesInput}`
    );

    navigate("/");
  };

  return (
    <Layout>
    <div className="dark:text-white">
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-lg">
          <h2 className="mt-10 text-left text-2xl/9 font-bold tracking-tight">
            Top Up
          </h2>
        </div>

        <div className="mt-6 mx-auto w-full max-w-lg shadow-md bg-white dark:bg-black p-14 rounded-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-gray-50 dark:bg-gray-950 px-6 py-3 rounded-2xl">
              <label
                htmlFor="amount"
                className="block text-sm text-left font-semibold"
              >
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

            <div className="flex bg-gray-50 dark:bg-gray-950 shadow-sm rounded-2xl pr-2">
              <label className="py-3 px-8 rounded-2xl bg-gray-200 dark:bg-gray-800 font-bold">
                From
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="pl-1 bg-gray-50 dark:bg-gray-950 rounded-r-2xl text-sm w-full focus-visible:outline-none"
              >
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 dark:bg-gray-950 px-6 rounded-2xl">
              <div className="mt-2 relative bg-transparent">
                <div className="absolute inset-y-0 left-0 flex items-center font-semibold text-3xl">
                  <label
                    className="text-sm text-left font-semibold"
                    htmlFor="notes"
                  >
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
                Top Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default TopUpPage;
