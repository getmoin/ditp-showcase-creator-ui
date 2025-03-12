"use client";

import { CirclePlus, Search, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";
import { Card } from "../ui/card";
import apiClient from "@/lib/apiService";
import Loader from "../loader";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { ensureBase64HasPrefix } from "@/lib/utils";

export const ShowcaseList = () => {
	const t = useTranslations();

  const [activeTab, setActiveTab] = useState(
    t("showcases.header_tab_overview")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Showcases, setShowcases] = useState<any>([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalShowcases, setOriginalShowcases] = useState<any[]>([]);

  const {setShowcaseId} = useShowcaseStore()

  const listShowcases = async () => {
    try {
      const response:any = await apiClient.get("/showcases");
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

  // Create new showcase
  const createShowcase = async () => {
    try {
      const showcaseData = {
        name: "Credential Showcase BCGov",
        description: "Collection of credential usage scenarios",
        status: "PENDING",
        hidden: false,
        scenarios: ["d9c2afd7-c040-4948-b1ec-599aa8c61aff","fee9c14d-b39b-460e-b4c7-20fb5ddc5c46"],
        credentialDefinitions: ["133447db-d94a-4ef8-9a36-5b781bde4888"],
        personas: ["40b29cdf-1ea5-435f-ac77-699b646d7cb6"],
        bannerImage: "345c45f0-c2d1-462c-981f-68c32bdb31c8",
        completionMessage: "You have successfully completed the showcase",
      };
  
      const response:any = await apiClient.post("/showcases", showcaseData);
      console.log("Showcase Created:", response);
      let Id = response?.showcase?.id
      setShowcaseId(Id);
      return response;
    } catch (error) {
      console.error("Error creating showcase:", error);
      throw error;
    }
  };  
  
  useEffect(() => {
    listShowcases();
  },[])


	let data = [
		{
			id: 1,
			title: "Campus Access",
			createdBy: "Test College",
			published: "Published",
			version: "1.0",
			description:
				"In this showcase, follow the journey of a student and a teacher at Test College as they navigate the process of obtaining a digital parking credential.",
			characters: [
				{
					name: "Joyce",
					role: "Teacher",
					image: "https://yavuzceliker.github.io/sample-images/image-1.jpg",
				},
				{
					name: "Ana",
					role: "Student",
					image: "https://yavuzceliker.github.io/sample-images/image-1.jpg",
				},
			],
			buttons: [
				{ label: t("action.preview_label"), type: "primary" },
				{ label: t("action.edit_label"), type: "secondary" },
			],
		},
		{
			id: 3,
			title: "Campus Access Copy",
			createdBy: "Test College",
			published: "Draft",
			version: "1.0",
			description:
				"In this showcase, follow the journey of a student and a teacher at Test College as they navigate the process of obtaining a digital parking credential.",
			characters: [
				{
					name: "Ana",
					role: "Student",
					image: "https://yavuzceliker.github.io/sample-images/image-1.jpg",
				},
			],
			buttons: [{ label: t("action.edit_label"), type: "primary" }],
		},
	];

	let tabs = [
		t("showcases.header_tab_overview"),
		t("showcases.header_tab_draft"),
		t("showcases.header_tab_under_review"),
		t("showcases.header_tab_published"),
	];

  return (
    <>
    <main
      className={`flex-1 bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text `}
    >
      <section
        className="w-full px-0 py-2 bg-cover bg-center bg:light-bg dark:bg-dark-bg"
        style={{
          backgroundImage:
            "url('https://s3-alpha-sig.figma.com/img/84d2/7817/695f4b324b28bca3dafeea1ce4e868b0?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=W03Hk36YdEAmq3EuDffGTsV24WmDhdE3KNHJu6-oIwgqDPrSWZp-tJliZHBU3UDcJ1-m6l6WDumpSy~17VaZZqGsRrMnImTmIWvEFPmBH8NHs31qTecPEobw6UKkIfiMW9lAYCaYSAp-2Z3Eslk~ZA4VcgTNOqifQJc4CEnQdm~G1BA6R-9v8odvfAopWHRTM04EcOSO1u9Qk89jnxb-RfNcwvAoamvTD9ZRl5xHWMX-MAyr7TWGZTgkbW~K5YogtrYpzQYd5eYF4WbbNBtUe3BVtxX7suh6Jwrf9-3js~sq1dmFpTAHXMfrOCFxeFwQSmWfcZiVcS89D9RfrhFjQg__')",
        }}
      >
        <div className="container mx-auto px-4 mt-12 mb-6">
          <h1 className="text-4xl font-bold">{t("showcases.header_title")}</h1>
        </div>
        <div className="container mx-auto px-4 mb-8 mt-2 flex items-center justify-between">
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

					<Link href={"/showcases/character"}>
						<button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 h-12 flex items-center gap-4 shadow-md">
							{t("showcases.create_new_showcase_label")}
							<CirclePlus size={22} />
						</button>
					</Link>
				</div>
			</section>

      {!loading&&<div className="container mx-auto px-5 mt-2">
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
                {index === 0 ? Showcases.length : index === 1 ? Showcases.length : 0}
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
          {Showcases.map((showcase:any,index:number) => (
            <Card key={showcase.id}>
            <div
              key={showcase.id}
              className="bg-white dark:bg-dark-bg shadow-md rounded-lg overflow-hidden border border-light-border dark:border-dark-border flex flex-col h-full"
            >
              <div
                className="relative min-h-[15rem] h-auto flex items-center justify-center bg-cover bg-center"
                style={{
                  backgroundImage: `url('${
                    showcase?.bannerImage?.content || "https://picsum.photos/400"
                  }')`,
                }}
              >
                <div
                  className={`${
                    showcase.status == "Published"
                      ? "bg-light-yellow"
                      : "bg-dark-grey"
                  } left-0 right-0 top-4 py-2 rounded w-1/4 absolute`}
                >
                  <p
                    className={`text-center ${
                      showcase.status == "Published"
                        ? "text-black"
                        : "text-white"
                    }`}
                  >
                    {showcase.status}
                  </p>
                </div>
                <div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
										<div className="flex justify-between">
											<div className="flex-1">
												{" "}
												{/* Allow the text container to grow */}
												<p className="text-xs text-gray-300 break-words">
                        {t("showcases.created_by_label",{name:'Test college'})}
												</p>
												<h2 className="text-lg font-bold text-white break-words">
													{showcase.name}
												</h2>
											</div>
											{/* Updated Share Button */}
											<div className="flex-shrink-0 self-center">
												{" "}
												{/* Prevent button from shrinking */}
												<button className="border rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
													<Share2
														size={18}
														className="cursor-pointer text-white"
													/>
												</button>
											</div>
										</div>
									</div>
                {/* <div className="flex justify-between absolute bottom-0 left-0 right-0 bg-[#D9D9D9E5] bg-opacity-70">
                  <div className="p-4">
                    <p className="text-xs text-gray-600">
                      {t("showcases.created_by_label",{name:'Test college'})}
                    </p>
                    <div className="flex justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {showcase?.name}
                      </h2>
                      <div className="flex-shrink-0">
                          {" "}
                          <button className="border border-black rounded px-3 py-1 hover:bg-gray-400 dark:hover:bg-gray-700">
                            <Share2
                              size={18}
                              className="cursor-pointer text-white"
                            />
                          </button>
                        </div>
                      </div>
                  </div>
                </div> */}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-light-text dark:text-dark-text">
                {t("showcases.description_label")}
                </h3>
                <p className="text-light-text dark:text-dark-text text-xs">
                  {showcase.description}
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
                    {showcase?.personas?.map((persona:any, charIndex:any) => (
                      <div
                        key={persona.id}
                        className="border-[1px] border-dark-border dark:border-light-border flex items-center gap-3 p-3 rounded-md"
                      >
                        <img
                          src={
                             ensureBase64HasPrefix(persona.headshotImage?.content) ||
                            "https://picsum.photos/200"
                            } 
                          // src={persona.headshotImage?.content || "https://picsum.photos/200"} // Fallback image
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
                    <ButtonOutline className="w-1/2"
                      onClick={() =>
                        setIsModalOpen(true)
                      }
                    >
                        {t("action.edit_label")}
                    </ButtonOutline>
                    <ButtonOutline className="w-1/2">
                        {t("action.create_copy_label")}
                    </ButtonOutline>
                  {/* {item.buttons.map((button, btnIndex) => ( */}
                    {/* <button
                      // key={btnIndex}
                      className={`w-full font-bold py-2 rounded-md transition ${
                        showcase.status === "PUBLISHED"
                          ? "border-2 border-dark-border dark:border-light-border text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                          : showcase.status === "DRAFT"
                          ? "border-2 border-dark-border dark:border-light-border text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      // disabled={button.type === "disabled"}
                      onClick={() =>
                        button.label == t("action.edit_label") &&
                        setIsModalOpen(true)
                      }
                    >
                      {button.label}
                    </button> */}
                  {/* ))} */}
                </div>
              </div>
            </div>
            </Card>
          ))}
        </div>
      </section>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={() => {
          setIsModalOpen(false);
        }}
        header="Edit Published Showcase?"
        description="You are about to edit a published showcase. If you instead wish to make a copy, click <b>Cancel</b> below and then select <b>Create A Copy</b> under the showcase card"
        subDescription="If you proceed with editing, a <b>Draft version</b> will be created. This Draft will remain unpublished until an Admin approves your changes. <b>Until then, the current published showcase will stay active.</b>"
        cancelText="CANCEL"
        deleteText="PROCEED WITH EDITING"
      />
    </main>

    </>
  );
};
