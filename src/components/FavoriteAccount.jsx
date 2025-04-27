import { useEffect, useState } from "react";

const FavoriteAccountList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setFavorites(data.slice(0, 5)));
  }, []);

  return (
    <div >
      <h2 className="text-xl text-left font-semibold mb-4">Favorite Account List</h2>
      <ul className="space-y-4">
        {favorites.map((account, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-xs text-gray-500">{account.phone}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#19918F" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#19918F" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteAccountList;


