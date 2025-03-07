"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link,usePathname } from "@/i18n/routing";

export default function TabsComponent() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  let tabs: any = [
    { label: t("navigation.character_label"), path: "/showcases/character" },
    { label: t("navigation.onboarding_label"), path: "/onboarding" },
    { label: t("navigation.scenario_label"), path: "/scenarios" },
    { label: t("navigation.publish_label"), path: "/publish" }
  ];

  return (
    <div>
      {tabs.map((tab: any) => (
        <Link href={tab.path} key={tab.label}>
        <button
          key={tab.path}
          onClick={() => router.push(tab.path)}
          className={`py-1 px-2 inline-block w-fit ${
            tab.path === pathname
              ? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-text font-bold cursor-pointer"
              : "text-gray-400"
          }`}
        >
          {tab.label}
        </button>
        </Link>
      ))}
    </div>
  );
}
