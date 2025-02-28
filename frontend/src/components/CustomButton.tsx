const CustomButton = ({
  text,
  onClick,
  width = "85%",
}: {
  text: string;
  onClick: Function;
  width?: string;
}) => {
  return (
    <button
      onClick={(e) => onClick(e)}
      className="h-fit bg-darkBg text-white py-2 rounded-lg font-medium"
      style={{
        width,
      }}
    >
      {text}
    </button>
  );
};

export default CustomButton;
