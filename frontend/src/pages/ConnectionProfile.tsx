import { Icon } from "@iconify/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OfferBanner from "../components/OfferBanner";
import userApi from "../apis/userApi";
import React, { useEffect, useState } from "react";
import { userI } from "../types/userTypes";
import { getIconFromIndustries, InfoSection } from "../components/ConnectCard";

const ConnectionProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileInfo, setProfileInfo] = useState<userI | undefined>(undefined);

  const fetchProfile = async () => {
    try {
      const res = await userApi.get(
        `/user/friend-management/friend-profile?friendId=${id}`
      );

      console.log(res.data);

      if (res.status == 200) {
        setProfileInfo(res.data.friendProfile[0]);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchProfile();
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
      </div>
      <OfferBanner />

      <div
        className={`w-full h-[450px] rounded-xl flex flex-col justify-between  flex-shrink-0 relative px-4 py-3`}
      >
        <div className="bg-black w-fit px-3 py-1 rounded-lg mb-2 bg-[linear-gradient(40deg,_#FFA469_42%,_#FF6B0B_100%)]">
          <p className="text-white text-xs font-light">
            {profileInfo?.position}{" "}
            {(profileInfo?.position === "Freelancer" ||
              profileInfo?.position === "Employee") &&
              ` | ${profileInfo?.profession}`}
          </p>
        </div>
        <div className="w-full h-full flex flex-col justify-between">
          <div>
            {profileInfo?.position == "Student" && (
              <div className="w-full flex-1 flex items-center my-3">
                <div className="flex-[0.5] space-y-1">
                  <div className="flex items-center space-x-3 text-grey ">
                    <Icon icon={"ic:outline-room"} fontSize={"10px"} />
                    <p className="text-[8px] ">Institute</p>
                  </div>

                  <p className="text-[10px] text-darkBg font-medium">
                    {profileInfo?.instituteName}
                  </p>
                </div>

                <div className="flex-[0.5] space-y-1">
                  <div className="flex items-center space-x-3 text-grey ">
                    <Icon icon={"mdi:college-outline"} fontSize={"10px"} />
                    <p className="text-[8px] ">Course Enrolled</p>
                  </div>

                  <p className="text-[10px] text-darkBg font-medium">
                    {profileInfo?.courseName}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center ">
              <div className="flex flex-col space-y-2">
                <h1 className="text-xl text-darkBg font-medium">
                  {profileInfo?.name}
                </h1>

                {profileInfo?.company && (
                  <InfoSection
                    heading="Company"
                    text={profileInfo.company}
                    theme="dark"
                  />
                )}
              </div>
            </div>

            {profileInfo?.position != "Employee" &&
              profileInfo?.position != "Freelancer" && (
                <div className="my-5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon={"material-symbols-light:domain"}
                      fontSize={"12px"}
                      color="#242424"
                    />
                    <p className="text-xs font-extralight text-grey">
                      Belongs to industries like
                    </p>
                  </div>
                  <div className=" flex flex-wrap gap-3">
                    {profileInfo?.interests?.map((label, index) => (
                      <div
                        key={index}
                        className={`border border-darkBg
     w-fit px-2 py-1 rounded-lg flex items-center space-x-2`}
                      >
                        <p>{getIconFromIndustries(label)}</p>
                        <p className="text-sm text-darkBg">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="my-5">
              <p className="text-xs font-extralight text-grey">
                Looking to connect with
              </p>
              <p className="text-sm   font-medium text-darkBg leading-normal">
                {profileInfo?.lookingFor?.map((text, index) => (
                  <React.Fragment key={index}>{text}, </React.Fragment>
                ))}
              </p>
            </div>

            {/* Phone number and email */}
            <div className="flex flex-col space-y-2 pt-3">
              <Link to={`mailto:${profileInfo?.email}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon icon={"ic:outline-email"} />
                    <p className="text-sm">{profileInfo?.email}</p>
                  </div>

                  <Icon
                    icon={"stash:chevron-right-duotone"}
                    fontSize={"22px"}
                  />
                </div>
              </Link>

              <Link to={`tel:${profileInfo?.contactNumber}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon icon={"ic:outline-phone"} />
                    <p className="text-sm">{profileInfo?.contactNumber}</p>
                  </div>

                  <Icon
                    icon={"stash:chevron-right-duotone"}
                    fontSize={"22px"}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionProfile;
