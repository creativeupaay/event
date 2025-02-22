import tempProfile from "../assets/tempProfile.svg";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SearchPageComponent from "./SearchPageComponent";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();

  const [isSearchbarOpen, setIsSearchbarOpen] = useState<boolean>(false);

  return (
    <header className="flex items-center justify-between px-3 py-3 sticky top-0 left-0 w-full z-50 bg-grey01">
      {/* The search bar component */}
      {isSearchbarOpen && (
        <div
          className="w-full absolute top-0 left-0 z-50"
          style={{
            height: innerHeight - 100,
          }}
        >
          <SearchPageComponent setIsSearchbarOpen={setIsSearchbarOpen} />
        </div>
      )}

      <div className="flex items-center space-x-5 ">
        <img
          onClick={() => navigate("/profile")}
          src={tempProfile}
          alt="profile img"
        />
        <div className="flex flex-col">
          <p className="text-xs">Welcome!</p>
          <p className="font-semibold">Sourab Purbia</p>
        </div>
      </div>

      <div className="flex space-x-3 items-center ">
        <div className="text-3xl" onClick={() => setIsSearchbarOpen(true)}>
          <Icon icon={"bitcoin-icons:search-filled"} width={24} height={24} />
        </div>

        <div className="text-3xl">
          <Icon icon={"uil:qrcode-scan"} width={24} height={24} />
        </div>

        <div
          onClick={() => navigate("/notifications")}
          className="text-black text-3xl relative"
        >
          <div className="absolute w-2 h-2  bg-red-600 top-0 right-0 rounded-full"></div>
          <Icon icon="proicons:bell" width="24" height="24" />
        </div>
      </div>
    </header>
  );
};

export default Header;
