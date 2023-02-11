import { map } from "lodash";

import { RolesCell } from "~/components/cells/roles";
import { SelectField, type FormSelectProps } from "./select-field";

export const RoleSelectField = ({
  ...props
}: Omit<FormSelectProps, "data">) => {
  return (
    <RolesCell
      render={({ data }) => {
        return (
          <SelectField
            {...props}
            data={map(data, (item) => ({
              value: item.id,
              label: item.title,
            }))}
          />
        );
      }}
    />
  );
};
