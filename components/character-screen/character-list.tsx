"use client";

import { useShowcaseStore } from "@/hooks/use-showcase-store";
import Image from "next/image";
import { cn, ensureBase64HasPrefix } from "@/lib/utils";
import { User } from "lucide-react";
import { usePersonas } from "@/hooks/use-personas";
import { useTranslations } from "next-intl";

export const CharacterList = () => {
  const { data } = usePersonas();
  const { selectedCharacter, setEditMode, setSelectedCharacter } =
    useShowcaseStore();
  const t = useTranslations();

  console.log("personas", data);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCharacter(Number(e.currentTarget.value));
    setEditMode(false);
  };

  return (
    <div className="grid grid-cols-1">
      <div className="p-4">
        <h2 className="text-lg font-bold">
          {t("character.select_your_character_title")}
        </h2>
        <p className="text-sm">
          {t("character.select_your_character_subtitle")}
        </p>
      </div>
      {data?.personas?.map((person, index) => (
        <button value={index} key={index} onClick={handleClick}>
          <div className="flex flex-col items-center justify-center">
            <div
              className={cn(
                `character-circle p-3 m-3 flex items-center justify-center`,
                selectedCharacter === index && "border-2 border-yellow-500"
              )}
            >
              {person.headshotImage ? (
                <Image
                  alt="headshot"
                  width={150}
                  height={150}
                  className="rounded-full aspect-square object-cover"
                  src={ensureBase64HasPrefix(person.headshotImage.content)}
                />
              ) : (
                <User />
              )}
              {/* <User /> */}
            </div>
            <div className="p-2">
              <p className="text-center font-bold text-xl">{person.name}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
