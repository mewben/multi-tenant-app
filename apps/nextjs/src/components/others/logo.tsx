import { IconBracketsOff } from "@tabler/icons-react";

export const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="text-pink-500">
        <IconBracketsOff />
      </div>
      <div className="ml-1 font-bold">
        Nyaman{" "}
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          TECH
        </span>
      </div>
    </div>
  );
};
