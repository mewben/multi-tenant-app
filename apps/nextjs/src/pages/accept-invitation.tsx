import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { showNotification } from "~/utils/helpers/show-notification";
import { Button } from "~/components/buttons";

/**
 1. Check session
 2. if same, show accept button
 3. if not, show signin as email button
 4. after signin, redirect to this page (accept)
 5. or after verification, redirect to this page
 */
const AcceptInvitationPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const id = router.query.id as string;
  const invitationCode = router.query.invitationCode as string;

  const mutation = api.profile.acceptInvitation.useMutation();
  const check = api.profile.getByInvitation.useQuery({ id, invitationCode });

  if (check.isLoading) return <>loading...</>;

  if (!check.data) {
    return <>Cannot find the invitation</>;
  }

  const profile = check.data;

  if (!session || session.user?.email !== profile.user?.email) {
    const link = `/signin?redirect=${router.asPath}`;
    return (
      <>
        please sign in as {profile.user?.email}
        <Button component={Link} href={link}>
          Signin
        </Button>
      </>
    );
  }

  const onClickAccept = () => {
    mutation.mutate(
      { invitationCode },
      {
        onError(error) {
          showNotification({ message: error.message });
        },
        onSuccess() {
          window.location.replace("/");
        },
      },
    );
  };

  return (
    <>
      Accept invitation
      <Button onClick={onClickAccept}>Accept Invitation</Button>
    </>
  );
};

export default AcceptInvitationPage;
