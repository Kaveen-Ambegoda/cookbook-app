import { FaHome, FaUtensils, FaClipboardList, FaHeart, FaCog, FaSignOutAlt } from "react-icons/fa"; // Added FaSignOutAlt for logout

const Sidebar = () => {
  return (
    <div className="bg-green-800 text-white w-15 fixed top-0 left-0 h-full flex flex-col items-center py-20 space-y-20 pt-30 hover:bg-green-1000 transition-all duration-300">
      <FaHome size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaUtensils size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaClipboardList size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaHeart size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaCog size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" />
      <FaSignOutAlt size={24} className="cursor-pointer hover:text-yellow-400 transition-all duration-300" /> {/* Added logout icon */}
    </div>
  );
};

export default Sidebar;
