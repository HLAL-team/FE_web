import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';


const FavoriteAccountList = ({ onSelectAccount }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setFavorites(data.data);
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

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
<div className="flex items-center justify-between shadow-sm mb-4 bg-none py-2 border-b border-gray-200">
<h2 className="text-xl text-left font-semibold ">Favorite Transfers</h2>
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
                <div>
                  <p className="text-left text-m font-medium">{account.fullname}</p>
                  <p className="text-sm text-gray-700">{account.accountNumber}</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#19918F" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#19918F" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
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
