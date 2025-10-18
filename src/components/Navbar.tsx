import { Search, Star, User } from "lucide-react";
import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#141414] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-xl p-2">
          <span className="text-red-600 font-bold text-xl">LF</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold">Leaderflix</h1>
          <p className="text-xs text-gray-400">Explora - Mira - Califica</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-[#1f1f1f] px-4 py-2 rounded-full w-1/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar películas, Directores, Series"
          className="bg-transparent w-full outline-none px-2 text-sm text-gray-300"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5">
        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
          <Star size={18} /> Favoritas
        </button>
        <Link to="/profile">
          <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <User />
          </button>
        </Link>
      </div>
    </nav>
  );
}
