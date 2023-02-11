import { Switch, type SwitchProps } from "@mantine/core";
import { useFormContext } from "./form";

interface Props extends SwitchProps {
  name: string;
}

export const SwitchField = ({ name, ...props }: Props) => {
  const form = useFormContext();
  return <Switch {...props} {...form.getInputProps(name)} data-pw={name} />;
};
