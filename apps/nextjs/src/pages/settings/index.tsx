import { Anchor } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";

const SettingsPage: NextPage = () => {
  return (
    <>
      <Anchor component={Link} href="/settings/profile">
        Profile Settings
      </Anchor>
    </>
  );
};

export default SettingsPage;
