import { forwardRef } from "react";
import {
  Button as MantineButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";

const _Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <MantineButton
      {...props}
      ref={ref}
      // className={
      //   props.variant === "default" || !props.variant
      //     ? "border-none bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-pink-500 hover:bg-none"
      //     : undefined
      // }
    />
  );
});

_Button.displayName = "@acme/button";

export const Button = createPolymorphicComponent<"button", ButtonProps>(
  _Button,
);
