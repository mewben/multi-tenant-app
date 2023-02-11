// We copy this here since this PR is not merged
// https://github.com/mantinedev/mantine/pull/2981

export type { ContextDrawerProps, DrawerSettings } from "./context";
export { DrawersProvider, type DrawersProviderProps } from "./drawers-provider";
export {
  closeAllDrawers,
  closeDrawer,
  openConfirmDrawer,
  openContextDrawer,
  openDrawer,
} from "./events";
export { useDrawers } from "./use-drawers/use-drawers";
