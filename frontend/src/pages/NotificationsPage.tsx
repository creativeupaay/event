import tempProfile from "../assets/tempProfile.svg";

const NotificationCard = () => {
  return (
    <div className="w-full px-3 py-3 bg-blue-300 rounded-md flex items-center">
      <div className="flex items-center">
        <img src={tempProfile} alt="profile img" />
        <p className="ml-3">
          Hey you have a connection request from Ronak Paul and he wants to
          connect to you
        </p>
      </div>

      <div className=" h-full flex items-start">
        <p className="text-sm">22m</p>
      </div>
    </div>
  );
};

const NotificatonsPage = () => {
  return (
    <div className="w-full h-full px-3">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <div className="w-full h-full flex flex-col space-y-4 mt-6">
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </div>
    </div>
  );
};

export default NotificatonsPage;
