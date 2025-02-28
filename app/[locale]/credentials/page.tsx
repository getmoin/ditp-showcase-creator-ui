import { CredentialsDisplay } from "@/components/credentials/credentials-display";
import { CredentialsEditor } from "@/components/credentials/credentials-editor";
import { PageParams } from "@/types";
import { Pencil } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function Credentials({ params }: { params: PageParams }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    //  <div className="flex flex-col min-h-screen mt-20 ">
    //   <div className="container mx-auto px-4 py-8 flex-grow">
    //     <div className="flex gap-12 h-full">
    //       <div className="w-2/5 rounded left-col text-light-text dark:text-dark-text">
    //         <div className="flex justify-between">
    //           <div>
    //             <h3 className="text-4xl font-bold text-foreground">
    //               {t('header_title')}
    //             </h3>
    //             <p className="text-foreground mt-3">
    //               {t('header_subtitle')}
    //             </p>
    //           </div>
    //         </div>
    //         <CredentialsDisplay />
    //       </div>
    //       <div className="w-3/5  p-6 rounded-md right-col bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text ">
    //         <CredentialsEditor />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex text-light-text bg-light-bg dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full bg-gray-100">
      <div className="flex flex-col h-full">

      <div className="flex justify-between items-center px-6 py-2 mt-4">
          {/* Left Header Section */}
          <div className="flex items-center space-x-4">
            <p className="font-bold text-4xl">
              Credential Library
              </p>
            {/* <span className="text-light-text dark:text-dark-text font-medium text-sm">
              Showcase1{" "}
            </span>
            <Pencil size={16} />
            <span className="rounded-[5px] bg-gray-500 px-3 py-1 min-w-24 text-center min-h-4 text-sm text-white">
              {t('showcases.header_tab_draft')}
            </span> */}
          </div>

          {/* Tabs Section */}
          {/* <div className="flex space-x-1 text-lg font-semibold justify-start mr-[305px]">

          </div> */}

        </div>

        <div className="flex gap-4 p-4 h-full">
          {/* Left Section - Character Selection with Header */}
          <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            {/* <div className="p-4 border-b shadow">
              <h2 className="text-base font-bold text-foreground">
                {t("credentials.header_title")}
              </h2>
              <p className="w-full text-xs">
                {t("credentials.header_subtitle")}
              </p>
            </div> */}
            <CredentialsDisplay />
          </div>
          {/* Right Section - Character Details with Header */}
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <CredentialsEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
