import { createContext, useContext, useState } from "react";
import { ModalsProvider, closeModal, openModal } from "@mantine/modals";
import type { ModalSettings } from "@mantine/modals/lib/context";
import type { WithChildren } from "@acme/shared";

import {
  DrawersProvider,
  closeDrawer,
  openDrawer,
  type DrawerSettings,
} from "../others/mantine-drawers";

type PopupType = "modal" | "drawer";
type OpenPopupParams = ModalSettings &
  DrawerSettings & {
    popupId?: string;
  };

interface PopupContextType {
  type: PopupType;
  setPopupType: (type: PopupType) => void;
  openPopup: (params: OpenPopupParams) => void; // may open a modal or a drawer depending on user settings
  closePopup: (popupId: string) => void;
  openModal: (params: ModalSettings) => void; // for opening a modal directly
  openDrawer: (params: DrawerSettings) => void; // for opening a drawer directly
}

const PopupContext = createContext<PopupContextType | null>(null);

// Provider for Modal or Drawer
// TODO: Roadmap: Ability to set in the settings modal(default) or drawer
export const Provider = ({ children }: WithChildren) => {
  const [type, setPopupType] = useState<PopupType>("modal");

  const openPopup = (params: OpenPopupParams) => {
    const popupId = params.popupId;
    delete params.popupId;
    return type === "drawer"
      ? openDrawer({ ...params, drawerId: popupId })
      : openModal({ ...params, modalId: popupId });
  };

  const closePopup = (popupId: string) => {
    return type === "drawer" ? closeDrawer(popupId) : closeModal(popupId);
  };

  return (
    <PopupContext.Provider
      value={{
        type,
        setPopupType,
        openPopup,
        closePopup,
        openModal,
        openDrawer,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const PopupProvider = ({ children }: WithChildren) => {
  return (
    <ModalsProvider>
      <DrawersProvider>
        <Provider>{children}</Provider>
      </DrawersProvider>
    </ModalsProvider>
  );
};

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("Popup Context not found");
  }

  return context;
};
