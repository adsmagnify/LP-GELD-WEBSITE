import LandingPage from "./components/LandingPage/LandingPage";
import { getLandingWebinar } from "@/sanity/lib/landingWebinar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getLandingWebinar();
  return <LandingPage data={data} />;
}
