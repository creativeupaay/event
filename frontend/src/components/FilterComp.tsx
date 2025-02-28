import { Icon } from "@iconify/react";
import CustomButton from "./CustomButton";
import { useState } from "react";

const Option = ({ label }: { label: string }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  return (
    <div
      onClick={() => setIsSelected(!isSelected)}
      className={`text-xs  px-3 py-2 rounded-full font-medium  ${
        isSelected ? "text-white bg-darkBg" : "bg-grey01 text-darkBg"
      } active:scale-95 transition-transform`}
    >
      {label}
    </div>
  );
};

const FilterComp = ({
  setIsFilterModalOpen,
}: {
  setIsFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="w-full h-[80%] flex flex-col flex-1 rounded-lg bg-white px-4 py-3">
      <div className="flex-[0.02] flex justify-end">
        <Icon
          onClick={() => setIsFilterModalOpen(false)}
          icon={"ph:x-bold"}
          fontSize={"20px"}
        />
      </div>

      {/* Middle filter section */}
      <div className="flex-[0.9] h-full w-full">
        <div className="flex items-center justify-between my-3">
          <h1 className="text-xl font-semibold text-darkBg">Filter</h1>
          <p className="text-primary text-sm font-medium">Reset all</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold text-grey">Work Status</p>

            <div className="flex items-center flex-wrap gap-3">
              {[
                "Employee",
                "Investor",
                "Founder",
                "Mentor",
                "Student",
                "Freelancer",
              ].map((label, index) => (
                <Option key={index} label={label} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold text-grey">Industries</p>
            <select className="w-full py-2 px-3 bg-transparent border border-grey01 rounded-lg outline-none text-grey text-sm">
              <option>Choose your preference</option>
              <option>AI</option>
              <option>Gaming</option>
              <option>AR/VR</option>
            </select>

            <div className="flex items-center flex-wrap gap-3">
              {["AI", "Gaming"].map((label, index) => (
                <div
                  key={index}
                  className="text-xs bg-grey01 px-3 py-2 rounded-full font-medium text-darkBg flex items-center space-x-4"
                >
                  <p>{label}</p> <Icon icon={"ph:x-bold"} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold text-grey">
              Looking to Connect with
            </p>
            <select className="w-full py-2 px-3 bg-transparent border border-grey01 rounded-lg outline-none text-grey text-sm">
              <option>Choose your preference</option>
              <option>AI</option>
              <option>Gaming</option>
              <option>AR/VR</option>
            </select>

            <div className="flex items-center flex-wrap gap-3">
              {["AI", "Gaming"].map((label, index) => (
                <div
                  key={index}
                  className="text-xs bg-grey01 px-3 py-2 rounded-full font-medium text-darkBg flex items-center space-x-4"
                >
                  <p>{label}</p> <Icon icon={"ph:x-bold"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Button apply filter button section */}
      <div className="flex-[0.08] w-full h-full ">
        <CustomButton text="Apply Filters" onClick={() => {}} width="100%" />
      </div>
    </div>
  );
};

export default FilterComp;
