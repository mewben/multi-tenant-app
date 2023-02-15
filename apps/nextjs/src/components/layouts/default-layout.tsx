import { type WithChildren } from "@acme/shared";

export const DefaultLayout = ({ children }: WithChildren) => {
  return (
    <div className="default-layout flex w-full flex-auto justify-center">
      {children}
    </div>
  );
};
