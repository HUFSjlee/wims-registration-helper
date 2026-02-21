import WebReceivePage from "../../../../components/web/WebReceivePage";

type Props = { params: Promise<{ token: string }> };

export default async function Page({ params }: Props) {
  const { token } = await params;
  return <WebReceivePage token={token} />;
}
