import {
  ChevronRight,
  Close,
  DoneRounded,
  FiberPinSharp,
} from "@mui/icons-material";
import avatarGroups from "../assets/avatarGroups.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import avatarProfile from "../assets/tempProfile.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import userApi from "../apis/userApi";
import { userI } from "../types/userTypes";
import LoadingComp from "../components/loading/LoadingComp";
import { useSnackbar } from "../hooks/SnackbarContext";

const VideoPreview = ({
  stream,
  startRecording,
  stopRecording,
  mediaBlobUrl,
  status,
}: {
  stream: MediaStream | null;
  startRecording: Function;
  stopRecording: Function;
  mediaBlobUrl: string | undefined;
  status: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    let interval: number;

    if (timer < 30) {
      interval = setTimeout(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const streamToCanvas = () => {
    if (!(canvasRef.current && videoRef.current)) return;

    const canvasW = 410;
    const canvasH = 410;
    const ctx = canvasRef.current.getContext("2d");

    ctx?.clearRect(0, 0, canvasW, canvasH);

    const videoAspectRatio = canvasW / videoRef.current.clientHeight;
    const canvasAspectRatio = canvasW / canvasH;

    let width, height, offX, offY;

    // Scale the video to fit within the canvas dimensions
    if (videoAspectRatio > canvasAspectRatio) {
      // Video is wider than the canvas, fit by height
      height = canvasH;
      width = canvasW * videoAspectRatio;
      offX = (canvasW - width) / 2;
      offY = 0;
    } else {
      // Video is taller than the canvas, fit by width
      width = canvasH;
      height = canvasW / videoAspectRatio;
      offX = 0;
      offY = (canvasH - height) / 2;
    }

    ctx?.drawImage(videoRef.current, offX, offY, width, height);

    requestAnimationFrame(streamToCanvas);
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    requestAnimationFrame(streamToCanvas);
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute left-0 top-0 -z-10 opacity-0"
        autoPlay
      />

      {/* Recorded video preview */}
      {status == "stopped" && (
        <video
          src={mediaBlobUrl}
          className="absolute left-0 top-0 z-10"
          autoPlay
          controls
        />
      )}

      <video className="absolute left-0 top-0 z-10" />
      <div className="relative">
        <div className="absolute top-3 right-3 bg-white rounded-full px-5">
          <p className="text-blue-600">{timer}/30s</p>
        </div>
        <div className="absolute right-3 bottom-3 text-center flex items-center space-x-3">
          <div
            className=" text-5xl bg-blue-100 flex items-center justify-center rounded-full text-blue-600"
            onClick={() => {
              stopRecording();
            }}
          >
            <FiberPinSharp />
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={"380px"}
          height={"410px"}
          className="rounded-md"
        ></canvas>
      </div>
    </>
  );
};

const ConnectCard = ({
  name,
  interests,
  id,
}: {
  name: string;
  interests: string[];
  id: string;
}) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [note, setNote] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar();

  const sendConnectionRequest = async () => {
    if (!note) {
      showSnackbar("Please provide a note", "warning");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await userApi.post(
        "user/friend-management/friend-request-Sent",
        {
          data: {
            recieverId: id,
            note,
          },
        }
      );

      console.log(response);

      if (response.status == 200) {
        setIsNoteModalOpen(false);
        setIsConnected(true);
      }
    } catch (e) {
      showSnackbar("Error in connecting", "error");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full h-[650px] py-3 rounded-xl flex flex-col justify-between  bg-blue-400 flex-shrink-0 relative">
      <div className="px-3 py-2">
        <div className="flex items-center ">
          <img
            src={avatarProfile}
            alt="Profile pic"
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col ml-3 ">
            <h1 className="text-3xl text-white font-medium">{name}</h1>
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
          <h2 className="text-xl text-white leading-normal">
            Looking for Software Developers, Designers, Game Developer
          </h2>
        </div>
      </div>
      {!isConnected ? (
        <div className=" w-full h-fit flex flex-col justify-center items-center  space-y-7">
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="  bg-amber-500  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl"
          >
            Connect with a video <span className="ml-2">📹</span>
          </button>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="  bg-blue-600  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl"
          >
            Connect with a note <span className="ml-2">🖊️</span>
          </button>
        </div>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="text-7xl bg-white flex items-center justify-center rounded-full px-3 py-3">
            <DoneRounded fontSize="inherit" />
          </div>
        </div>
      )}

      {/* Note given feature */}
      {isNoteModalOpen && (
        <div className="absolute w-full h-full top-0 backdrop-blur-sm left-0 flex items-center justify-center">
          <div className="w-[95%] h-[300px] bg-white rounded-xl flex flex-col items-center justify-between px-4 py-4">
            <div className="w-full flex justify-end text-blue-600">
              <Close onClick={() => setIsNoteModalOpen(false)} />
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-[220px] outline-none text-lg"
              placeholder="Write the note here..."
            />
            <button
              onClick={sendConnectionRequest}
              className="  bg-blue-600  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <LoadingComp color="white" />
                </div>
              ) : (
                "Connect"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Video recording modal */}
      {isVideoModalOpen && (
        <div className="absolute w-full h-full top-0 backdrop-blur-sm left-0 flex items-center justify-center">
          <div className="w-[95%] h-[550px] bg-white rounded-xl flex flex-col items-center justify-between px-4 py-4">
            <div className="w-full flex justify-end text-blue-600">
              <Close onClick={() => setIsVideoModalOpen(false)} />
            </div>
            <div className="w-full space-y-3 mt-2">
              <ReactMediaRecorder
                askPermissionOnMount
                video
                render={({
                  status,
                  previewStream,
                  startRecording,
                  stopRecording,
                  mediaBlobUrl,
                }) => {
                  console.log(status);
                  console.log(mediaBlobUrl);
                  return (
                    <VideoPreview
                      status={status}
                      stream={previewStream}
                      startRecording={startRecording}
                      stopRecording={stopRecording}
                      mediaBlobUrl={mediaBlobUrl}
                    />
                  );
                }}
              />

              <button className="  bg-blue-600  font-semibold text-white px-3 py-3 rounded-full w-[95%] text-xl">
                Connect Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
      <div className=" px-3 flex items-center justify-between py-2">
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

      <div className=" mt-16 w-full h-full ">
        {isLoading ? (
          <div className="w-full h-full flex justify-center">
            <LoadingComp />
          </div>
        ) : (
          <Swiper spaceBetween={10} slidesPerView={1.1} centeredSlides={true}>
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
