import WebSignupBusinessPage from "../../../../components/web/WebSignupBusinessPage";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const nextParam = resolvedSearchParams?.next;
  const nextPath = Array.isArray(nextParam) ? nextParam[0] : nextParam;

  return <WebSignupBusinessPage nextPath={nextPath || "/web/main"} />;
}
