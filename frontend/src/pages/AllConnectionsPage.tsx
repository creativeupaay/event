import avatarProfile from "../assets/tempProfile.svg";

const ConnectionRequestCard = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Left part */}
      <div className="flex items-center">
        <img src={avatarProfile} alt="User profile" />
        <div className="flex flex-col ml-3">
          <h1 className="text-lg text-black font-medium">Ronak Paul</h1>
          <p className="text-sm text-black">Software Developer</p>
        </div>
      </div>
      {/* Right part */}
      <div className="flex items-center space-x-7 text-3xl"></div>
    </div>
  );
};

const AllConnectionsPage = () => {
  return (
    <div className="px-3 h-full overflow-y-scroll">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Connections{" "}
          <span className="text-blue-600 text-sm ml-2">( 100 )</span>
        </h1>
      </div>
      <div className="my-7">
        <div className="my-5 w-full flex flex-col space-y-7">
          <ConnectionRequestCard />
          <ConnectionRequestCard />
          <ConnectionRequestCard />
          <ConnectionRequestCard />
          <ConnectionRequestCard />
        </div>
      </div>
    </div>
  );
};

export default AllConnectionsPage;
