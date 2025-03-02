import { CredentialsDisplay } from "@/components/credentials/credentials-display";
import { CredentialsEditor } from "@/components/credentials/credentials-editor";
import { PageParams } from "@/types";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function Credentials({ params }: { params: PageParams }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="flex text-light-text bg-light-bg dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full bg-gray-100">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-6 py-2 mt-4">
          <div className="flex items-center space-x-4">
            <p className="font-bold text-4xl">Credential Library</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 h-full">
          <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <CredentialsDisplay />
          </div>
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <CredentialsEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
