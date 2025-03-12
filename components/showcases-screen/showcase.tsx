"use client";

import { useShowcase } from "@/hooks/use-showcases";
import MyShowcaseMain from ".";
import { redirect } from "next/navigation";
export default function Showcase({ slug }: { slug: string }) {
  const { data, isLoading, error } = useShowcase(slug);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return redirect("/showcases");
  }

  // return <pre>{JSON.stringify(data?.showcase, null, 2)}</pre>;
  return <MyShowcaseMain params={data?.showcase}/>
}