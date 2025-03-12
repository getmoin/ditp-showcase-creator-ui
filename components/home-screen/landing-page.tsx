"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import ButtonOutline from "../ui/button-outline";
import { Card } from "../ui/card";
import apiClient from "@/lib/apiService";
import Loader from "../loader";
import { Share2 } from "lucide-react";
import { ensureBase64HasPrefix } from "@/lib/utils";

export const LandingPage = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(t("home.header_tab_all"));
  const [Showcases, setShowcases] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalShowcases, setOriginalShowcases] = useState<any[]>([]);

	let tabs = [
		t("home.header_tab_all"),
		t("home.header_tab_mine"),
		t("home.header_tab_others"),
	];

  const listShowcases = async () => {
    try {
      const response: any = await apiClient.get("/showcases");
      const res = response.showcases;
      setShowcases(res);
      setOriginalShowcases(res)
      setLoading(false);
      // return response.data; // Return the list of showcases
    } catch (error) {
      console.error("Error fetching showcases:", error);
      setLoading(false);
      throw error;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Always filter from the original dataset
    const filtered = originalShowcases.filter((showcase: any) =>
      showcase.name.toLowerCase().includes(term.toLowerCase())
    );
    setShowcases(filtered);
  };

  useEffect(() => {
    listShowcases();
  }, []);

  return (
    <div
      className={`flex bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text`}
    >
      <main
        className={`flex-1 bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text `}
      >
        <section
          className="w-full px-0 py-2 bg-cover bg-center bg:light-bg dark:bg-dark-bg"
          // style={{
          //   backgroundImage:
          //     "url('https://s3-alpha-sig.figma.com/img/84d2/7817/695f4b324b28bca3dafeea1ce4e868b0?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=W03Hk36YdEAmq3EuDffGTsV24WmDhdE3KNHJu6-oIwgqDPrSWZp-tJliZHBU3UDcJ1-m6l6WDumpSy~17VaZZqGsRrMnImTmIWvEFPmBH8NHs31qTecPEobw6UKkIfiMW9lAYCaYSAp-2Z3Eslk~ZA4VcgTNOqifQJc4CEnQdm~G1BA6R-9v8odvfAopWHRTM04EcOSO1u9Qk89jnxb-RfNcwvAoamvTD9ZRl5xHWMX-MAyr7TWGZTgkbW~K5YogtrYpzQYd5eYF4WbbNBtUe3BVtxX7suh6Jwrf9-3js~sq1dmFpTAHXMfrOCFxeFwQSmWfcZiVcS89D9RfrhFjQg__')",
          // }}
        >
          <div className="container mx-auto px-4 mt-12 mb-6">
            <h1 className="text-4xl font-bold">{t("home.header_title")}</h1>
          </div>

          <div className="container mx-auto px-4 mb-8 mt-2">
            <div className="relative max-w-[550px] w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={22}
              />
              <Input
                type="text"
                placeholder={t("action.search_label")}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-white dark:dark-bg w-full pl-10 pr-3 py-4 border rounded-md text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
        </section>

        {!loading &&<div className="container mx-auto px-5 mt-2">
          <div className="flex gap-4 text-sm font-medium">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`flex items-center gap-1 px-2 py-1 ${
                  activeTab === tab
                    ? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-blue font-bold cursor-pointer"
                    : "text-gray-800"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="font-bold text-base">{tab}</div>
                <span className="bg-light-bg-secondary dark:dark-bg-secondary text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {index === 0 ? 3 : index === 1 ? 1 : 2}
                </span>
              </button>
            ))}
          </div>
        </div>}

        {loading &&
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading Showcases
          </div>
        }
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {Showcases.map((showcase: any, index: number) => (
              <Card key={showcase.id}>
                <div
                  key={showcase.id}
                  className="bg-white dark:bg-dark-bg shadow-md rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col h-full"
                >
                  <div
                    className="relative min-h-[15rem] h-auto flex items-center justify-center bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${
                        showcase?.bannerImage?.content ||
                        "https://fastly.picsum.photos/id/506/400/400.jpg?hmac=YUuTQH9RPqWbrpNVNTOj4Yicxuv0Eu62QUy3T11KgJA"
                      }')`,
                    }}
                  >
                    <div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
                    <p className="text-xs text-gray-300 break-words">
                        {t("showcases.created_by_label", {
                          name: "Test college",
                        })}
                      </p>
                      <div className="flex justify-between">
                      <h2 className="text-lg font-bold text-white break-words">
                        {showcase?.name}
                      </h2>
                      <div className="flex-shrink-0">
                          {" "}
                          {/* Prevent button from shrinking */}
                          <button className="border border rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
                            <Share2
                              size={18}
                              className="cursor-pointer text-white"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-light-text dark:text-dark-text">
                      {t("showcases.description_label")}
                    </h3>
                    <p className="text-light-text dark:text-dark-text text-xs">
                      {showcase?.description}
                    </p>
                    <h3 className="text-sm font-semibold text-light-text dark:text-dark-text mt-2">
                    {t("showcases.description_version")}
                    </h3>
                    <p className="text-light-text dark:text-dark-text text-xs">
                      {showcase?.version || '1.0'}
                    </p>
                    <div className="mt-4 flex-grow mb-4">
                      <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                        {t("showcases.character_label")}
                      </h4>
                      <div className="mt-2 space-y-3">
                        {showcase?.personas?.map((persona: any) => (
                          <div
                            key={persona.id}
                            className="border-[1px] border-dark-border dark:border-light-border flex items-center gap-3 p-3 rounded-md"
                          >
                            <img
                              src={
                                ensureBase64HasPrefix(persona.headshotImage?.content) ||
                                "https://picsum.photos/200"
                              } 
                              // src={
                              //   persona.headshotImage?.content ||
                              //   "https://picsum.photos/200"
                              // } 
                              alt={persona.name}
                              className="w-[44px] h-[44px] rounded-full"
                            />
                            <div>
                              <p className="text-base font-medium text-light-text dark:text-dark-text font-semibold">
                                {persona.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {persona.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-auto">
                      <ButtonOutline className="w-1/2">
                        {t("action.preview_label")}
                      </ButtonOutline>
                      <ButtonOutline className="w-1/2">
                        {t("action.create_copy_label")}
                      </ButtonOutline>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
