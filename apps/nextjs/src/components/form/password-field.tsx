import { PasswordInput, type PasswordInputProps } from "@mantine/core";

import { useFormContext } from "./form";

interface Props extends PasswordInputProps {
  name: string;
}

const DisconnectedPasswordField = (props: PasswordInputProps) => {
  return <PasswordInput {...props} />;
};

const PasswordField = ({ name, ...props }: Props) => {
  const form = useFormContext();
  return (
    <DisconnectedPasswordField
      {...props}
      {...form.getInputProps(name)}
      data-pw={name}
      errorProps={{ "data-pw": `error-${name}` }}
    />
  );
};

export { PasswordField, DisconnectedPasswordField };
