import Link from "next/link";
import { NavLink, Navbar, ScrollArea, Text } from "@mantine/core";
import { PROFILE_STATUS } from "@prisma/client";
import {
  IconHome,
  IconLogout,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { t, type CurrentUser, type WithChildren } from "@acme/shared";

import { Logo } from "../others/logo";
import { MainSidebar } from "./main-sidebar";

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

interface Props extends WithChildren {
  user: CurrentUser;
}

export const AdminLayout = ({ user, children }: Props) => {
  const renderContent = () => {
    if (user.profile?.status !== PROFILE_STATUS.active) {
      return (
        <div>
          <Text c="dimmed" size="sm">
            Access Restricted. Contact the workspace admin. If you are invited
            to this workspace, please check your email to accept the invitation.
          </Text>
          <Link href="/signout">Sign out</Link>
        </div>
      );
    }

    return (
      <>
        <MainSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative flex grow flex-col overflow-auto">
            {children}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-full min-h-full w-full flex-row items-stretch overflow-hidden">
      {renderContent()}
    </div>
  );
};
