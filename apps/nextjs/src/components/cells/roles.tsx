import { api, type RouterOutputs } from "~/utils/api";

interface RenderArgs {
  data: RouterOutputs["role"]["list"] | undefined;
  isLoading: boolean;
}
interface Props {
  render: (arg: RenderArgs) => JSX.Element;
}

export const RolesCell = ({ render }: Props) => {
  const result = api.role.list.useQuery();

  return render({
    data: result.data,
    isLoading: result.isLoading,
  });
};
