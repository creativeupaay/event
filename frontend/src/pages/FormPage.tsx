import { useEffect, useRef, useState } from "react";
import FormSection1 from "../components/formSections/FormSection1";
import FormSectionIntro from "../components/formSections/FormSectionIntro";
import FormSection2 from "../components/formSections/FormSection2";
import { useNavigate, useParams } from "react-router-dom";
import userApi from "../apis/userApi";
import { useSnackbar } from "../hooks/SnackbarContext";
import LoadingComp from "../components/loading/LoadingComp";
import SplashScreen from "../components/SplashScreen";
import FormSectionCompulsory from "../components/formSections/formSectionCompulsory";
import FormSection3 from "../components/formSections/FormSection3";
import FormSection4 from "../components/formSections/FormSection4";
import FormSectionNonCompany from "../components/formSections/FormSectionNonCompany";

const FormPage = () => {
  const formsContainerRef = useRef<HTMLDivElement>(null);
  const [currentFormIndex, setCurrentFormIndex] = useState<number>(0);

  const { eventId } = useParams();

  const navigate = useNavigate();

  const [isSplashScreenOn, setIsSplashScreenOn] = useState<boolean>(true);

  // User form filling details states
  const [describedAs, setDescribedAs] = useState<string>("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [wantToNetworkWith, setWantToNetworkWith] = useState<string[]>([]);

  // For only students or freelancer i.e. who does not have any company
  const [bestDescribedAs, setBestDescribedAs] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // It is from the compulsory last form page
  const [helps, setHelps] = useState<string[]>([]);

  // for students only
  const [instituteName, setInstituteName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");

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

    const timeOutInterval = setTimeout(() => {
      setIsSplashScreenOn(false);
    }, 2000);

    return () => {
      clearInterval(timeOutInterval);
    };
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
          contactNumber: phoneNumber,
          company: companyName,
          position: describedAs,
          instituteName,
          courseName,
          profession: bestDescribedAs,
          industry: selectedIndustries,
          lookingFor: wantToNetworkWith,
          help: helps,
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
  }, [currentFormIndex]);

  const nextForm = async () => {
    console.log("clicked");
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

  // For showing the splash screen for 2 seconds
  if (isSplashScreenOn) {
    return <SplashScreen />;
  } else if (isUserFetching && !isSplashScreenOn) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingComp />
      </div>
    );
  } else {
    return (
      <div
        className="w-full relative"
        style={{
          minHeight: innerHeight,
          height: innerHeight,
        }}
      >
        <div className="w-full">
          <div
            ref={formsContainerRef}
            className="w-full flex flex-col flex-nowrap overflow-y-hidden"
            style={{
              minHeight: innerHeight,
              height: innerHeight,
            }}
          >
            <FormSectionIntro nextForm={nextForm} />
            <FormSection1
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              number={phoneNumber}
              setNumber={setPhoneNumber}
              nextForm={nextForm}
            />

            <FormSection2
              setDescribedAs={setDescribedAs}
              describedAs={describedAs}
              companyName={companyName}
              setCompanyName={setCompanyName}
              instituteName={instituteName}
              setInsituteName={setInstituteName}
              courseName={courseName}
              setCourseName={setCourseName}
              nextForm={nextForm}
              backForm={backForm}
            />

            {describedAs == "Freelancer" || describedAs == "Student" ? (
              <FormSectionNonCompany
                nextForm={nextForm}
                backForm={backForm}
                bestDescribedAs={bestDescribedAs}
                setBestDescribedAs={setBestDescribedAs}
              />
            ) : (
              <FormSection3
                nextForm={nextForm}
                backForm={backForm}
                setSelectedIndustries={setSelectedIndustries}
                selectedIndustries={selectedIndustries}
              />
            )}

            <FormSection4
              nextForm={nextForm}
              backForm={backForm}
              wantToNetworkWith={wantToNetworkWith}
              setWantToNetworkWith={setWantToNetworkWith}
            />

            <FormSectionCompulsory
              helps={helps}
              setHelps={setHelps}
              backForm={backForm}
              nextForm={nextForm}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default FormPage;
