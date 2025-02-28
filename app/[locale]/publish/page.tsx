import React from "react";
import { PageParams } from "@/types";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShowcaseList } from "@/components/showcases-screen/showcase-list";
import { PublishEdit } from "@/components/publish-screen/publish-edit";
import { PublishInfo } from "@/components/publish-screen/publish-info";
import PublishMain from "@/components/publish-screen";

export default function PublishPage({ params }: { params: PageParams }) {
  //   const { locale } = await params
  //   setRequestLocale(locale);
  //   const t = await getTranslations('credentials');

  return (
    <div
      // className={`flex ${'light' === "dark" ? "bg-gray-900 text-dark-text" : "bg-gray-100 text-light-text"}`}
      className={`flex bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text`}
    >
      <PublishMain params={params} />
    </div>
  );
}
