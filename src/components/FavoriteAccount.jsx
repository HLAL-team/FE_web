import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const FavoriteAccountList = ({ onSelectAccount }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingFavorite, setRemovingFavorite] = useState(null);

  const fetchFavorites = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Token tidak ditemukan');
      setLoading(false);
      return;
    }

    setLoading(true); 
    setError(null);   

    fetch("https://kelompok2.serverku.org/api/transactions/favorite", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Gagal memuat data');
        }
        return res.json();
      })
      .then(data => {
        if (data.status && data.data && Array.isArray(data.data)) {
          // Process avatarUrls to include base URL
          const processedData = data.data.map(item => ({
            ...item,
            avatarUrl: item.avatarUrl ? 
              (item.avatarUrl.startsWith('http') ? item.avatarUrl : `https://kelompok2.serverku.org${item.avatarUrl}`) : 
              null
          }));
          setFavorites(processedData);
        } else {
          setError('Tidak ada data favorit');
          setFavorites([]);
        }
      })
      .catch(err => {
        setError(err.message);
        setFavorites([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fixed function to handle unfavoriting an account
  const handleRemoveFavorite = (e, accountNumber) => {
    // Stop event propagation to prevent triggering the parent onClick
    e.stopPropagation();
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Token tidak ditemukan');
      return;
    }

    // Set the account being removed to show loading state
    setRemovingFavorite(accountNumber);

    // Fixed URL to match the one in TransferPage.jsx
    fetch(`https://kelompok2.serverku.org/api/transactions/favorite?favoriteAccountNumber=${accountNumber}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Gagal menghapus favorit');
        }
        return res.json();
      })
      .then(data => {
        // Remove the unfavorited account from state
        setFavorites(favorites.filter(account => account.accountNumber !== accountNumber));
      })
      .catch(err => {
        console.error("Error removing favorite:", err);
        setError('Gagal menghapus favorit');
      })
      .finally(() => {
        setRemovingFavorite(null);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between shadow-sm mb-4 bg-none py-2 border-b border-gray-200">
        <h2 className="text-xl text-left font-semibold">Favorite Transfers</h2>
        <button
          onClick={fetchFavorites}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title="Refresh"
        >
          <FontAwesomeIcon icon={faSyncAlt} className="text-gray-700 dark:text-gray-200 w-4 h-4" />
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <ul className="space-y-4">
        {favorites.length > 0 ? (
          favorites.map((account, index) => (
            <li
              key={index}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onSelectAccount(account.accountNumber)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                  {account.avatarUrl ? (
                    <img
                      src={account.avatarUrl}
                      alt={account.fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{account.fullname}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{account.accountNumber}</p>
                </div>
              </div>
              <button 
                onClick={(e) => handleRemoveFavorite(e, account.accountNumber)}
                className="focus:outline-none"
                disabled={removingFavorite === account.accountNumber}
                title="Remove from favorites"
              >
                {removingFavorite === account.accountNumber ? (
                  <div className="w-6 h-6 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFD700" className="size-6 hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                )}
              </button>
            </li>
          ))
        ) : (
          !loading && !error && <li className="text-gray-400">You don't have any favorite accounts.</li>
        )}
      </ul>
    </div>
  );
};

export default FavoriteAccountList;