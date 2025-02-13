import { EastOutlined, ReplayOutlined } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../apis/userApi";
import { userI } from "../types/userTypes";
import LoadingComp from "../components/loading/LoadingComp";
import ConnectCard from "../components/ConnectCard";

// This is the page where the user can make connection by swapping left or right
const ConnectPage = () => {
  const navigate = useNavigate();

  const { eventId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchEventGuests = async () => {
    setIsLoading(true);

    try {
      const response = await userApi.get(
        `/user/events/get-all-event-Guest?eventId=${eventId}`
      );

      if (response.status == 200) {
        const data = response.data.eventGuests;

        setUsers(data);
      }
    } catch (e) {}

    setIsLoading(false);
  };

  const [users, setUsers] = useState<userI[]>([]);

  useEffect(() => {
    fetchEventGuests();
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className=" px-5 flex items-center justify-between py-2">
        <div>
          <div className="flex items-center space-x-2 text-xs">
            <p>Requests Sent</p>
            <EastOutlined fontSize="inherit" />
          </div>
          <p className="text-lg font-semibold">10</p>
        </div>
        <div className="w-[1px] h-12 bg-black"></div>
        <div
          onClick={() => navigate("/connections/pending")}
          className="active:bg-grey01"
        >
          <div className="flex items-center space-x-2 text-xs">
            <p>Pending Requests</p>
            <EastOutlined fontSize="inherit" />
          </div>
          <p className="text-lg font-semibold">20</p>
        </div>
      </div>

      <div className=" my-5 w-full h-full ">
        <div className="flex items-center space-x-4 px-5 mb-5">
          <h1 className="font-bold">Explore Attendees</h1>
          <div className="text-grey border border-grey flex items-center space-x-1 rounded-full text-[10px] px-2 py-1">
            <ReplayOutlined color="inherit" fontSize="inherit" />
            <p>Refresh</p>
          </div>
        </div>

        {isLoading ? (
          <div className="w-full h-full flex justify-center">
            <LoadingComp />
          </div>
        ) : (
          <Swiper spaceBetween={10} slidesPerView={1.1} centeredSlides={true}>
            <SwiperSlide key={10}>
              <ConnectCard
                name={"Ronak Paul"}
                interests={["🤖 AI & Automation", "📟 Smart Devices"]}
                id={"sga"}
              />
            </SwiperSlide>
            {users?.map((user) => (
              <SwiperSlide key={user._id}>
                <ConnectCard
                  name={user.name}
                  interests={user.interests}
                  id={user._id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default ConnectPage;
