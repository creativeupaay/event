import { EastOutlined, ReplayOutlined } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../apis/userApi";
import { userI } from "../types/userTypes";
import ConnectCard from "../components/ConnectCard";
import OfferBanner from "../components/OfferBanner";
import { Icon } from "@iconify/react";
import { CircularProgress, Modal } from "@mui/material";
import FilterComp, { filterI } from "../components/FilterComp";
// import AdCard from "../components/AdCard";
import { useUser } from "../hooks/UserContext";

// This is the page where the user can make connection by swapping left or right
const ConnectPage = () => {
  const navigate = useNavigate();

  const { eventId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<userI[]>([]);

  const { user } = useUser();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<filterI>({
    workStatus: [],
    industries: [],
    lookingFor: [],
  });

  const fetchEventGuests = async () => {
    setIsLoading(true);

    try {
      const response = await userApi.get(
        `/user/events/get-all-event-Guest?eventId=${eventId}&limit=20&cursor=`,
        {
          params: {
            selectedInterest: filters.lookingFor,
            position: filters.workStatus[0],
            industries: filters.industries[0],
          },
        }
      );

      if (response.status == 200) {
        const data = response.data.eventGuests;

        setUsers(data);
      }
    } catch (e) {}

    setIsLoading(false);
  };

  useEffect(() => {
    fetchEventGuests();
  }, []);

  return (
    <div className="w-full h-full flex flex-col flex-1 relative">
      <Modal open={isFilterModalOpen}>
        <div className="w-full h-full px-2 flex items-center">
          <FilterComp
            setIsFilterModalOpen={setIsFilterModalOpen}
            filters={filters}
            setFilters={setFilters}
            applyFilters={() => fetchEventGuests()}
          />
        </div>
      </Modal>

      <OfferBanner />
      <div className="flex-[0.05] px-5 flex items-center justify-between py-2">
        <div
          onClick={() => navigate("/requests/sent")}
          className="active:bg-grey01"
        >
          <div className="flex items-center space-x-2 text-xs text-darkBg">
            <p>Requests sent ({user?.requestSent})</p>
            <EastOutlined fontSize="inherit" color="inherit" />
          </div>
        </div>
        <div className="w-[1px] h-5 bg-black"></div>
        <div
          onClick={() => navigate("/requests/received")}
          className="active:bg-grey01"
        >
          <div className="flex items-center space-x-2 text-xs text-darkBg">
            <p>Requests Received ({user?.requestReceived})</p>
            <EastOutlined fontSize="inherit" color="inherit" />
          </div>
        </div>
      </div>

      <div className="flex-[0.95] my-5 w-full h-full overflow-y-scroll no-scrollbar">
        <div className="flex items-center justify-between px-5 mb-5">
          <div className="flex items-center space-x-4">
            <h1 className="font-bold">Explore Attendees</h1>
            <div
              onClick={() => fetchEventGuests()}
              className="text-grey border border-grey flex items-center space-x-1 rounded-full text-[10px] px-2 py-1 active:scale-95 transition-transform"
            >
              <ReplayOutlined color="inherit" fontSize="inherit" />
              <p>Refresh</p>
            </div>
          </div>

          <div
            className="w-fit h-fit"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Icon icon="proicons:filter-2" width="16" height="16" />
          </div>
        </div>

        {isLoading ? (
          <div className="w-full h-full flex py-14 justify-center">
            <CircularProgress size={"20px"} />
          </div>
        ) : (
          <Swiper spaceBetween={10} slidesPerView={1.1} centeredSlides={true}>
            {/* <SwiperSlide>
              <AdCard>
                <p>
                  Break a samosa, not a connection!{" "}
                  <span className="text-primary">
                    Keep sending those requests!
                  </span>
                </p>
              </AdCard>
            </SwiperSlide> */}
            {users?.map((user) => (
              <SwiperSlide key={user._id}>
                <ConnectCard
                  name={user.name}
                  interests={user.interests}
                  id={user._id}
                  lookingFor={user.lookingFor}
                  profession={user.profession}
                  position={user.position}
                  company={user.company}
                  courseName={user.courseName}
                  instituteName={user.instituteName}
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
