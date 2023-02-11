import type { Role } from "@acme/db";

import { api } from "~/utils/api";

interface RenderArgs {
  data: Role[] | undefined;
}
interface Props {
  render: (arg: RenderArgs) => JSX.Element;
}

export const RolesCell = ({ render }: Props) => {
  const result = api.role.list.useQuery();

  const data = result.data;

  return render({
    data,
  });
};
