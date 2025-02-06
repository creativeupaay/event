import { Add, Edit } from "@mui/icons-material";
import tempProfile from "../assets/tempProfile.svg";
import userApi from "../apis/userApi";
import { useEffect } from "react";

const interests = ["AI/ML", "Science", "Business", "Gaming", "Techonology"];

const TextInputField = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col space-y-2 text-lg">
      <p className="font-semibold">{label}</p>
      <input
        type="text"
        value={value}
        className="border-b border-b-slate-400 py-2 outline-none"
      />
    </div>
  );
};

const Profile = () => {
  const fetchUserProfile = async () => {
    try {
      const response = await userApi.get("/user/");

      console.log(response);
    } catch (e) {}
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="w-full h-full">
      {/* upper profile section */}
      <div className=" w-full h-40 bg-blue-500 py-3 px-4 flex flex-1 items-center space-x-3">
        <div className="flex-[0.3] items-center justify-center">
          <img
            src={tempProfile}
            alt="profile image"
            className="w-32 h-32 object-contain"
          />
        </div>

        <div className="flex-[0.7] text-white">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-medium">Ronak Paul</h1>
            <Edit />
          </div>
          <div>
            <p>Software Developer</p>
          </div>
        </div>
      </div>

      {/* Lower edit info section */}
      <div className="w-full mt-4 px-3">
        {/* Profile completion status */}
        <div className="w-full border border-blue-500 rounded-2xl px-3 py-2 relative mt-10">
          <p className="text-lg absolute -top-3 left-[150px] bg-white px-3 font-semibold">
            Level 1 Explorer
          </p>

          <div className="flex items-center mt-4">
            <div className="w-full h-[6px] bg-white border border-slate-400 rounded-full">
              <div className="w-1/2 h-full bg-blue-600 rounded-full"></div>
            </div>
            <p className="ml-2 text-lg font-medium">50/100</p>
          </div>
        </div>

        {/* Tags or interests section */}
        <div className="my-8">
          <p className="text-xl font-medium">Interests</p>

          <div className="flex items-center flex-wrap gap-5 mt-6">
            {interests.map((label, index) => (
              <div key={index} className="bg-blue-100 px-4 py-1 rounded-full">
                {label}
              </div>
            ))}

            <div className="bg-white border border-slate-300 px-4 py-1 rounded-full flex items-center space-x-2">
              <p>Add new</p> <Add />
            </div>
          </div>
        </div>

        {/* Other information like industry, whom you want to connect */}
        <div className="my-8">
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">Other info</p>
            <Edit />
          </div>

          <div className="mt-6 space-y-4">
            <TextInputField label="Industry" value="Tech Industry" />
            <TextInputField label="Looking for" value="Gammers, Programmers" />
            <TextInputField label="Email" value="ronak@gmail.com" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
