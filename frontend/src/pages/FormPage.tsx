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
import { ArrowBack } from "@mui/icons-material";
import { useSnackbar } from "../hooks/SnackbarContext";
import LoadingComp from "../components/loading/LoadingComp";

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
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("MALE");

  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserFetching, setIsUserFetching] = useState<boolean>(false);

  const fetchUser = async () => {
    setIsUserFetching(true);
    try {
      const response = await userApi.get("/user/");

      if (response.status == 200) {
        showSnackbar("Already form is filled", "info");
        navigate(`/connect/${eventId}`);
      }
    } catch (e) {}

    setIsUserFetching(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const submitForm = async () => {
    if (!eventId) {
      showSnackbar("Invalid form", "error");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await userApi.post("/user/create", {
        data: {
          name,
          email,
          eventId,
          gender,
          interests: selectedInterests,
          contactNumber: phoneNumber,
          profession,
          company: companyName,
        },
      });

      console.log(response);
    } catch (e) {}

    setIsLoading(false);
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

  const backForm = () => {
    const formsContainerElement = formsContainerRef.current;

    if (!formsContainerElement) return;

    if (currentFormIndex != 0) setCurrentFormIndex((index) => index - 1);
  };

  if (isUserFetching) {
    return (
      <div className="w-full h-full bg-gradient-to-r from-[#E5E7FF] to-[#FCF1E3] flex items-center justify-center">
        <LoadingComp />
      </div>
    );
  } else {
    return (
      <div className="w-full h-full bg-gradient-to-r from-[#E5E7FF] to-[#FCF1E3] relative">
        <div className="w-full h-[4px]">
          <div
            className={`transition-all h-full bg-gradient-to-r from-blue-500 to-pink-400`}
            style={{
              width: formCompletionPercentage + "%",
            }}
          ></div>
        </div>

        <div className="mt-10 w-full px-4">
          {currentFormIndex != 0 && (
            <div className="my-7 text-2xl">
              <ArrowBack fontSize="inherit" onClick={backForm} />
            </div>
          )}

          <div
            ref={formsContainerRef}
            className="w-full h-screen flex flex-col flex-nowrap overflow-y-hidden"
          >
            <FormSectionIntro />
            <FormSection1 name={name} setName={setName} />
            <FormSection2 setSelectedInterests={setSelectedInterests} />
            <FormSection3
              profession={profession}
              setProfession={setProfession}
            />
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
            {currentFormIndex == 0 ? (
              "Let's go!"
            ) : currentFormIndex == 7 ? (
              isLoading ? (
                <div className="flex justify-center">
                  <LoadingComp color="white" />
                </div>
              ) : (
                "Finish"
              )
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    );
  }
};

export default FormPage;
