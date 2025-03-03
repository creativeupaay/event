import { Icon } from "@iconify/react";
import OfferBanner from "./OfferBanner";
import React, { useEffect, useState } from "react";
import userApi from "../apis/userApi";
import useDebounce from "../hooks/Debounce";
import { interests } from "./formSections/FormSection2";
import { useSnackbar } from "../hooks/SnackbarContext";
import { getIconFromIndustries, InfoSection } from "./ConnectCard";
import { Link } from "react-router-dom";

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
  industry: string[];
  lookingFor: string[];
  instituteName: string[];
  courseName: string;
  profession: string;
}

const getIconFromPosition = (position: string) => {
  const temp = interests.filter((interest) => interest.label == position);

  return temp[0].icon;
};

const ConnectedUserCard = ({
  name,
  interests,
  company,
  institueName,
  courseName,
  profession,
  lookingFor,
  position,
  id,
}: {
  name: string;
  interests: string[];
  id: string;
  company?: string;
  institueName?: string;
  courseName?: string;
  profession?: string;
  position?: string;
  lookingFor?: string[];
}) => {
  useEffect(() => {
    console.log(profession, id);
  }, []);

  return (
    <div
      className={`w-full h-[450px] rounded-xl flex flex-col justify-between  flex-shrink-0 relative px-2 py-3`}
    >
      <div className="bg-black w-fit px-3 py-1 rounded-lg mb-2 bg-[linear-gradient(40deg,_#FFA469_42%,_#FF6B0B_100%)]">
        <p className="text-white text-xs font-light">{position}</p>
      </div>
      <div className="w-full h-full flex flex-col justify-between">
        <div>
          {position == "Student" && (
            <div className="w-full flex-1 flex items-center my-3">
              <div className="flex-[0.5] space-y-1">
                <div className="flex items-center space-x-3 text-grey ">
                  <Icon icon={"ic:outline-room"} fontSize={"10px"} />
                  <p className="text-[8px] ">Institute</p>
                </div>

                <p className="text-[10px] text-darkBg font-medium">
                  {institueName}
                </p>
              </div>

              <div className="flex-[0.5] space-y-1">
                <div className="flex items-center space-x-3 text-grey ">
                  <Icon icon={"mdi:college-outline"} fontSize={"10px"} />
                  <p className="text-[8px] ">Course Enrolled</p>
                </div>

                <p className="text-[10px] text-darkBg font-medium">
                  {courseName}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center ">
            <div className="flex flex-col space-y-2">
              <h1 className="text-xl text-darkBg font-medium">{name}</h1>

              {company && (
                <InfoSection heading="Company" text={company} theme="dark" />
              )}
            </div>
          </div>

          {position != "Employee" && position != "Freelancer" && (
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
                {interests?.map((label, index) => (
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
              {lookingFor?.map((text, index) => (
                <React.Fragment key={index}>{text}, </React.Fragment>
              ))}
            </p>
          </div>

          {/* Phone number and email */}
          <div className="flex flex-col space-y-2 pt-3">
            <Link to={"mailto:manish@gmail.com"}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon icon={"ic:outline-email"} />
                  <p className="text-sm">manish@gmail.com</p>
                </div>

                <Icon icon={"stash:chevron-right-duotone"} fontSize={"22px"} />
              </div>
            </Link>

            <Link to={"tel:123456789"}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon icon={"ic:outline-phone"} />
                  <p className="text-sm">1234567890</p>
                </div>

                <Icon icon={"stash:chevron-right-duotone"} fontSize={"22px"} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResultCard = ({
  data,
  setSelectedSearch,
}: {
  data: SearchResultI;
  setSelectedSearch: React.Dispatch<
    React.SetStateAction<SearchResultI | undefined>
  >;
}) => {
  const addRecentSearch = async () => {
    try {
      await userApi.post(`/user/recent-search/add?searchedUserId=${data._id}`);
    } catch (e) {}
  };

  const handleClick = () => {
    addRecentSearch();
    setSelectedSearch(data);
  };

  return (
    <div onClick={handleClick} className="flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <p className="text-[33px]">{getIconFromPosition(data.position)}</p>
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
  const { showSnackbar } = useSnackbar();

  const [searchedResults, setSearchedResults] = useState<SearchResultI[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResultI[]>([]);

  // When the user clicks on a search result
  const [selectedSearch, setSelectedSearch] = useState<
    SearchResultI | undefined
  >(undefined);

  const fetchSearchResults = async () => {
    if (debounceQuery == "") {
      return;
    }

    try {
      const res = await userApi(
        `/user/events/get-all-event-Guest?eventId=67a1e3adace29974b72c9694&name=${debounceQuery}`
      );

      if (res.status == 200) {
        setSearchedResults(res.data.eventGuests);
      }
    } catch (e) {}
  };

  const fetchRecentSearches = async () => {
    try {
      const res = await userApi.get("/user/recent-search");

      if (res.status == 200) {
        setRecentSearches(res.data.recentSearches);
      }
    } catch (e) {}
  };

  const clearRecentSearchHistory = async () => {
    try {
      const res = await userApi.delete(
        "/user/recent-search/clear-search-history"
      );

      if (res.status == 200) {
        showSnackbar("Recent searches are cleared", "success");
        setRecentSearches([]);
      }
    } catch (e) {
      showSnackbar("Error in clearing recent searches", "error");
    }
  };

  useEffect(() => {
    if (debounceQuery != "") fetchSearchResults();
    else fetchRecentSearches();
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
              value={selectedSearch ? selectedSearch.name : searchedName}
              onChange={(e) => {
                if (e.target.value == "") setSearchedResults([]);

                if (e.target.value != selectedSearch?.name)
                  setSelectedSearch(undefined);

                setSearchedName(e.target.value);
              }}
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

      {searchedName.length == 0 && <OfferBanner />}

      {/* Recent search portion */}
      <div className="mt-2 px-3 h-full overflow-y-scroll no-scrollbar">
        {searchedName.length == 0 &&
          recentSearches.length != 0 &&
          !selectedSearch && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-darkBg">Recent</p>

                <p
                  onClick={clearRecentSearchHistory}
                  className="text-xs text-darkBg font-light"
                >
                  Clear All
                </p>
              </div>

              <div className="mt-4 space-y-5 h-full pb-[200px]  overflow-y-scroll">
                {recentSearches?.map((data) => (
                  <SearchResultCard
                    key={data._id}
                    data={data}
                    setSelectedSearch={setSelectedSearch}
                  />
                ))}
              </div>
            </div>
          )}

        {selectedSearch ? (
          <ConnectedUserCard
            id={selectedSearch._id}
            interests={selectedSearch.industry}
            company={selectedSearch.company}
            name={selectedSearch.name}
            courseName={selectedSearch.courseName}
            position={selectedSearch.position}
            lookingFor={selectedSearch.lookingFor}
            profession={selectedSearch.profession}
          />
        ) : (
          <div className="mt-4 space-y-5 h-full pb-[200px]  overflow-y-scroll">
            {searchedResults?.map((data) => (
              <SearchResultCard
                key={data._id}
                data={data}
                setSelectedSearch={setSelectedSearch}
              />
            ))}
          </div>
        )}

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
