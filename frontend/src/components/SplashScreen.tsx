const SplashScreen = () => {
  return (
    <div className="w-full h-screen bg-primary  flex items-center justify-center absolute top-0 left-0 z-50">
      <p className="text-3xl font-extrabold text-white flex items-center">
        Konnect <span className="text-[64px] ">X</span>
      </p>

      <div className="text-white absolute bottom-8 text-center text-[10px] font-light">
        <p>All rights reserved @ Creative Upaay</p>
        <p>(Brand owned by Cinnovate Solutions (OPC) Pvt Ltd)</p>
      </div>
    </div>
  );
};

export default SplashScreen;
