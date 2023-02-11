import { Button, type ButtonProps } from "@mantine/core";

export const SubmitButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button {...props} type="submit" data-pw={`btn-submit`}>
      {children}
    </Button>
  );
};
