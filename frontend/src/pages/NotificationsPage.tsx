import { Icon } from "@iconify/react";
import OfferBanner from "../components/OfferBanner";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ActivityCard = ({
  type,
  name,
}: {
  type: "Note" | "Video";
  name: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <Icon
          icon={type == "Note" ? "proicons:note" : "proicons:video"}
          fontSize={"20px"}
        />
        <p className="text-sm font-bold text-darkBg">{name}</p>
      </div>
      <p className="text-sm text-grey">accepted your {type} request.</p>
    </div>
  );
};

const NotificatonsPage = () => {
  const navigate = useNavigate();

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
          <p className="font-medium">Notifications</p>
        </div>
      </div>
      <OfferBanner />

      <div className="w-full h-full flex flex-col py-4 px-4">
        <div>
          <div className="flex items-center space-x-2">
            <Icon icon={"hugeicons:activity-01"} fontSize={"22px"} />
            <p className="text-sm font-medium text-darkBg">Activity</p>
          </div>

          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <ActivityCard key={num} type="Note" name="Ronak Paul" />
            ))}

            <div className="flex items-center justify-center space-x-3">
              <p className="text-xs text-grey">View All</p>
              <Icon
                icon="tabler:chevron-down"
                fontSize={"16px"}
                className="text-grey"
              />
            </div>
          </div>
        </div>

        <div className="mt-9 space-y-4">
          {/* Video Requests */}
          <Accordion
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
                padding: "0px",
              }}
            >
              <div className="flex items-center space-x-2">
                <Icon icon={"proicons:video"} fontSize={"20px"} />
                <p>Video Requests</p>
              </div>
            </AccordionSummary>

            <AccordionDetails></AccordionDetails>
          </Accordion>

          {/* Note Requests */}
          <Accordion
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
                padding: "0px",
              }}
            >
              <div className="flex items-center space-x-2">
                <Icon icon={"proicons:note"} fontSize={"20px"} />
                <p>Note Requests</p>
              </div>
            </AccordionSummary>

            <AccordionDetails></AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default NotificatonsPage;
