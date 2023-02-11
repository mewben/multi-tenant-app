import { TextInput, type TextInputProps } from "@mantine/core";

import { useFormContext } from "./form";

interface Props extends TextInputProps {
  name: string;
}

const DisconnectedTextField = (props: TextInputProps) => {
  return <TextInput {...props} />;
};

const TextField = ({ name, ...props }: Props) => {
  const form = useFormContext();
  return (
    <DisconnectedTextField
      {...props}
      {...form.getInputProps(name)}
      data-pw={name}
      errorProps={{ "data-pw": `error-${name}` }}
    />
  );
};

export { TextField, DisconnectedTextField };
