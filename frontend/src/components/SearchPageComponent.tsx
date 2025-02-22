import { Icon } from "@iconify/react";
import OfferBanner from "./OfferBanner";

const NotFoundSearchCard = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <Icon icon={"carbon:recently-viewed"} fontSize={"16px"} />
        <p className="text-sm text-darkBg">Bhumi</p>
      </div>

      {/* Right section */}
      <div>
        <Icon icon={"material-symbols:close-rounded"} fontSize={"16px"} />
      </div>
    </div>
  );
};

const SearchResultCard = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <Icon icon={"openmoji:handbag"} fontSize={"40px"} />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-bold text-darkBg">Ronak Paul</p>
            <p className="text-xs text-grey">Employee</p>
          </div>

          <p className="text-sm text-grey">Cinnovate Solutions Pvt Ltd</p>
        </div>
      </div>

      {/* Right section */}
      <div>
        <div className="flex items-center space-x-3 ">
          <div className="border border-darkBg  bg-darkBg rounded-lg px-1 py-1">
            <Icon icon={"proicons:video"} fontSize={"16px"} color="white" />
          </div>

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
  return (
    <div className="w-full h-full bg-white">
      {/* Search header */}

      <div className="px-3 py-4 bg-grey01">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 w-full">
            <Icon icon={"bitcoin-icons:search-filled"} fontSize={"25px"} />
            <input
              type="text"
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
      <div className="mt-2 px-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-darkBg">Recent</p>

          <p className="text-xs text-darkBg font-light">Clear All</p>
        </div>

        <div className="mt-4 space-y-5">
          <SearchResultCard />
          <SearchResultCard />
          <SearchResultCard />
          <SearchResultCard />
        </div>

        <div className="mt-6 space-y-3">
          <NotFoundSearchCard />
          <NotFoundSearchCard />
          <NotFoundSearchCard />
        </div>
      </div>
    </div>
  );
};

export default SearchPageComponent;
