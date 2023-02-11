import { Select, type SelectProps } from "@mantine/core";
import { useFormContext } from "../form";

export interface FormSelectProps extends SelectProps {
  name: string;
}

export const SelectField = ({ name, ...props }: FormSelectProps) => {
  const form = useFormContext();
  return (
    <Select
      {...props}
      {...form.getInputProps(name)}
      data-pw={name}
      errorProps={{ "data-pw": `error-${name}` }}
      searchable
    />
  );
};
