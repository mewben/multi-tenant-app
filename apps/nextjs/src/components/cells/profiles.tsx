import { api, type RouterOutputs } from "~/utils/api";

interface RenderArgs {
  data: RouterOutputs["profile"]["list"] | undefined;
  isLoading: boolean;
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
