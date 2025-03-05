import { useNavigate, useParams } from "react-router-dom";
import userApi from "../apis/userApi";
import { useSnackbar } from "../hooks/SnackbarContext";
import { useEffect } from "react";

const QRConnecting = () => {
  const { friendId } = useParams();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const connect = async () => {
    try {
      const res = await userApi.post(
        `/user/friend-management/quick-add-friend?friendId=${friendId}`
      );

      if (res.status == 200) {
        navigate(`/profile/${friendId}`);
        showSnackbar("You are now connected", "success");
      }
    } catch (e) {
      showSnackbar("Error in connecting", "error");
    }

    navigate(`/connect/${localStorage.getItem("currentEventId")}`);
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        height: innerHeight,
      }}
    >
      <p className="text-darkBg">Connecting...</p>
    </div>
  );
};

export default QRConnecting;
