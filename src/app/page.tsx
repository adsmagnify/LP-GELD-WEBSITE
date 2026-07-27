import LandingPage from "./components/LandingPage/LandingPage";
import { getLandingWebinar } from "@/sanity/lib/landingWebinar";

export default async function Home() {
  const data = await getLandingWebinar();
  return <LandingPage data={data} />;
}
