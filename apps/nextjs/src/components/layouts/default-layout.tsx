import { type WithChildren } from "@acme/shared";

export const DefaultLayout = ({ children }: WithChildren) => {
  return (
    <div className="flex h-full min-h-full w-full flex-row items-stretch justify-center overflow-hidden">
      {children}
    </div>
  );
};
