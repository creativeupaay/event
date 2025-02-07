// Form field for getting phone number
const FormSection6 = ({
  phoneNumber,
  setPhoneNumber,
}: {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="w-full h-screen flex-shrink-0">
      <h1 className="text-3xl font-medium">Phone Number</h1>

      <div className="w-full mt-10">
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="text"
          placeholder="Type here..."
          className="w-full text-2xl outline-none border-b-2 border-b-slate-500 bg-transparent px-1 pb-4"
        />
      </div>
    </div>
  );
};

export default FormSection6;
