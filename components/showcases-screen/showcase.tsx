"use client";

import { useShowcase } from "@/hooks/use-showcases";

export default function Showcase({ slug }: { slug: string }) {
  const { data, isLoading, error } = useShowcase(slug);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <pre>{JSON.stringify(data?.showcase, null, 2)}</pre>;
}