import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface Props {
  screenLoaded: boolean;
}

const LoadingScreen = ({ screenLoaded }: Props) => {
  const [timedout, setTimedout] = useState(false);

  useEffect(() => {
    if (screenLoaded) {
      setTimeout(() => {
        setTimedout(true);
      }, 500);
    }
  }, [screenLoaded]);

  return (
    !timedout && (
      <div
        className="absolute z-10 w-full h-full flex flex-col justify-center items-center space-y-3 opacity-0"
        style={{
          opacity: !screenLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <p className="text-2xl">Loading Earth</p>
        <BeatLoader color="#28cc83" />
      </div>
    )
  );
};

export default LoadingScreen;
