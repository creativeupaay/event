// form field to get email id
const FormSection5 = ({
  email,
  setEmail,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="w-full h-screen flex-shrink-0">
      <h1 className="text-3xl font-medium">Your email address</h1>

      <div className="w-full mt-10">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Type here..."
          className="w-full text-2xl outline-none border-b-2 border-b-slate-500 bg-transparent px-1 pb-4"
        />
      </div>
    </div>
  );
};

export default FormSection5;
