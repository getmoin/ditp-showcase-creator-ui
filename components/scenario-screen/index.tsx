"use client";
import { EditStepScreen } from "@/components/scenario-screen/edit-step-screen";
import { ScenarioScreen } from "@/components/scenario-screen/scenario-screen";
import { PageParams } from "@/types";
import { useTranslations } from "next-intl";

export default function ScenarioMain({ params }: { params: PageParams }) {
  //   const { locale } = await params;
  //   setRequestLocale(locale);
  const t = useTranslations("scenario");

  //   return (
  //     <div className="flex flex-col min-h-screen">
  //       <div className="flex gap-12 container mx-auto px-4 py-8 mt-20">
  //         <div className="w-2/5 rounded left-col text-foreground">
  //           <div className="flex w-full">
  //             <div>
  //               <h2 className="text-4xl font-bold text-foreground">
  //                 {t('header_title')}
  //               </h2>
  //               <p className="w-full mt-3">
  //                 {t('header_subtitle')}
  //               </p>
  //             </div>
  //           </div>
  //           <ScenarioScreen />
  //         </div>
  //         <EditStepScreen/>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="flex text-light-text bg-light-bg dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full bg-gray-100">
      <div className="flex flex-col h-full">
        <div className="flex gap-4 p-4 h-full">
          {/* Left Section - Character Selection with Header */}
          <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <div className="p-4 border-b shadow">
              <h2 className="text-base font-bold text-foreground">
                {t("header_title")}
              </h2>
              <p className="w-full text-xs">{t("header_subtitle")}</p>
            </div>
            <ScenarioScreen />
          </div>
          {/* Right Section - Character Details with Header */}
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <EditStepScreen />
          </div>
        </div>
      </div>
    </div>
  );
}
