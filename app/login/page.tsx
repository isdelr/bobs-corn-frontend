import LoginClient from "./LoginClient";

export default async function LoginPage(props: { searchParams: Promise<{ next?: string }> }) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams?.next === "string" ? searchParams.next : "/";
  return <LoginClient nextParam={next} />;
}
