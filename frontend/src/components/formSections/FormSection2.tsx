import { useEffect, useState } from "react";
import demoInterestImage from "../../assets/demo-science.jpg";

const FormInterestBox = ({
  label,
  setSelectedInterests,
}: {
  label: string;
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (isSelected) {
      setSelectedInterests((interests) => {
        const temp = interests;
        temp.push(label);
        return temp;
      });
    } else {
      setSelectedInterests((interests) =>
        interests.filter((text) => text !== label)
      );
    }
  }, [isSelected]);

  return (
    <div
      onClick={() => {
        setIsSelected(!isSelected);
      }}
      className={` ${
        isSelected ? "bg-blue-600 text-white" : "bg-neutral-100"
      } w-32 h-40 px-3 py-2 rounded-md transition-transform active:scale-95 flex flex-col items-center justify-between space-y-3 text-center`}
    >
      <img
        src={demoInterestImage}
        alt=""
        className="w-14 h-14 object-cover rounded-full"
      />
      <p className=" font-medium">{label}</p>
    </div>
  );
};

const interests = [
  "AI & ML",
  "AI & ML",
  "AI & ML",
  "AI & ML",

  "Finance & FinTech",
  "E-Commerce",
  "Science & Technology",
  "Healthcare & Biotech",
  "Telecom & IoT",
];

// Form section to collect user interests
const FormSection2 = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  return (
    <div className="w-full h-screen flex-shrink-0">
      <h1 className="text-3xl font-medium">What are your interests ?</h1>

      <div className="w-full h-full pt-10 flex flex-wrap gap-3 justify-center overflow-hidden items-center">
        {interests.map((label, index) => (
          <FormInterestBox
            key={index}
            label={label}
            setSelectedInterests={setSelectedInterests}
          />
        ))}
      </div>
    </div>
  );
};

export default FormSection2;
