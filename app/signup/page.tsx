import SignupClient from "./SignupClient";

export default async function SignupPage(props: { searchParams: Promise<{ next?: string }> }) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams?.next === "string" ? searchParams.next : "/";
  return <SignupClient nextParam={next} />;
}
