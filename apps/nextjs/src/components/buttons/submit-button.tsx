import { Button, type ButtonProps } from "@mantine/core";

export const SubmitButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      type="submit"
      // gradient={{ from: "pink", to: "indigo" }}
      className="border-none bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-pink-500 hover:bg-none"
      data-pw={`btn-submit`}
    >
      {children}
    </Button>
  );
};
