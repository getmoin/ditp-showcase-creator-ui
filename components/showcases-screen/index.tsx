"use client";

import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { characterSchema } from "@/schemas/character";
import { useTranslations } from "next-intl";
import { PageParams } from "@/types";
import TabsComponent from "../Tabs-component";
import NewCharacterPage from "@/components/character-screen/new-character";

const characters = [
  {
    id: 1,
    name: "Ana",
    type: "Student",
    description:
      "Meet ABC Ana is a student at BestBC College. To help make student life easier, BestBC College is going to offer Ana a digital Student Card to put in her BC Wallet.",
    headshot: "../../public/assets/NavBar/Joyce.png",
    bodyImage: "../../public/assets/NavBar/Joyce.png",
    selected: false,
    isHidden: false,
  },
  {
    id: 2,
    name: "Joyce",
    type: "Teacher",
    description:
      "Meet Joyce. Joyce is a Teacher at BestBC College. To help make teacher life easier, BestBC College is going to offer Joyce a digital Teacher Card to put in her BC Wallet.",
    headshot: "../../public/assets/NavBar/Joyce.png",
    bodyImage: "../../public/assets/NavBar/Joyce.png",
    selected: false,
    isHidden: false,
  },
  {
    id: 3,
    name: "Bob",
    type: "Director",
    description: "Director at BestBC College.",
    headshot: "../../public/assets/NavBar/Joyce.png",
    bodyImage: "../../public/assets/NavBar/Joyce.png",
    selected: false,
    isHidden: false,
  },
];

type CharacterFormData = z.infer<typeof characterSchema>;

export default function MyShowcaseMain({ params }: { params: PageParams }) {
  const t = useTranslations();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    t("navigation.character_label")
  );
  const [isOpen, setIsOpen] = useState(false);
  const router: any = useRouter();

  const {
    updateCharacterImage,
    showcaseJSON,
    selectedCharacter,
    setEditMode,
    updateCharacterDetails,
    setSelectedCharacter,
  } = useShowcaseStore();

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
    },
    values: {
      name: selectedIds.length > 0 ? characters[selectedCharacter].name : "",
      role: selectedIds.length > 0 ? characters[selectedCharacter].type : "",
      description:
        selectedIds.length > 0 ? characters[selectedCharacter].description : "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  // console.log("showcaseJSON.personas", showcaseJSON.personas);

  // const form = useForm<CharacterFormData>({
  //   resolver: zodResolver(characterSchema),
  //   defaultValues: {
  //     name: showcaseJSON.personas[selectedCharacter].name,
  //     type: showcaseJSON.personas[selectedCharacter].type,
  //     description: showcaseJSON.personas[selectedCharacter].description,
  //   },
  //   mode: "onChange",
  //   shouldFocusError: true,
  // });

  const handleFormSubmit = (data: CharacterFormData) => {
    updateCharacterDetails(data);
    setEditMode(false);
  };

  const handleCancel = () => {
    form.reset({
      name: showcaseJSON.personas[selectedCharacter].name,
      role: showcaseJSON.personas[selectedCharacter].type,
      description: showcaseJSON.personas[selectedCharacter].description,
    });
    setEditMode(false);
  };

  const toggleSelect = (id: any) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((charId) => charId !== id) : [...prev, id]
    );
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCharacter(Number(e.currentTarget.value));
    setEditMode(false);
  };

  //   const [activeTab, setActiveTab] = useState('Character');
  const [hideCharacter, setHideCharacter] = useState(false);
  type Tab = "Character" | "Onboarding" | "Scenario" | "Publish";

  const tabs = [
    t("navigation.character_label"),
    t("navigation.onboarding_label"),
    t("navigation.scenario_label"),
    t("navigation.publish_label"),
  ];

  useEffect(() => {
    if (!router.isReady) return; // Prevent accessing undefined query
    const { tab } = router.query;

    if (tab && tabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, [router.isReady, router.query]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
  };

  return (
    <div className="flex bg-light-bg dark:bg-dark-bg flex-col h-full w-full">
      <div className="flex flex-col">
        <div className="flex justify-between items-center px-6 py-2 mt-4">
          <div className="flex items-center space-x-4">
            <span className="text-light-text dark:text-dark-text font-medium text-sm">
              Showcase1{" "}
            </span>
            <Pencil size={16} />
            <span className="rounded-[5px] bg-gray-500 px-3 py-1 min-w-24 text-center min-h-4 text-sm text-white">
              {t("showcases.header_tab_draft")}
            </span>
          </div>

          <div className="flex space-x-1 text-lg font-semibold justify-start mr-[305px]">
            <TabsComponent />
          </div>
          <button className="text-gray-500 hover:text-gray-700"></button>
        </div>

        <NewCharacterPage />
      </div>
    </div>
  );
}
