import { ChevronRight } from "@mui/icons-material";
import avatarGroups from "../assets/avatarGroups.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import avatarProfile from "../assets/tempProfile.svg";
import { useNavigate } from "react-router-dom";

const ConnectCard = () => {
  const interests = ["Science & Technology", "AI & ML", "Business"];

  return (
    <div className="w-full h-[650px] py-3 rounded-xl flex flex-col justify-between  bg-blue-400 flex-shrink-0">
      <div className="px-3 py-2">
        <div className="flex items-center ">
          <img
            src={avatarProfile}
            alt="Profile pic"
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col ml-3 ">
            <h1 className="text-3xl text-white font-medium">Ronak Paul</h1>
            <p className="text-white">Software Developer</p>
          </div>
        </div>

        <div className="my-8 flex flex-wrap gap-3">
          {interests.map((label, index) => (
            <div
              key={index}
              className={`  bg-blue-200
               w-fit px-3 py-2 rounded-full transition-transform active:scale-95`}
            >
              <p className="text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xl text-white">
            <span className="font-bold">Industry:</span>
            <span className="text-lg ml-3"> Tech Industry</span>
          </p>
          <p className="text-xl text-white">
            <span className="font-bold">Company:</span>
            <span className="text-lg ml-3">Creative Upaay</span>
          </p>
        </div>

        <div className="my-6">
          <h2 className="text-2xl text-white leading-normal">
            Looking for Software Developers, Designers, Game Developer
          </h2>
        </div>
      </div>

      <div className=" w-full h-fit flex flex-col justify-center items-center  space-y-7">
        <button className="  bg-amber-500  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl">
          Connect with a video <span className="ml-2">📹</span>
        </button>
        <button className="  bg-blue-600  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl">
          Connect with a note <span className="ml-2">🖊️</span>
        </button>
      </div>
    </div>
  );
};

// This is the page where the user can make connection by swapping left or right
const ConnectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-3 h-full">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <img src={avatarGroups} alt="avatar groups" />
          <p className="text-lg font-semibold ml-3 text-blue-600">12+</p>
        </div>

        <button
          onClick={() => navigate("/connections/pending")}
          className="flex items-center text-blue-600"
        >
          <p>Show All</p>
          <ChevronRight />
        </button>
      </div>

      <div className=" mt-16 h-full">
        <Swiper spaceBetween={50} slidesPerView={1}>
          <SwiperSlide>
            <ConnectCard />
          </SwiperSlide>
          <SwiperSlide>
            <ConnectCard />
          </SwiperSlide>
          <SwiperSlide>
            <ConnectCard />
          </SwiperSlide>
          <SwiperSlide>
            <ConnectCard />
          </SwiperSlide>
          <SwiperSlide>
            <ConnectCard />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ConnectPage;
