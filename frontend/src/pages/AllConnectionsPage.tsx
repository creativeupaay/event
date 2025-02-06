import { ChevronRight } from "@mui/icons-material";
import avatarProfile from "../assets/tempProfile.svg";
import { useEffect, useState } from "react";
import userApi from "../apis/userApi";

const ConnectionRequestCard = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center justify-between">
      {/* Left part */}
      <div className="flex items-center">
        <img src={avatarProfile} alt="User profile" />
        <div className="flex flex-col ml-3">
          <h1 className="text-lg text-black font-medium">{name}</h1>
          <p className="text-sm text-black">Software Developer</p>
        </div>
      </div>
      {/* Right part */}
      <div className="flex items-center space-x-7 text-3xl text-blue-600">
        <ChevronRight />
      </div>
    </div>
  );
};

interface friendI {
  friendId: string;
  name: string;
  email: string;
}

const AllConnectionsPage = () => {
  const [allFriends, setAllFriends] = useState<friendI[]>([]);

  const fetchAllFriends = async () => {
    try {
      const response = await userApi.get(
        "user/friend-management/get-all-friends"
      );

      if (response.status == 200) {
        setAllFriends(response.data.friends);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchAllFriends();
  }, []);

  return (
    <div className="px-3 h-full overflow-y-scroll">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Connections{" "}
          <span className="text-blue-600 text-sm ml-2">
            ( {allFriends.length} )
          </span>
        </h1>
      </div>
      <div className="my-7">
        <div className="my-5 w-full flex flex-col space-y-7">
          {allFriends.map((friend) => (
            <ConnectionRequestCard key={friend.friendId} name={friend.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllConnectionsPage;
