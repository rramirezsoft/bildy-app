import { FaBars } from "react-icons/fa";

export default function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between gap-4 flex-wrap border-b border-gray-300">
      {/* Botón para abrir/cerrar el menú en dispositivos pequeños y medianos */}
      <button
        className="text-blue-700 p-2 rounded-full lg:hidden hover:bg-gray-100 transition"
        onClick={toggleSidebar}
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow p-2 border border-gray-300 rounded-lg md:ml-12"
      />

      {/* Icono y nombre de usuario */}
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="h-10 w-10 rounded-full"
        />
        <span className="font-semibold">Admin</span>
      </div>
    </header>
  );
}
