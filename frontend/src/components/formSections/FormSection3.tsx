// Form field for getting user profession
const FormSection3 = ({
  profession,
  setProfession,
}: {
  profession: string;
  setProfession: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="w-full h-screen flex-shrink-0">
      <h1 className="text-3xl font-medium">What is your Profession ?</h1>

      <div className="w-full mt-10">
        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          name="profession"
          className="w-full outline-none text-2xl bg-transparent border-b-2 border-b-slate-500 px-1 pb-4"
        >
          <option value={"Software Engineer"}>Software Engineer</option>
          <option value={"Full Stack Developer"}>Full Stack Developer</option>
          <option value={"Android Developer"}>Android Developer</option>
          <option value={"System Engineer"}>System Engineer</option>
          <option value={"Audio/Video Engineer"}>Audio/Video Engineer</option>
          <option value={"Cheif Executive Officer"}>
            Cheif Executive Officer
          </option>
        </select>
      </div>
    </div>
  );
};

export default FormSection3;
