import { Icon } from "@iconify/react";
import OfferBanner from "./OfferBanner";
import { useEffect, useState } from "react";
import userApi from "../apis/userApi";
import useDebounce from "../hooks/Debounce";

// const NotFoundSearchCard = () => {
//   return (
//     <div className="flex items-center justify-between">
//       {/* Left section */}
//       <div className="flex items-center space-x-2">
//         <Icon icon={"carbon:recently-viewed"} fontSize={"16px"} />
//         <p className="text-sm text-darkBg">Bhumi</p>
//       </div>

//       {/* Right section */}
//       <div>
//         <Icon icon={"material-symbols:close-rounded"} fontSize={"16px"} />
//       </div>
//     </div>
//   );
// };

interface SearchResultI {
  _id: string;
  name: string;
  position: string;
  company: string;
}

const SearchResultCard = ({ data }: { data: SearchResultI }) => {
  return (
    <div className="flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <Icon icon={"openmoji:handbag"} fontSize={"40px"} />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-bold text-darkBg">{data.name}</p>
            <p className="text-xs text-grey">{data.position}</p>
          </div>

          <p className="text-sm text-grey">{data.company}</p>
        </div>
      </div>

      {/* Right section */}
      <div>
        <div className="flex items-center space-x-3 ">
          {/* <div className="border border-darkBg  bg-darkBg rounded-lg px-1 py-1">
            <Icon icon={"proicons:video"} fontSize={"16px"} color="white" />
          </div> */}

          <div className="border border-darkBg rounded-lg px-1 py-1">
            <Icon icon={"proicons:note"} fontSize={"16px"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPageComponent = ({
  setIsSearchbarOpen,
}: {
  setIsSearchbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [searchedName, setSearchedName] = useState<string>("");
  const debounceQuery = useDebounce(searchedName, 500);

  const [searchedResults, setSearchedResults] = useState<SearchResultI[]>([]);

  const fetchSearchResults = async () => {
    try {
      const res = await userApi(
        `/user/events/get-all-event-Guest?eventId=67a1e3adace29974b72c9694&name=${debounceQuery}`
      );

      if (res.status == 200) {
        setSearchedResults(res.data.eventGuests);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSearchResults();
  }, [debounceQuery]);

  return (
    <div className="w-full h-full bg-white overflow-y-hidden">
      {/* Search header */}

      <div className="px-3 py-4 bg-grey01">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 w-full">
            <Icon icon={"bitcoin-icons:search-filled"} fontSize={"25px"} />
            <input
              type="text"
              value={searchedName}
              onChange={(e) => setSearchedName(e.target.value)}
              placeholder="Search"
              className="placeholder:text-xs text-xs placeholder:text-black placeholder:font-light bg-transparent w-full outline-none"
            />
          </div>

          <div>
            <Icon
              onClick={() => setIsSearchbarOpen(false)}
              icon={"material-symbols:close-rounded"}
              fontSize={"25px"}
            />
          </div>
        </div>
      </div>

      <OfferBanner />

      {/* Recent search portion */}
      <div className="mt-2 px-3 h-full">
        <div className="flex items-center justify-between">
          <p className="text-sm text-darkBg">Recent</p>

          <p className="text-xs text-darkBg font-light">Clear All</p>
        </div>

        <div className="mt-4 space-y-5 h-full pb-[200px]  overflow-y-scroll">
          {searchedResults.map((data) => (
            <SearchResultCard key={data._id} data={data} />
          ))}
        </div>

        {/* <div className="mt-6 space-y-3">
          <NotFoundSearchCard />
          <NotFoundSearchCard />
          <NotFoundSearchCard />
        </div> */}
      </div>
    </div>
  );
};

export default SearchPageComponent;
