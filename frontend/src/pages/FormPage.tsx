import { useEffect, useRef, useState } from "react";
import FormSection1 from "../components/formSections/FormSection1";
import FormSectionIntro from "../components/formSections/FormSectionIntro";
import FormSection2 from "../components/formSections/FormSection2";
import FormSection3 from "../components/formSections/FormSection3";
import FormSection4 from "../components/formSections/FormSection4";
import { useNavigate, useParams } from "react-router-dom";
import FormSection5 from "../components/formSections/FormSection5";
import FormSection6 from "../components/formSections/FormSection6";
import FormSection7 from "../components/formSections/FormSection7";
import userApi from "../apis/userApi";

const FormPage = () => {
  const formsContainerRef = useRef<HTMLDivElement>(null);
  const [currentFormIndex, setCurrentFormIndex] = useState<number>(0);
  const [formCompletionPercentage, setFormCompletionPercentage] =
    useState<number>(0);

  const { eventId } = useParams();

  const navigate = useNavigate();

  // User form filling details states
  const [name, setName] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profession, setProfession] = useState<string>("Software Engineer");
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [gender, setGender] = useState<string>("MALE");

  const submitForm = async () => {
    if (!eventId) return;

    try {
      const response = await userApi.post("/user/create", {
        data: {
          name,
          email,
          eventId,
          gender,
          interests: selectedInterests,
          contactNumber: phoneNumber,
        },
      });

      console.log(response);
    } catch (e) {}
  };

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
    setFormCompletionPercentage(percent);
  }, [currentFormIndex]);

  const nextForm = async () => {
    const formsContainerElement = formsContainerRef.current;

    if (!formsContainerElement) return;

    if (currentFormIndex != formsContainerElement.childElementCount - 1)
      setCurrentFormIndex((index) => index + 1);
    else {
      await submitForm();
      navigate(`/connect/${eventId}`);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-r from-[#E5E7FF] to-[#FCF1E3]">
      <div className="w-full h-[4px]">
        <div
          className={`transition-all h-full bg-gradient-to-r from-blue-500 to-pink-400`}
          style={{
            width: formCompletionPercentage + "%",
          }}
        ></div>
      </div>

      <div className="mt-10 w-full px-4">
        <div
          ref={formsContainerRef}
          className="w-full h-screen flex flex-col flex-nowrap overflow-y-hidden"
        >
          <FormSectionIntro />
          <FormSection1 name={name} setName={setName} />
          <FormSection2 setSelectedInterests={setSelectedInterests} />
          <FormSection3 profession={profession} setProfession={setProfession} />
          <FormSection4
            companyName={companyName}
            setCompanyName={setCompanyName}
          />

          <FormSection5 email={email} setEmail={setEmail} />
          <FormSection6
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
          <FormSection7 gender={gender} setGender={setGender} />
        </div>
      </div>

      <div className="absolute bottom-5 left-0 w-full flex justify-center">
        <button
          onClick={nextForm}
          className="bg-blue-600 mt-7 font-semibold text-white px-3 py-2 rounded-md w-[95%] text-xl"
        >
          {currentFormIndex == 0
            ? "Let's go!"
            : currentFormIndex == 7
            ? "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default FormPage;
