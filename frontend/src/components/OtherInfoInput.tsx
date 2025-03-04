import { Icon } from "@iconify/react";
import CustomButton from "./CustomButton";

const OtherInfoInput = ({
  heading,
  closeModal,
  value,
  setValue,
  placeholder,
  addFunc,
}: {
  heading: string;
  closeModal: Function;
  value: string;
  placeholder: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  addFunc: Function;
}) => {
  return (
    <div className="w-full h-fit flex flex-col flex-1 rounded-lg bg-whiteBG px-4 py-5 space-y-3">
      <div className="flex items-center justify-between text-darkBg font-medium">
        <div></div>
        <p>{heading}</p>
        <Icon
          onClick={() => closeModal()}
          icon={"material-symbols:close-rounded"}
        />
      </div>

      <div className="flex flex-col py-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 border bg-transparent border-[#E1E1E1] placeholder:text-[#7D7D7D] text-darkBg font-medium rounded-md resize-none"
        ></textarea>
      </div>

      <div className="flex flex-col space-y-3">
        <CustomButton
          text="Add"
          onClick={() => {
            addFunc();
            closeModal();
          }}
          width="100%"
        />
        <CustomButton
          text="Cancel"
          onClick={() => {
            closeModal();
            setValue("");
          }}
          width="100%"
          type="outlined"
        />
      </div>
    </div>
  );
};

export default OtherInfoInput;
