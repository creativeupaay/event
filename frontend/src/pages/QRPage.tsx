import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useUser } from "../hooks/UserContext";

const QRPage = () => {
  const navigate = useNavigate();

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const { user } = useUser();

  const [scannedURL, setScannerURL] = useState<string>("");

  useEffect(() => {
    if (scannedURL) window.location.href = scannedURL;
  }, [scannedURL]);

  return (
    <div
      className="w-full  flex flex-col flex-1"
      style={{
        height: innerHeight,
      }}
    >
      <div className="flex-[0.08] h-full bg-grey01 px-3 flex items-center">
        <div className="text-darkBg space-x-3 flex items-center">
          <Icon
            onClick={() => navigate(-1)}
            icon="proicons:arrow-left"
            width="24"
            height="24"
          />
          <p className="font-medium">Scan QR</p>
        </div>
      </div>

      <div className="flex-[0.92] flex flex-col w-full h-full items-center justify-center">
        {isScannerOpen ? (
          <div className="w-[300px] h-[300px]">
            <Scanner
              onScan={(result) => {
                console.log(result);
                setScannerURL(result[0].rawValue);
              }}
            />
          </div>
        ) : (
          <div className="flex-[0.7] w-full flex justify-center items-center">
            <div className="w-[87%] h-fit flex flex-col items-center space-y-5 bg-[linear-gradient(0deg,_#F1ADAD_29%,_#FFDCC6_100%)] rounded-xl py-5">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-darkBg">{user?.name}</h1>
                <p className="text-xs text-grey">{user?.position}</p>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <QRCode
                  value={`${location.protocol}//${location.host}/qr-connect/${user?._id}`}
                  size={220}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-[0.3] w-full flex justify-center items-center">
        <CustomButton
          text={isScannerOpen ? "Show QR" : "Scan QR"}
          onClick={() => {
            setIsScannerOpen(!isScannerOpen);
          }}
        />
      </div>
    </div>
  );
};

export default QRPage;
