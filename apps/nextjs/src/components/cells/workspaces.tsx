import { api, type RouterOutputs } from "~/utils/api";

interface RenderArgs {
  data: RouterOutputs["workspace"]["list"] | undefined;
  isLoading: boolean;
}
interface Props {
  render: (arg: RenderArgs) => JSX.Element;
}

export const WorkspacesCell = ({ render }: Props) => {
  const result = api.workspace.list.useQuery();

  return render({
    data: result.data,
    isLoading: result.isLoading,
  });
};
