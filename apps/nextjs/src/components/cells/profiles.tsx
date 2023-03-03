import { type WithLoading } from "@acme/shared";

import { api, type RouterOutputs } from "~/utils/api";

interface RenderArgs extends WithLoading {
  data: RouterOutputs["profile"]["list"] | undefined;
}
interface Props {
  render: (arg: RenderArgs) => JSX.Element;
}

export const ProfilesCell = ({ render }: Props) => {
  const result = api.profile.list.useQuery();

  return render({
    data: result.data,
    isLoading: result.isLoading,
  });
};

interface RenderArgsInId extends WithLoading {
  data: RouterOutputs["profile"]["getById"] | undefined | null;
}

interface WithIdProps {
  render: (arg: RenderArgsInId) => JSX.Element;
  id: string;
}

export const ProfileCell = ({ id, render }: WithIdProps) => {
  const result = api.profile.getById.useQuery({ id });

  return render({
    data: result.data,
    isLoading: result.isLoading,
  });
};
