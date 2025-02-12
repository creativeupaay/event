import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "../hooks/SnackbarContext";
import userApi from "../apis/userApi";
import { ReactMediaRecorder } from "react-media-recorder";
import buildingIcon from "../assets/icons/buildingIcon.svg";
import { Close, DoneRounded, FiberPinSharp } from "@mui/icons-material";
import LoadingComp from "./loading/LoadingComp";
import suitcaseIcon from "../assets/icons/suitcaseIcon.svg";

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

const InfoSection = ({ heading, text }: { heading: string; text: string }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-1 h-8 bg-white rounded-r-lg"></div>

      <div>
        <div className="flex items-center space-x-2">
          <img src={suitcaseIcon} alt="suitcase icon" />
          <p className="text-xs font-extralight text-white">{heading}</p>
        </div>

        <p className="text-sm font-medium text-white">{text}</p>
      </div>
    </div>
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
    <div className="w-full h-fit rounded-xl flex flex-col justify-between bg-[linear-gradient(40deg,_#FFA469_42%,_#FF6B0B_100%)] flex-shrink-0 relative px-3 pb-3">
      <div className="bg-black w-fit px-3 py-1 rounded-b-md">
        <p className="text-white text-xs font-light">
          Employee | Full Stack Developer
        </p>
      </div>
      <div className="mt-5">
        <div className="flex items-center ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-xl text-white font-medium">{name}</h1>

            <InfoSection heading="Company" text="Cinnovate Solutions Pvt Ltd" />
          </div>
        </div>

        <div className="my-5 space-y-2">
          <div className="flex items-center">
            <img src={buildingIcon} alt="building icon" />
            <p className="text-xs font-extralight text-white">
              Belongs to industries like
            </p>
          </div>
          <div className=" flex flex-wrap gap-3">
            {interests.map((label, index) => (
              <div
                key={index}
                className={`border border-white
                 w-fit px-2 py-1 rounded-lg`}
              >
                <p className="text-sm text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-5">
          <p className="text-xs font-extralight text-white">
            Looking to connect with
          </p>
          <p className="text-sm font-medium text-white leading-normal">
            Software Developers, Designers, Game Developer
          </p>
        </div>
      </div>
      {!isConnected ? (
        <div>
          <p className="mb-2 text-black font-light text-xs">
            Request to connect
          </p>
          <div className=" w-full h-fit flex flex-col justify-center items-center  space-y-3">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="  bg-[#242424]  font-medium text-white px-3 py-3 rounded-lg w-full"
            >
              Via video note <span className="ml-2">📹</span>
            </button>
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="  bg-transparent  font-medium text-black px-3 py-3 rounded-lg w-full border border-black"
            >
              Via a text note <span className="ml-2">🖊️</span>
            </button>
          </div>
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

export default ConnectCard;
