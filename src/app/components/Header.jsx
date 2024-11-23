export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between gap-4 flex-wrap">
      {/* Botón para abrir/cerrar el menú en dispositivos pequeños */}
      <button className="bg-blue-700 text-white p-2 fixed top-4 left-4 z-50 md:hidden">
        ☰
      </button>

      {/* Barra de búsqueda: ocupando el resto del espacio */}
      <input
        type="text"
        placeholder="Buscar..."
        className="flex-grow p-2 border border-gray-300 rounded-lg md:ml-12"
      />

      {/* Icono y nombre de usuario */}
      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="h-10 w-10 rounded-full"
        />
        <span className="font-semibold">Cody Fisher</span>
      </div>
    </header>
  );
}
