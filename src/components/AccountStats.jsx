import { Eye, EyeOff, Plus, Send } from "lucide-react";
import { currencyFormatter } from "../helper/helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import bgHero from "../assets/bgHero.png";


function AccountStats() {
  const [account, setAccount] = useState({});

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch account data");
        const data = await response.json();
        setAccount(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchAccount();
  }, []);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-12 px-6 sm:px-4 lg:px-8 mb-9 dark:text-white">
      <AccountInfo accountNumber={account.accountNumber} />
      <BalanceInfo balance={currencyFormatter.format(Math.abs(account.balance))} />
    </div>
  );
}

const AccountInfo = ({ accountNumber }) => {
  return (
    <div
      className="flex items-center justify-center h-56 w-72 text-white rounded-3xl p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgHero})` }}
    >
      <div>
        <h4 className="font-normal text-xl">Account No</h4>
        <p className="font-bold text-xl">{accountNumber}</p>
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
              className="p-1 text-primary dark:text-black rounded-xl"
              style={{ backgroundColor: '#F5FEF0' }}
              onClick={() => navigate("topup")}
            >
              <Plus size={40} />
            </button>
            <button
              className="p-1 text-primary dark:text-black rounded-xl"
              style={{ backgroundColor: '#ECFFF7' }}
              onClick={() => navigate("transfer")}
            >
              <Send size={36} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
