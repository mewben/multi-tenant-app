import { type NextPage } from "next";
import { Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";

import { ProfileCell } from "~/components/cells/profiles";
import { Divider } from "~/components/others/divider";
import { SettingsLayout } from "~/components/scenes/settings/layout";
import { UpdateProfileForm } from "~/components/scenes/user/update-profile-form";

const SettingsProfilePage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <SettingsLayout>
      <div className="flex items-center">
        <Title order={4} className="title2">
          Profile Settings
        </Title>
      </div>
      <div>
        <Text c="dimmed" size="sm">
          Manage your Profile
        </Text>
      </div>
      <Divider />
      <ProfileCell
        id={session?.user?.profile?.id as string}
        render={({ data }) => <UpdateProfileForm profile={data} />}
      />
      {/* <Breadcrumbs separator={<IconChevronRight size={14} />} mb="sm">
        <Anchor component={Link} href="/settings">
          Settings
        </Anchor>
        <span>Profile Settings</span>
      </Breadcrumbs> */}
    </SettingsLayout>
  );
};

export default SettingsProfilePage;
