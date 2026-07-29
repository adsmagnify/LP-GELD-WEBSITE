import LandingPage from "./components/LandingPage/LandingPage";
import { getLandingWebinar } from "@/sanity/lib/landingWebinar";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ section?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const data = await getLandingWebinar();
  const section = params.section?.trim() || undefined;

  return <LandingPage data={data} initialSection={section} />;
}
