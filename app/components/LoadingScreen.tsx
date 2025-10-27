"use client";

import { BeatLoader } from "react-spinners";

interface Props {
  sceneLoaded: boolean;
}

const LoadingScreen = ({ sceneLoaded }: Props) => {
  return (
    <div
      className="absolute z-10 w-full h-full flex flex-col justify-center items-center space-y-3 opacity-0"
      style={{
        opacity: !sceneLoaded ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      <p className="text-2xl">Loading Earth</p>
      <BeatLoader color="#28cc83" />
    </div>
  );
};

export default LoadingScreen;
