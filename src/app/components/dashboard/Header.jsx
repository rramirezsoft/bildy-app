import { FaBars } from "react-icons/fa";
import Image from "next/image";

export default function Header({ toggleSidebar }) {
  const placeholder = "/img/placeholder.png";
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
        <Image
          src={placeholder}
          alt="User"
          className="h-10 w-10 rounded-full"
          width={40}
          height={40}
        />
        <span className="font-semibold">Admin</span>
      </div>
    </header>
  );
}
