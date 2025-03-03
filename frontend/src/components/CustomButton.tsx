const CustomButton = ({
  text,
  onClick,
  width = "85%",
  type = "filled",
}: {
  text: string;
  onClick: Function;
  width?: string;
  type?: "outlined" | "filled";
}) => {
  return (
    <button
      onClick={(e) => onClick(e)}
      className={`h-fit ${
        type == "filled"
          ? "bg-darkBg text-white"
          : "bg-transparent text-darkBg border border-darkBg"
      }   py-2 rounded-lg font-medium`}
      style={{
        width,
      }}
    >
      {text}
    </button>
  );
};

export default CustomButton;
