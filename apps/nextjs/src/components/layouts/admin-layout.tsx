import Link from "next/link";
import { NavLink, Navbar, ScrollArea } from "@mantine/core";
import {
  IconHome,
  IconLogout,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { t, type WithChildren } from "@acme/shared";

import { Logo } from "../others/logo";

const Sidebar = () => {
  return (
    <Navbar p="xs" width={{ base: 280 }}>
      <Navbar.Section mt="xs">
        <Logo />
      </Navbar.Section>

      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <NavLink
          component={Link}
          href="/"
          label={t("Home")}
          icon={<IconHome size={16} />}
        />
        <NavLink
          component={Link}
          href="/users"
          label={t("Users")}
          icon={<IconUsers size={16} />}
        />
      </Navbar.Section>

      <Navbar.Section>
        <NavLink
          component={Link}
          href="/settings"
          label={t("Settings")}
          icon={<IconSettings size={16} />}
        />
        <NavLink
          component={Link}
          href="/signout"
          label={t("Signout")}
          icon={<IconLogout size={16} />}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export const AdminLayout = ({ children }: WithChildren) => {
  return (
    <div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex grow flex-col overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
