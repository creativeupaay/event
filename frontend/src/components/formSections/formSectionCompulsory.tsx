import {
  CheckCircleOutline,
  ChevronLeft,
  EastOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/SnackbarContext";
import { Icon } from "@iconify/react";
import { Modal } from "@mui/material";
import OtherInfoInput from "../OtherInfoInput";

const Option = ({
  label,
  setSelectedOptions,
}: {
  label: string;
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (isSelected) {
      setSelectedOptions((options) => {
        const temp = [...options];
        temp.push(label);
        return temp;
      });
    } else {
      setSelectedOptions((options) => options.filter((text) => text !== label));
    }
  }, [isSelected]);

  return (
    <div
      onClick={() => setIsSelected(!isSelected)}
      className={`w-full flex items-center space-x-2 h-fit bg-transparent border border-white text-base text-white font-light py-3 px-3 rounded-lg ${
        isSelected ? "opacity-100" : "opacity-60"
      } `}
    >
      <CheckCircleOutline fontSize="inherit" color="inherit" />
      <p>{label}</p>
    </div>
  );
};

// A compulsory form section at the last of the form
const FormSectionCompulsory = ({
  helps,
  setHelps,
  backForm,
  nextForm,
}: {
  helps: string[];
  setHelps: React.Dispatch<React.SetStateAction<string[]>>;
  backForm: Function;
  nextForm: Function;
}) => {
  const { showSnackbar } = useSnackbar();

  const [isOtherHelpModalOpen, setIsOtherHelpModalOpen] =
    useState<boolean>(false);

  const [otherHelp, setOtherHelp] = useState<string>("");

  // storing all other added helps
  const [otherHelps, setOtherHelps] = useState<string[]>([]);

  return (
    <div
      className={`w-full h-full flex-shrink-0 px-3 relative`}
      // style={{
      //   height: innerHeight,
      // }}
    >
      <Modal open={isOtherHelpModalOpen}>
        <div className="w-full h-full px-2 flex items-center">
          <OtherInfoInput
            heading="I also need help with"
            closeModal={() => setIsOtherHelpModalOpen(false)}
            placeholder="Let us know what you need help with!"
            value={otherHelp}
            setValue={setOtherHelp}
            addFunc={() => {
              if (otherHelp) setOtherHelps((data) => [...data, otherHelp]);
              setOtherHelp("");
            }}
          />
        </div>
      </Modal>

      <div className="w-full grid grid-cols-3 grid-rows-1 py-3 gap-3 [&>*]:bg-darkBg [&>*]:h-1  [&>*]:rounded-full ">
        <div className="opacity-100"></div>
        <div className="opacity-100"></div>
        <div className="opacity-100"></div>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <div
            onClick={() => backForm()}
            className="flex items-center space-x-1 text-xs text-grey cursor-pointer"
          >
            <ChevronLeft fontSize="inherit" color="inherit" />
            <p>Back</p>
          </div>

          <div
            onClick={() => nextForm(true)}
            className="text-xs w-fit text-grey"
          >
            <p>Skip</p>
          </div>
        </div>

        <div className=" mt-10 w-full h-fit flex flex-col items-center bg-primary rounded-lg px-4 py-5">
          <h1 className="text-white text-xl font-bold">
            I also need help with
          </h1>

          <div className="flex flex-col items-center w-full space-y-3 mt-7">
            <Option label="Website Development" setSelectedOptions={setHelps} />
            <Option
              label="Mobile App Development"
              setSelectedOptions={setHelps}
            />
            <Option
              label="Custom Web App Development"
              setSelectedOptions={setHelps}
            />
            <Option label="UI/UX Designing" setSelectedOptions={setHelps} />
            <Option label="Graphic Designing" setSelectedOptions={setHelps} />

            {otherHelps.map((help, index) => (
              <Option key={index} label={help} setSelectedOptions={setHelps} />
            ))}

            <div
              onClick={() => setIsOtherHelpModalOpen(true)}
              className={`w-full flex items-center space-x-2 h-fit bg-transparent border border-white text-base text-white font-light py-3 px-3 rounded-lg opacity-60
              `}
            >
              <Icon
                icon="material-symbols-light:add-circle-outline-rounded"
                fontSize="20px"
              />
              <p>Other</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (helps.length != 0) nextForm();
              else showSnackbar("Please select a option or skip", "warning");
            }}
            className={`bg-darkBg mt-4 font-bold text-white py-4 rounded-md w-full text-xs flex items-center justify-center space-x-2 ${
              helps.length == 0 ? "opacity-60" : "opacity-100"
            }`}
          >
            <p>Let's start networking</p>
            <EastOutlined fontSize="inherit" color="inherit" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSectionCompulsory;
