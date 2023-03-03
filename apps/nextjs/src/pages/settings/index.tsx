import { type NextPage } from "next";
import Link from "next/link";
import { Anchor, Title } from "@mantine/core";

import { SettingsLayout } from "~/components/scenes/settings/layout";

const SettingsPage: NextPage = () => {
  return (
    <SettingsLayout>
      <Anchor component={Link} href="/settings/profile">
        Profile Settings
      </Anchor>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
      <Title order={1}>Settings</Title>
    </SettingsLayout>
  );
};

export default SettingsPage;
