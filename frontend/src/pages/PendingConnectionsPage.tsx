import { ChevronRightOutlined } from "@mui/icons-material";
import avatarProfile from "../assets/tempProfile.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router-dom";

const ConnectionRequestCard = () => {
  const interests = ["Science & Technology", "AI & ML", "Business"];

  return (
    <div className="w-full h-[700px] py-3 rounded-xl flex flex-col justify-between  bg-blue-400 flex-shrink-0">
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

        <div className="my-3">
          <h2 className="text-2xl text-white leading-normal">
            Looking for Software Developers, Designers, Game Developer
          </h2>
        </div>

        <div className="w-full space-y-2">
          <p className="text-lg text-white text-center">Note</p>
          <div className="w-full h-[150px] bg-gradient-to-r from-[#E5E7FF] to-[#FCF1E3] rounded-xl overflow-y-scroll px-2 py-3 text-lg text-center">
            hii, I want to connect with a experianced developer for my new
            startup which focuses on AI models and developer tools
          </div>
        </div>
      </div>

      <div className=" w-full h-fit flex flex-col justify-center items-center  space-y-2">
        <button className="  bg-blue-600  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl">
          Connect Now
        </button>
        <button className="  bg-red-700  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl">
          Remove
        </button>
      </div>
    </div>
  );
};

const PendingConnectionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="px-3 h-full overflow-y-scroll">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Connections{" "}
          <span className="text-blue-600 text-sm ml-2">( 100 )</span>
        </h1>

        <div
          onClick={() => navigate("/connections/all")}
          className="flex items-center space-x-2 text-blue-500"
        >
          <p>Show all</p>
          <ChevronRightOutlined />
        </div>
      </div>
      <div className="my-7">
        <h2 className="text-xl font-medium">
          Pending <span className="text-blue-600 text-sm ml-2">( 5 )</span>
        </h2>
        <div className="my-5 w-full">
          <Swiper spaceBetween={50} slidesPerView={1}>
            <SwiperSlide>
              <ConnectionRequestCard />
            </SwiperSlide>
            <SwiperSlide>
              <ConnectionRequestCard />
            </SwiperSlide>
            <SwiperSlide>
              <ConnectionRequestCard />
            </SwiperSlide>
            <SwiperSlide>
              <ConnectionRequestCard />
            </SwiperSlide>
            <SwiperSlide>
              <ConnectionRequestCard />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PendingConnectionsPage;
