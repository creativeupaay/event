const FormSection7 = ({
  gender,
  setGender,
}: {
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="w-full h-screen flex-shrink-0">
      <h1 className="text-3xl font-medium">Gender ?</h1>

      <div className="w-full mt-10">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          name="profession"
          className="w-full outline-none text-2xl bg-transparent border-b-2 border-b-slate-500 px-1 pb-4"
        >
          <option value={"MALE"}>Male</option>
          <option value={"FEMALE"}>Female</option>
          <option value={"OTHER"}>Other</option>
        </select>
      </div>
    </div>
  );
};

export default FormSection7;
