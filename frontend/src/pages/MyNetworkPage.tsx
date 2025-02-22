import { useEffect, useState } from "react";
import userApi from "../apis/userApi";
import { Icon } from "@iconify/react";
import OfferBanner from "../components/OfferBanner";
import { useNavigate } from "react-router-dom";

const ConnectionCard = ({ name }: { name: string }) => {
  return (
    <div className="w-full h-[149px] flex flex-col rounded-xl bg-[#FFFEC4]">
      {/* top part */}
      <div className="flex-[0.75] px-2 pt-4 space-y-2  ">
        <p className="text-sm font-bold text-darkBg">{name}</p>
        <div className="flex items-center space-x-2">
          <Icon icon={"openmoji:handbag"} fontSize="16px" />
          <p className="text-xs text-grey">Employee</p>
        </div>

        <p className="text-sm text-grey">Cinnovate Solutions Pvt Ltd</p>
      </div>
      {/* bottom part */}
      <div className="flex-[0.25] w-full flex items-center space-x-7 text-3xl py-1 mt-2 bg-darkBg bg-opacity-10 rounded-b-lg">
        <div className="flex-[0.5] flex justify-center">
          <Icon icon={"ic:outline-email"} fontSize={"20px"} />
        </div>

        <div className="flex-[0.5] flex justify-center">
          <Icon icon={"ic:outline-phone"} fontSize={"20px"} />
        </div>
      </div>
    </div>
  );
};

interface friendI {
  friendId: string;
  name: string;
  email: string;
  contactNumber: string;
  position: string;
}

const MyNetworkPage = () => {
  const [allFriends, setAllFriends] = useState<friendI[]>([]);

  const [_isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchAllFriends = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.get(
        "user/friend-management/get-all-friends"
      );

      if (response.status == 200) {
        setAllFriends(response.data.friends);
      }
    } catch (e) {}

    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllFriends();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="bg-grey01 px-3 py-5">
        <div className="text-darkBg space-x-3 flex items-center">
          <Icon
            onClick={() => navigate(-1)}
            icon="proicons:arrow-left"
            width="24"
            height="24"
          />
          <p className="font-medium">My Network</p>
        </div>
      </div>
      <OfferBanner />

      <div className="w-full h-full px-3 py-3">
        <p className="text-sm text-darkBg">{allFriends.length} Connections</p>
        {/* Search section */}
        <div className="w-full flex items-center space-x-2 my-4 bg-grey01 px-3 py-2 rounded-xl">
          <Icon icon={"bitcoin-icons:search-filled"} fontSize={"20px"} />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent placeholder:text-xs outline-none text-xs"
          />
          <Icon icon={"material-symbols:close-rounded"} fontSize={"20px"} />
        </div>

        {/* Connection cards */}
        <div className="h-full grid grid-cols-2 gap-3 overflow-y-scroll no-scrollbar pb-56">
          {allFriends.map((friend) => (
            <ConnectionCard key={friend.friendId} name={friend.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNetworkPage;
