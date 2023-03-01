import { Anchor, Breadcrumbs, Card, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NextPage } from "next";
import Link from "next/link";

const SettingsProfilePage: NextPage = () => {
  return (
    <>
      <Breadcrumbs separator={<IconChevronRight size={14} />} mb="sm">
        <Anchor component={Link} href="/settings">
          Settings
        </Anchor>
        <span>Profile Settings</span>
      </Breadcrumbs>
      <Card withBorder shadow="sm" radius="md" p="lg">
        <Card.Section inheritPadding py="xs">
          <Text weight={500}>My Profile</Text>
        </Card.Section>
        <Card.Section withBorder className="bg-gray-100" inheritPadding py="lg">
          Content
        </Card.Section>
        <Card.Section inheritPadding py="xs" className="flex justify-between">
          <div></div>
          <div>Buttons</div>
        </Card.Section>
      </Card>
    </>
  );
};

export default SettingsProfilePage;
