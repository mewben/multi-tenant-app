import { Flex } from "@mantine/core";
import { IconBracketsOff } from "@tabler/icons-react";

export const Logo = () => {
  return (
    <Flex>
      <div className="text-pink-500">
        <IconBracketsOff />
      </div>
      <div className="ml-1 font-bold">
        Nyaman{" "}
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          TECH
        </span>
      </div>
    </Flex>
  );
};
