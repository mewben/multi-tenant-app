import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { SignupForm } from "~/components/forms/auth/signup-form";

const Signup: NextPage = () => {
  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <h1>Signup</h1>
      <SignupForm />
      <div>
        <Link href="/signin">Signin</Link>
        <Link href="/">Home page</Link>
      </div>
    </>
  );
};

export default Signup;
