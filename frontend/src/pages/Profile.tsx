import OfferBanner from "../components/OfferBanner";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import QRImg from "../assets/qrImage.png";
import { useUser } from "../hooks/UserContext";
import lockBadge from "../assets/badges/lock.png";
import parmanuBadge from "../assets/badges/paramanu.png";
import nakshatraBadge from "../assets/badges/nakshatra.png";
import chandraBadge from "../assets/badges/chandra.png";
import shaniBadge from "../assets/badges/shani.png";
import suryaBadge from "../assets/badges/surya.png";
import { useEffect, useState } from "react";

const badgeInfo = [
  {
    badgeName: "Lock",
    badge: lockBadge,
    connectionsNeeded: 0,
  },
  {
    badgeName: "Parmanu",
    badge: parmanuBadge,
    connectionsNeeded: 1,
  },
  {
    badgeName: "Nakshatra",
    badge: nakshatraBadge,
    connectionsNeeded: 10,
  },
  {
    badgeName: "Chandra",
    badge: chandraBadge,
    connectionsNeeded: 25,
  },
  {
    badgeName: "Shani",
    badge: shaniBadge,
    connectionsNeeded: 50,
  },
  {
    badgeName: "Surya",
    badge: suryaBadge,
    connectionsNeeded: 51,
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, userLevelData } = useUser();

  const [levelPercentage, setLevelPercentage] = useState(0);

  useEffect(() => {
    if (!user || !userLevelData) return;

    const percentage =
      user.connections / badgeInfo[userLevelData.level].connectionsNeeded;

    setLevelPercentage(percentage * 100);
  }, []);

  return (
    <div className="w-full h-full">
      {/* top header */}
      <div className="bg-grey01 px-3 py-5 flex items-center justify-between">
        <div className="text-darkBg space-x-3 flex items-center">
          <Icon
            onClick={() => navigate(-1)}
            icon="proicons:arrow-left"
            fontSize={"24px"}
          />
          <p className="font-medium">Profile</p>
        </div>

        <Icon
          onClick={() => navigate("/qr")}
          icon={"uil:qrcode-scan"}
          fontSize={"20px"}
        />
      </div>
      <OfferBanner />

      <div className="w-full h-full relative overflow-y-scroll no-scrollbar">
        {/* main profile section with name and badge */}
        <div className="flex flex-col justify-center items-center mt-4 space-y-2 ">
          <p className="text-xl font-bold">{user?.name}</p>
          <img
            src={
              badgeInfo[userLevelData?.level ? userLevelData?.level : 0].badge
            }
            alt="badge"
            className="w-24 object-contain "
          />
        </div>

        {/* Other contents */}
        <div className="w-full bg-transparent px-5 absolute top-28 left-0 space-y-4">
          {/* badge current score section */}
          <div className="w-full bg-white p-3 space-y-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-darkBg">
                {userLevelData?.badgeName}
              </p>
              <p className="text-[10px] text-darkBg">
                Connections Made : {user?.connections}
              </p>
            </div>
            {/* Level bar */}
            <div className="w-full h-3 bg-[#EDE8FF] rounded-full">
              <div
                className={` h-full bg-[#7E1891] rounded-full`}
                style={{
                  width: `${levelPercentage}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[10px] text-grey">
                {badgeInfo[userLevelData?.level ? userLevelData?.level : 0]
                  .connectionsNeeded -
                  (user?.connections ? user.connections : 0)}{" "}
                more connections to Level Up! 🚀
              </p>
              <p className="text-xs text-grey">Level {userLevelData?.level}</p>
            </div>
          </div>

          {/* got to scan the QR section */}
          <div
            onClick={() => navigate("/qr")}
            className="w-full bg-white flex items-center justify-between p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <img
                src={QRImg}
                alt="qr code"
                className="w-8 h-8 object-contain"
              />
              <p className="text-sm font-bold">
                Skip the Small Talk, Just Scan!
              </p>
            </div>

            <Icon icon={"ic:round-chevron-right"} fontSize={"25px"} />
          </div>

          {/* personal details section */}
          <div className="w-full bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Personal Details</p>
              <Icon
                icon={"material-symbols:edit-outline-rounded"}
                fontSize={"16px"}
              />
            </div>

            <div className="w-full flex-1 flex flex-col space-y-4 my-3">
              <div className="flex items-center">
                <div className="flex-[0.5] w-full text-sm text-grey">
                  <p>Name</p>
                </div>

                <div className="flex-[0.5] w-full text-sm text-darkBg">
                  <p>{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-[0.5] w-full text-sm text-grey">
                  <p>Email</p>
                </div>

                <div className="flex-[0.5] w-full text-sm text-darkBg">
                  <p>ronak@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-[0.5] w-full text-sm text-grey">
                  <p>Phone Number</p>
                </div>

                <div className="flex-[0.5] w-full text-sm text-darkBg">
                  <p>8822412697</p>
                </div>
              </div>
            </div>
          </div>

          {/* professoinal details section */}
          <div className="w-full bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Professional Details</p>
              <Icon
                icon={"material-symbols:edit-outline-rounded"}
                fontSize={"16px"}
              />
            </div>

            <div className="w-full flex-1 flex flex-col space-y-4 my-3">
              <div className="flex items-center">
                <div className="flex-[0.5] w-full text-sm text-grey">
                  <p>Work Status</p>
                </div>

                <div className="flex-[0.5] w-full text-sm text-darkBg">
                  <p>{user?.position}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-[0.5] w-full text-sm text-grey">
                  <p>Company Name</p>
                </div>

                <div className="flex-[0.5] w-full text-sm text-darkBg">
                  <p>{user?.company}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-[0.5] w-full text-sm text-grey">
                  <p>Role</p>
                </div>

                <div className="flex-[0.5] w-full text-sm text-darkBg">
                  <p>{user?.profession}</p>
                </div>
              </div>
            </div>
          </div>

          {/* interests section */}
          <div className="w-full bg-white p-3 rounded-lg">
            <div className="w-full flex items-center justify-between">
              <p className="text-sm font-medium">Interests</p>
              <Icon
                icon={"material-symbols:edit-outline-rounded"}
                fontSize={"16px"}
              />
            </div>

            <div className="w-full flex items-center  my-3 text-sm text-darkBg">
              <p>AI & Automation, Smart Devices, Gaming</p>
            </div>
          </div>

          {/* Want to network with section */}
          <div className="w-full bg-white p-3 rounded-lg pb-[200px]">
            <div className="w-full flex items-center justify-between">
              <p className="text-sm font-medium">Want to network with</p>
              <Icon
                icon={"material-symbols:edit-outline-rounded"}
                fontSize={"16px"}
              />
            </div>

            <div className="w-full flex items-center space-x-2 my-3 text-sm text-darkBg">
              <p>
                Full Stack Developer, Accounting Professional, Mobile Developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
