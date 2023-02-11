import {
  showNotification as show,
  type NotificationProps,
} from "@mantine/notifications";

export const showNotification = ({
  color = "red",
  message = "Error",
  ...props
}: NotificationProps) => {
  show({
    color,
    message,
    ...props,
  });
};
