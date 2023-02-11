import type { Profile } from "@acme/db";

import { api } from "~/utils/api";

interface RenderArgs {
  data: Profile[] | undefined;
}
interface Props {
  render: (arg: RenderArgs) => JSX.Element;
}

export const ProfilesCell = ({ render }: Props) => {
  const result = api.profile.list.useQuery();

  const data = result.data;

  return render({
    data,
  });
};
