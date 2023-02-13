import { isEmpty } from "lodash";

import { RouterOutputs } from "~/utils/api";
import { WorkspacesCell } from "~/components/cells/workspaces";

type Data = RouterOutputs["workspace"]["list"];

interface Props {
  renderEmpty: () => JSX.Element;
  renderContent: (data: Data) => JSX.Element;
}

// attempts to fetch a list of profiles with workspaces
// show onboardingform if empty
// else show list of workspaces
export const WelcomeWrapper = ({ renderEmpty, renderContent }: Props) => {
  return (
    <WorkspacesCell
      render={({ data, isLoading }) => {
        return isLoading ? (
          <>TODO:loading</>
        ) : isEmpty(data) ? (
          renderEmpty()
        ) : (
          renderContent(data as Data)
        );
      }}
    />
  );
};
