import CharacterPageMain from "@/app/[locale]/showcases/[slug]/character/page";
import { PageParams } from "@/types";

export default function CharacterPage({ params }: { params: PageParams }) {
    return (
      <CharacterPageMain params={params}/>
    );
  }