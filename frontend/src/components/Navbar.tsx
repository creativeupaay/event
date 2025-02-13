import { useNavigate, useParams } from "react-router-dom";
import homeIcon from "../assets/icons/homeIcon.svg";
import networkIcon from "../assets/icons/networkIcon.svg";
import profileIcon from "../assets/icons/profileIcon.svg";

const NavButton = ({
  icon,
  title,
  toRoute,
}: {
  icon: string;
  title: string;
  toRoute: string;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(toRoute)}
      className="flex flex-col items-center space-y-1 "
    >
      <img src={icon} alt={`title icon`} className="stroke-orange-400" />
      <p className="text-xs">{title}</p>
    </div>
  );
};

const Navbar = () => {
  const { eventId } = useParams();

  return (
    <div className="w-full h-full bg-grey01 flex items-center justify-evenly">
      <NavButton icon={homeIcon} title="Home" toRoute={`/connect/${eventId}`} />
      <NavButton
        icon={networkIcon}
        title="My Network"
        toRoute={`/connections/all`}
      />
      <NavButton icon={profileIcon} title="Profile" toRoute={`/profile`} />
      <NavButton
        icon={profileIcon}
        title="Exit"
        toRoute={`/connect/${eventId}`}
      />
    </div>
  );
};

export default Navbar;
