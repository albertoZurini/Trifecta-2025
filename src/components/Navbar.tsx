export function Navbar() {
  return (
    <nav className="flex items-center justify-end p-4 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search workflows..."
          className="px-4 py-2 bg-[#2a2b36] rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
        />
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          JD
        </div>
      </div>
    </nav>
  );
} 