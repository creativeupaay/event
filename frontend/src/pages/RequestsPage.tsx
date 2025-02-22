import { Icon } from "@iconify/react";
import OfferBanner from "../components/OfferBanner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
// import videoTestImg from "../assets/test-video-image.png";
import userApi from "../apis/userApi";
import { useSnackbar } from "../hooks/SnackbarContext";

// const VideoCard = () => {
//   return (
//     <div className="flex flex-col w-28 h-fit flex-shrink-0 mx-1">
//       <div className="w-full h-48 rounded-lg">
//         <img
//           src={videoTestImg}
//           alt="video test image"
//           className="w-full h-full object-cover rounded-lg"
//         />
//       </div>

//       <div className="flex flex-col space-y-[1px] mt-1">
//         <p className="text-xs font-bold">Ronak Paul</p>
//         <p className="text-[10px] text-grey">Founder</p>
//       </div>
//     </div>
//   );
// };

const NoteCard = ({
  senderId,
  name,
  note,
}: {
  senderId: string;
  name: string;
  note: string;
}) => {
  const { showSnackbar } = useSnackbar();
  const acceptRejectRequest = async (status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await userApi.post(
        `/user/friend-management/accept-reject-friend-request?senderId=${senderId}&status=${status}`
      );

      if (res.status == 200) {
        if (status == "ACCEPTED")
          showSnackbar("Request is accepted successfully", "success");
        else if (status == "REJECTED")
          showSnackbar("Request is rejected successfully", "success");
      }
    } catch (e) {
      showSnackbar("Error in accepting request", "error");
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* left section */}
      <div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-bold text-darkBg">{name}</p>
          <p className="text-xs text-grey">Freelancer</p>
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-grey">“{note}...”</p>
          <p className="text-xs text-grey">12 min. ago</p>
        </div>
      </div>

      {/* right section */}
      <div className="flex items-center space-x-2">
        <div
          onClick={() => acceptRejectRequest("ACCEPTED")}
          className="border border-darkBg bg-darkBg px-2 py-2 rounded-xl text-white"
        >
          <Icon icon={"material-symbols:done-rounded"} fontSize={"16px"} />
        </div>
        <div
          onClick={() => acceptRejectRequest("REJECTED")}
          className="border border-darkBg text-darkBg px-2 py-2 rounded-xl"
        >
          <Icon icon={"material-symbols:close-rounded"} fontSize={"16px"} />
        </div>
      </div>
    </div>
  );
};

interface UserConnectionI {
  name: string;
  email: string;
  note: string;
  video: string;
  senderId: string;
  receiverId: string;
  interest: string[];
}

const RequestsPage = () => {
  const navigate = useNavigate();
  const { rtype } = useParams();

  const [currentTab, setCurrentTab] = useState<"received" | "sent">("received");

  const [_isVideoSectionExpanded, setIsVideoSectionExpanded] =
    useState<boolean>(false);

  const [isNoteSectionExpanded, setIsNoteSectionExpanded] =
    useState<boolean>(true);

  const [pendingRequests, setPendingRequests] = useState<UserConnectionI[]>([]);
  const [noteRequestsSent, setNoteRequestsSent] = useState<UserConnectionI[]>(
    []
  );

  const fetchPendingRequests = async () => {
    try {
      const response = await userApi.get(
        "/user/friend-management/request-recieved"
      );

      if (response.status == 200) {
        setPendingRequests(response.data.data);
      }
    } catch (e) {}
  };

  const fetchRequestsSent = async () => {
    try {
      const response = await userApi.get(
        "/user/friend-management/request-sended"
      );

      if (response.status == 200) setNoteRequestsSent(response.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchRequestsSent();
  }, []);

  useEffect(() => {
    // setting the current tab from the url param
    if (rtype) setCurrentTab(rtype as "received" | "sent");
  }, []);

  return (
    <div className="w-full h-full">
      <div className="bg-grey01 px-3 py-5">
        <div className="text-darkBg space-x-3 flex items-center">
          <Icon
            onClick={() => navigate(-1)}
            icon="proicons:arrow-left"
            width="24"
            height="24"
          />
          <p className="font-medium">Requests</p>
        </div>
      </div>
      <OfferBanner />

      <div className="py-4 h-full overflow-y-scroll">
        {/* Tabs */}
        <div className="flex items-center space-x-3 px-3">
          <div
            className={`border border-darkBg rounded-md px-2 py-1 ${
              currentTab != "received" && "opacity-50"
            }`}
            onClick={() => setCurrentTab("received")}
          >
            <p className="text-sm font-medium text-darkBg">Received</p>
          </div>

          <div
            className={`border border-darkBg rounded-md px-2 py-1 ${
              currentTab != "sent" && "opacity-50"
            }`}
            onClick={() => setCurrentTab("sent")}
          >
            <p className="text-sm font-medium text-darkBg">Sent</p>
          </div>
        </div>

        <div className="mt-3 space-y-4 pb-24">
          {/* Video Requests */}
          {/* <Accordion
            onChange={(_, isExpanded) => {
              setIsVideoSectionExpanded(isExpanded);
              setIsNoteSectionExpanded(false);
            }}
            expanded={isVideoSectionExpanded}
            sx={{
              border: "none",
              boxShadow: "none",
              padding: "0px",
              backgroundColor: "transparent",
            }}
          >
            <AccordionSummary
              expandIcon={
                <Icon icon={"tabler:chevron-down"} fontSize={"20px"} />
              }
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                padding: "0px 12px",
              }}
            >
              <div className="flex items-center space-x-2">
                <Icon icon={"proicons:video"} fontSize={"20px"} />
                <p>Video Requests {currentTab == "sent" && "Sent to"}</p>
              </div>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                padding: "0px 0px",
              }}
            >
              <div className="w-full flex items-center  overflow-x-scroll no-scrollbar">
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
              </div>
            </AccordionDetails>
          </Accordion> */}

          {/* Note Requests */}
          <Accordion
            onChange={(_, isExpanded) => {
              setIsNoteSectionExpanded(isExpanded);
              setIsVideoSectionExpanded(false);
            }}
            expanded={isNoteSectionExpanded}
            sx={{
              border: "none",
              boxShadow: "none",
              padding: "0px",
              backgroundColor: "transparent",
            }}
          >
            <AccordionSummary
              expandIcon={
                <Icon icon={"tabler:chevron-down"} fontSize={"20px"} />
              }
              aria-controls="panel2-content"
              id="panel2-header"
              sx={{
                padding: "0px 12px",
              }}
            >
              <div className="flex items-center space-x-2">
                <Icon icon={"proicons:note"} fontSize={"20px"} />
                <p>Note Requests {currentTab == "sent" && "Sent to"}</p>
              </div>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              <div className="w-full space-y-3">
                {currentTab == "sent"
                  ? noteRequestsSent.map((req, index) => (
                      <NoteCard
                        key={index}
                        senderId={req.receiverId}
                        name={req.name}
                        note={req.note}
                      />
                    ))
                  : pendingRequests.map((req, index) => (
                      <NoteCard
                        key={index}
                        senderId={req.receiverId}
                        name={req.name}
                        note={req.note}
                      />
                    ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
