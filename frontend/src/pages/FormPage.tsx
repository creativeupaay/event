import { useEffect, useRef, useState } from "react";
import FormSection1 from "../components/formSections/FormSection1";
import FormSectionIntro from "../components/formSections/FormSectionIntro";
import FormSection2 from "../components/formSections/FormSection2";
import FormSection3 from "../components/formSections/FormSection3";
import FormSection4 from "../components/formSections/FormSection4";
import { useNavigate } from "react-router-dom";

const FormPage = () => {
  const formsContainerRef = useRef<HTMLDivElement>(null);
  const [currentFormIndex, setCurrentFormIndex] = useState<number>(0);
  const [formCompletionPercentage, setFormCompletionPercentage] =
    useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const formsContainerElement = formsContainerRef.current;

    if (!formsContainerElement) return;

    const HEIGHT = formsContainerElement.offsetHeight * currentFormIndex;

    formsContainerElement.scrollTo({
      behavior: "smooth",
      top: HEIGHT,
    });

    const percent =
      ((currentFormIndex + 1) / formsContainerElement.childElementCount) * 100;
    console.log(percent);
    setFormCompletionPercentage(percent);
  }, [currentFormIndex]);

  const nextForm = () => {
    const formsContainerElement = formsContainerRef.current;

    if (!formsContainerElement) return;

    if (currentFormIndex != formsContainerElement.childElementCount - 1)
      setCurrentFormIndex((index) => index + 1);
    else {
      navigate("/home");
    }
  };

  return (
    <div className="w-full h-screen absolute top-0 left-0 bg-gradient-to-r from-[#E5E7FF] to-[#FCF1E3]">
      <div className="w-full h-[4px] mt-16 ">
        <div
          className={`transition-all h-full bg-gradient-to-r from-blue-500 to-pink-400`}
          style={{
            width: formCompletionPercentage + "%",
          }}
        ></div>
      </div>

      <div className="mt-16 w-full px-4">
        <div
          ref={formsContainerRef}
          className="w-full h-screen flex flex-col flex-nowrap overflow-y-hidden"
        >
          <FormSectionIntro />
          <FormSection1 />
          <FormSection2 />
          <FormSection3 />
          <FormSection4 />
        </div>
      </div>

      <div className="absolute bottom-5 left-0 w-full flex justify-center">
        <button
          onClick={nextForm}
          className="bg-blue-600 mt-7 font-semibold text-white px-3 py-2 rounded-md w-[95%] text-xl"
        >
          {currentFormIndex == 0
            ? "Let's go!"
            : currentFormIndex == 4
            ? "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default FormPage;
