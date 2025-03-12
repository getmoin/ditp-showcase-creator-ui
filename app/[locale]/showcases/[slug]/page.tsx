import { setRequestLocale } from "next-intl/server";
import Showcase from "@/components/showcases-screen/showcase";

type PageParams = Promise<{ slug: string, locale: string }>

export default async function Showcases({ params }: {params: PageParams}) {
  const { slug, locale } = await params
  setRequestLocale(locale);
  
  return (
    <div
      className={`flex bg-light-bg  text-light-text dark:bg-dark-bg dark:text-dark-text`}
    >
      <Showcase slug={slug} />
    </div>
  );
}