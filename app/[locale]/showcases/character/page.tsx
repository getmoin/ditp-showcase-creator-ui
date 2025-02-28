import MyShowcaseMain from "@/components/showcases-screen";
import NewCharacterPage from "@/components/showcases-screen/new-character";
import { PageParams } from "@/types";

export default function CharacterPageMain({ params }: { params: PageParams }) {
    return (
      <div>
        <MyShowcaseMain params={params}/>
      </div>
    );
  }