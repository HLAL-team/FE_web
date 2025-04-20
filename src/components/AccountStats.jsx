import { Eye, EyeOff, Plus, Send } from "lucide-react";
import { currencyFormatter } from "../helper/helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AccountStats = () => {
  const [account, setAccount] = useState({});

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("http://localhost:3000/balance");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setAccount(data);
        console.log(account);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div className="flex gap-12 px-6 sm:px-4 lg:px-8 mb-9 dark:text-white">
      <AccountInfo accountNo={account.accountNo} />
      <BalanceInfo balance={currencyFormatter.format(account.amount)} />
    </div>
  );
};

const AccountInfo = ({ accountNo }) => {
  return (
    <div className="flex items-center justify-center h-56 w-72 bg-primary text-white rounded-3xl p-6">
      <div>
        <h4 className="font-normal text-xl">Account No</h4>
        <p className="font-bold text-xl">{accountNo}</p>
      </div>
    </div>
  );
};

const BalanceInfo = ({ balance }) => {
  const navigate = useNavigate();
  const [isEyeActive, setIsEyeActive] = useState(false);

  const handleEye = () => {
    setIsEyeActive((currentState) => !currentState);
  };

  return (
    <div className="flex-1 text-left items-center bg-white dark:bg-black rounded-3xl p-6  w-full h-56">
      <div className="flex flex-col justify-center h-full">
        <h4 className="text-2xl font-normal">Balance</h4>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center min-w-96 justify-between">
              <p className="text-3xl font-semibold">
                Rp{isEyeActive ? balance : "*********"}
              </p>
              <button onClick={handleEye}>
                {isEyeActive ? (
                  <Eye
                    className="text-gray-400 hover:text-blue-400"
                    size={36}
                  />
                ) : (
                  <EyeOff
                    className="text-gray-400 hover:text-blue-400"
                    size={36}
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="p-1 bg-teal-600 text-white dark:text-black rounded-xl"
              onClick={() => navigate("topup")}
            >
              <Plus size={32} />
            </button>
            <button
              className="p-1 bg-teal-600 text-white dark:text-black rounded-xl"
              onClick={() => navigate("transfer")}
            >
              <Send size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
