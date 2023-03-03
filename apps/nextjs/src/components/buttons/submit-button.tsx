import { Button, type ButtonProps } from "@mantine/core";

interface Props extends ButtonProps {
  isCta?: boolean;
}

export const SubmitButton = ({ children, isCta, ...props }: Props) => {
  return (
    <Button
      {...props}
      type="submit"
      // gradient={{ from: "pink", to: "indigo" }}
      className={
        isCta
          ? "border-none bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-pink-500 hover:bg-none"
          : undefined
      }
      data-pw={`btn-submit`}
    >
      {children}
    </Button>
  );
};
