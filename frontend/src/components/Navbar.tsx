import homeIcon from "../assets/icons/homeIcon.svg";
import networkIcon from "../assets/icons/networkIcon.svg";
import profileIcon from "../assets/icons/profileIcon.svg";

const NavButton = ({ icon, title }: { icon: string; title: string }) => {
  return (
    <div className="flex flex-col items-center space-y-1 ">
      <img src={icon} alt={`title icon`} className="stroke-orange-400" />
      <p className="text-xs">{title}</p>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="w-full h-full bg-grey01 flex items-center justify-evenly">
      <NavButton icon={homeIcon} title="Home" />
      <NavButton icon={networkIcon} title="My Network" />
      <NavButton icon={profileIcon} title="Profile" />
      <NavButton icon={profileIcon} title="Exit" />
    </div>
  );
};

export default Navbar;
