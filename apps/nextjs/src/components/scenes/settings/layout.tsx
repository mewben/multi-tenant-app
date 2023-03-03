import { type WithChildren } from "@acme/shared";

export const SettingsLayout = ({ children }: WithChildren) => {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-10 mt-0 mb-16 flex flex-col items-center">
        <div className="h-16" />
        <div className="flex w-full max-w-2xl flex-initial flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
