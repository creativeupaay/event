import { NotificationsOutlined, SearchOutlined } from "@mui/icons-material";
import tempProfile from "../assets/tempProfile.svg";
import { useNavigate } from "react-router-dom";

// import { ChevronRight } from "@mui/icons-material";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-3 py-3 sticky top-0 left-0 w-full z-50 bg-grey01">
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
        <div className="text-3xl">
          <SearchOutlined fontSize="inherit" />
        </div>
        <div
          onClick={() => navigate("/notifications")}
          className="text-black text-3xl relative"
        >
          <div className="absolute w-2 h-2  bg-red-600 top-2 right-1 rounded-full"></div>
          <NotificationsOutlined fontSize="inherit" />
        </div>
      </div>
    </header>
  );
};

export default Header;
