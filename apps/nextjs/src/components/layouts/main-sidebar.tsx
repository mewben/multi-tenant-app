import Link from "next/link";
import { Avatar, NavLink, Navbar, ScrollArea } from "@mantine/core";
import { IconHome, IconSettings, IconUsers } from "@tabler/icons-react";
import { t } from "@acme/shared";

import { Logo } from "../others/logo";

const MainMenu = () => {
  return (
    <div className="p-2">
      <NavLink
        component={Link}
        href="/"
        label={t("Home")}
        icon={<IconHome size={16} />}
      />
      <NavLink
        component={Link}
        href="/"
        label={t("Users")}
        icon={<IconUsers size={16} />}
      />
      <NavLink
        component={Link}
        href="/"
        label={t("Users")}
        icon={<IconUsers size={16} />}
      />
      <NavLink
        component={Link}
        href="/"
        label={t("Users")}
        icon={<IconUsers size={16} />}
      />
    </div>
  );
};

const FootMenu = () => {
  return (
    <>
      <NavLink
        component={Link}
        href="/settings"
        label={t("Settings")}
        icon={<IconSettings size={16} />}
      />
    </>
  );
};

const MainHeader = () => {
  return (
    <div className="item-stretch flex flex-col gap-3 py-3">
      <div className="flex min-w-full max-w-full items-center">
        <Logo />
        <div className="min-w-[8px] flex-grow" />
        <div>
          <Avatar size={"sm"} />
        </div>
      </div>
      {/* <div>Quick Action</div> */}
    </div>
  );
};

export const MainSidebar = () => {
  return (
    <Navbar px="sm" width={{ base: 280 }}>
      <Navbar.Section>
        <MainHeader />
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-sm">
        <MainMenu />
      </Navbar.Section>
      <Navbar.Section>
        <FootMenu />
      </Navbar.Section>
    </Navbar>
  );
};
