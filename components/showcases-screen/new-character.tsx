"use client";

import { useShowcaseStore } from "@/hooks/use-showcase-store";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CircleAlert,
  CirclePlus,
  Delete,
  Download,
  EllipsisVertical,
  Eye,
  EyeClosed,
  EyeOff,
  FileWarning,
  Monitor,
  Pencil,
  RefreshCcw,
  RotateCw,
  Search,
  Trash,
  Trash2,
  User,
} from "lucide-react";
// import { useRouter } from "next/router";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Locale, usePathname, useRouter, Link } from "@/i18n/routing";
import { FileUploadFull } from "../file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextInput, FormTextArea } from "../text-input";
import { characterSchema } from "@/schemas/character";
import { useTranslations } from "next-intl";
import Onboarding from "@/app/[locale]/onboarding/page";
import { PageParams } from "@/types";
import Scenario from "@/app/[locale]/scenarios/page";
import Credentials from "@/app/[locale]/credentials/page";
import { P } from "pino";
import { OnboardingScreen } from "../onboarding-screen/onboarding-screen";
import { ScenarioScreen } from "../scenario-screen/scenario-screen";
import { CredentialsDisplay } from "../credentials/credentials-display";
import { OnboardingMain } from "../onboarding-screen";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";
import apiClient from "@/lib/apiService";

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
      "Meet BCD Joyce is a Teacher at BestBC College. To help make teacher life easier, BestBC College is going to offer Joyce a digital Teacher Card to put in her BC Wallet.",
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
    isHidden: true,
  },
];

let data = [
  {
    id: "123e4567-e89b-12d3-a456-426614174456",
    name: "John Doe",
    role: "Verifier",
    description: "John Doe is a verifier for the system",
    headshotImage: {
      id: "123e4567-e89b-12d3-a456-426614174469",
      mediaType: "image/jpeg",
      content:
        "data:image/png;base64,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",
      fileName: "asset.jpg",
      description: "A beautiful image of a cat",
    },
    bodyImage: {
      id: "123e4567-e89b-12d3-a456-426614174469",
      mediaType: "image/jpeg",
      content:
        "data:image/png;base64,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",
      fileName: "asset.jpg",
      description: "A beautiful image of a cat",
    },
  },
];

type CharacterFormData = z.infer<typeof characterSchema>;

export default function NewCharacterPage() {
  //   const [selectedCharacters, setSelectedCharacters] = useState(characters);

  const t = useTranslations();
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [isHidden, setIsHidden] = useState(false);
  const [activeTab, setActiveTab] = useState("Character");
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headshotImage, setHeadshotImage] = useState<string | null>(null);
  const [isHeadShotImageEdited, setHeadShotImageEdited] = useState<
    boolean | null
  >(null);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [isbodyImageEdited, setbodyImageEdited] = useState<boolean | null>(
    null
  );
  const [Persona, setPersona] = useState<any>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(-1);
  const [hiddenCharacters, setHiddenCharacters] = useState<{
    [key: string]: boolean;
  }>({});

  let Showcases = {
    showcase: {
      id: "123e4567-e89b-12d3-a456-426614174456",
      name: "Credential Showcase BCGov",
      description: "Collection of credential usage scenarios",
      status: "PENDING",
      hidden: false,
      scenarios: [
        {
          id: "789e4567-e89b-12d3-a456-434314174123",
          name: "Credential Issuance",
          description: "This scenario issues credentials to users",
          type: "ISSUANCE",
          steps: [
            {
              id: "123e4567-e89b-12d3-a456-434314174000",
              title: "Verify Identity",
              description: "Verify the user's identity",
              order: 1,
              type: "HUMAN_TASK",
              subScenario: "123e4567-e89b-12d3-a456-434314174000",
              actions: [
                {
                  id: "123e4567-ef2d-12d3-abcd-426614174456",
                  title: "Connect Wallet",
                  text: "Connect your wallet to continue",
                },
              ],
              asset: {
                id: "123e4567-e89b-12d3-a456-426614174469",
                mediaType: "image/jpeg",
                content: "base64 encoded binary data",
                fileName: "asset.jpg",
                description: "A beautiful image of a cat",
              },
            },
          ],
          personas: [
            {
              id: "123e4567-e89b-12d3-a456-426614174456",
              name: "John Doe",
              role: "Verifier",
              description: "John Doe is a verifier for the system",
              headshotImage: {
                id: "123e4567-e89b-12d3-a456-426614174469",
                mediaType: "image/jpeg",
                content: "base64 encoded binary data",
                fileName: "asset.jpg",
                description: "A beautiful image of a cat",
              },
              bodyImage: {
                id: "123e4567-e89b-12d3-a456-426614174469",
                mediaType: "image/jpeg",
                content: "base64 encoded binary data",
                fileName: "asset.jpg",
                description: "A beautiful image of a cat",
              },
            },
          ],
        },
      ],
      credentialDefinitions: [
        {
          id: "123e4567-e89b-12d3-a456-426614174123",
          name: "Credential Definition Name",
          issuerId: "123e4567-e89b-12d3-a456-426614174123",
          schemaId: "123e4567-e89b-12d3-a456-426614174123",
          identifierType: "DID",
          identifier: "did:sov:XUeUZauFLeBNofY3NhaZCB",
          version: "1.0",
          type: "ANONCRED",
          representations: [
            {
              id: "123e4567-e89b-12d3-abcd-426614174456",
            },
            {
              id: "123e4567-e89b-12d3-abcd-426614174456",
              credDefId: "123e4567-e89b-12d3-a456-426614174123",
              schemaId: "123e4567-e89b-12d3-a456-426614174123",
              ocaBundleUrl: "https://example.com/ocaBundle.json",
            },
          ],
          revocation: {
            id: "abcd4567-e89b-12d3-a456-426614174123",
            title: "Revocation Information",
            description: "This credential is revocable",
          },
          icon: {
            id: "123e4567-e89b-12d3-a456-426614174469",
            mediaType: "image/jpeg",
            content: "base64 encoded binary data",
            fileName: "asset.jpg",
            description: "A beautiful image of a cat",
          },
        },
      ],
      personas: {},
    },
  };

  const { showcaseJSON, setEditMode, editMode, personaState,setStepState } =
    useShowcaseStore();

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
      hidden: false,
    },
    values: {
      name: selectedIds.length > 0 ? Persona[selectedCharacter].name : "",
      role: selectedIds.length > 0 ? Persona[selectedCharacter].role : "",
      description:
        selectedIds.length > 0 ? Persona[selectedCharacter].description : "",
      hidden:
        selectedIds.length > 0 ? Persona[selectedCharacter].hidden : false,
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  const isEdited = !!Object.keys(form.formState.dirtyFields).length;

  // console.log('isEdited',isEdited);
  const createAssetAndPersona = async (
    headshotBase64: string | null | undefined,
    bodyBase64: string | null | undefined,
    persona: CharacterFormData
  ) => {
    try {
      const isEditing = selectedCharacter !== -1;
      const existingPersona = isEditing ? Persona[selectedCharacter] : null;
      const personaId = existingPersona?.id;
      console.log("isHidden", hiddenCharacters[selectedCharacter]);

      // console.log('Existing Persona',existingPersona);

      let headshotAssetId = existingPersona?.headshotImage?.id ?? undefined;
      let bodyAssetId = existingPersona?.bodyImage?.id ?? undefined;

      // ✅ Correctly detect removal
      const isHeadshotRemoved = isHeadShotImageEdited === false;
      const isBodyRemoved = isbodyImageEdited === false;

      console.log("isHeadShotImageEdited", isHeadShotImageEdited);
      console.log("isbodyImageEdited", isbodyImageEdited);
      console.log("isHeadshotRemoved", isHeadshotRemoved);
      console.log("isBodyRemoved", isBodyRemoved);
      console.log("Persona", persona);

      // ✅ Upload new images if edited
      if (isHeadShotImageEdited === true && headshotBase64) {
        const headshotPayload = {
          mediaType: "image/jpeg",
          content: headshotBase64,
          fileName: "Headshot.jpg",
          description: "A beautiful headshot image",
        };
        const headshotResponse: any = await apiClient.post<{ id: string }>("/assets", headshotPayload);
        headshotAssetId = headshotResponse.asset.id;
      } else if (isHeadshotRemoved) {
        headshotAssetId = null; // ✅ Mark as removed
      }

      if (isbodyImageEdited === true && bodyBase64) {
        const bodyPayload = {
          mediaType: "image/jpeg",
          content: bodyBase64,
          fileName: "Body.jpg",
          description: "A full-body image",
        };
        const bodyResponse: any = await apiClient.post<{ id: string }>("/assets", bodyPayload);
        bodyAssetId = bodyResponse.asset.id;
      } else if (isBodyRemoved) {
        bodyAssetId = null; // ✅ Mark as removed
      }

      // ✅ Correctly handle when no change is made (null state)
      const personaData: any = {
        name: persona.name,
        role: persona.role,
        description: persona.description,
        hidden:persona.hidden,
        headshotImage: isHeadShotImageEdited === null ? headshotAssetId : headshotAssetId,
        bodyImage: isbodyImageEdited === null ? bodyAssetId : bodyAssetId,
      };

      console.log("Final personaData:", personaData);

      let personaResponse;
      if (isEditing && personaId) {
        personaResponse = await apiClient.put(`/personas/${personaId}`, personaData);
        console.log("Persona Updated:", personaResponse);
      } else {
        personaResponse = await apiClient.post("/personas", personaData);
        console.log("Persona Created:", personaResponse);
      }

      GetPersona();

      // createShowcase("Credential Showcase BCGov", "Collection of credential usage scenarios", selectedIds);
      // setTimeout(() => {
      //   // router.push("/onboarding");
      //   router.push({
      //     pathname: "/onboarding",
      //     query: { personaIds: selectedIds }
      //   });
      // }, 500);
      return personaResponse;
    } catch (error) {
      console.error("Error in process:", error);
    }
  };

  const createShowcase = async (
    name: string | null,
    description: string | null,
    selectedPersonas: any
  ) => {
    try {
      const showcaseData = {
        name,
        description,
        status: "PENDING",
        hidden: false,
        scenarios: [""], // Empty array as per requirement
        credentialDefinitions: [""], // Empty array as per requirement
        personas: selectedPersonas, // Extracting only persona IDs
      };
      console.log("selectedPersonas", selectedPersonas);
      console.log("Creating Showcase with data:", showcaseData);

      const response = await apiClient.post("/showcases", showcaseData);

      console.log("Showcase Created:", response);
      return response;
    } catch (error) {
      console.error("Error creating showcase:", error);
    }
  };

  const deletePersona = async (personaId: string) => {
    try {
      if (!personaId) {
        console.error("Error: Persona ID is required for deletion.");
        return;
      }

      console.log("Deleting persona with ID:", personaId);

      // Step 1: Send DELETE request to the API
      await apiClient.delete(`/personas/${personaId}`);

      console.log("Persona deleted successfully!");

      // Step 2: Update the persona list after deletion
      GetPersona();
    } catch (error) {
      console.error("Error deleting persona:", error);
    }
  };

  const GetPersona = async () => {
    try {
      const data: any = await apiClient.get<any[]>("/personas");
      setPersona(data.personas);
    } catch (err) {
      console.log("Error :", err);
    }
  };

  useEffect(() => {
    console.log("selectedCharacter", selectedCharacter);
    GetPersona();
  }, []);

  const handleFormSubmit = async (data: CharacterFormData) => {
    // Check if the form is edited BEFORE resetting the form
    const isFormEdited = form.formState.isDirty;

    let obj = {
      ...data,
      headshotImage: headshotImage ?? "",
      bodyImage: bodyImage ?? "",
    };

    console.log("Obj", obj);
    console.log("hiddenCharacters", hiddenCharacters);
    console.log('isFormEdited:',isFormEdited);
    // Call API only if the form was edited
    if (isFormEdited) {
      console.log("called");
      await createAssetAndPersona(headshotImage ?? "", bodyImage ?? "", obj);
    }

    console.log("is Edit Mode", editMode);
    setEditMode(false);
    // setHeadshotImage(null); // Reset images after submission
    // setBodyImage(null);

    // // Reset form fields AFTER checking `isDirty`
    // form.reset();

    // // Redirect after 500ms
    // setTimeout(() => {
    //   router.push({
    //     pathname: "/onboarding",
    //     query: { personaIds: selectedIds },
    //   });
    // }, 500);
  };

  // const handleFormSubmit = async (data: CharacterFormData) => {
  //   let obj = {
  //     ...data,
  //     headshotImage: headshotImage ?? "",
  //     bodyImage: bodyImage ?? "",
  //   };
  //   // Method to Add/Update Persona
  //   if(form.formState.isDirty){
  //     console.log('called')
  //     createAssetAndPersona(headshotImage ?? "", bodyImage ?? "", obj);
  //   }

  //   console.log('is Edit Mode',editMode)
  //   setEditMode(false);
  //   setHeadshotImage(null); // Reset images after submission
  //   setBodyImage(null);
  //   form.reset(); // Reset form fields

  //   setTimeout(() => {
  //     // router.push("/onboarding");
  //     router.push({
  //       pathname: "/onboarding",
  //       query: { personaIds: selectedIds }
  //     });
  //   }, 500);

  // };

  const handleCancel = () => {
    form.reset();
    setHeadshotImage(null); // Reset images after submission
    setBodyImage(null);
    setEditMode(false);
  };

  const toggleSelect = (id: any) => {
    setSelectedIds((prev) => {
      const newSelectedIds = prev.includes(id)
        ? prev.filter((charId) => charId !== id) // Deselecting character
        : [...prev, id]; // Selecting character

      // If deselecting and the current selected character is the one being removed, reset it
      if (
        !newSelectedIds.includes(id) &&
        selectedCharacter === Persona.findIndex((c: any) => c.id === id)
      ) {
        setSelectedCharacter(0); // Reset to default (first character)
      } else {
        // Find the index of the selected character in Persona
        const selectedIndex = Persona.findIndex((c: any) => c.id === id);
        if (selectedIndex !== -1) {
          setSelectedCharacter(selectedIndex);
        }
      }
      return newSelectedIds;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCharacter(Number(e.currentTarget.value));
    setEditMode(false);
  };

  const toggleHidden = (personaId: string) => {
    setHiddenCharacters((prev) => ({
      ...prev,
      [personaId]: !prev[personaId],
    }));
  };

  return (
    <div className="flex bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text flex-col h-full w-full bg-gray-100">
      <div className="flex flex-col h-screen">
        <div className="flex gap-4 p-4 h-full">
          {/* Left Section - Character Selection with Header */}
          <div className="w-1/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-bold">
                {t("character.select_your_character_title")}
              </h2>
              <p className="text-sm">
                {t("character.select_your_character_subtitle")}
              </p>
            </div>

            {/* Character List */}
            <div className="flex-grow overflow-y-auto">
              {Persona &&
                Persona.map((char: any, index: number) => (
                  <div
                    key={char.id}
                    className={`hover:bg-light-bg dark:hover:bg-dark-input-hover relative p-4 border-t border-b border-light-border-secondary dark:border-dark-border flex ${
                      selectedIds.includes(char.id)
                        ? "flex-col items-center bg-gray-100 dark:bg-dark-bg border border-light-border-secondary"
                        : "flex-row items-center bg-white dark:bg-dark-bg-secondary"
                    }`}
                    onClick={() => {
                      toggleSelect(char.id);
                      setStepState('editing-persona')
                    }}
                  >
                    {selectedIds.includes(char.id) && (
                      <>
                        <div className="absolute left-0 top-4 bg-light-yellow text-light-text dark:text-dark-text px-4 py-2 text-sm font-medium rounded-tr-lg rounded-br-lg">
                          {t("character.selected_label")}
                        </div>
                        {isHidden && (
                          <div className="flex gap-2 items-center absolute top-4 left-24 bg-[#D9D9D9] text-light-text dark:text-dark-text px-4 py-2 text-sm font-medium rounded">
                            <EyeOff size={22} />
                            {t("character.hidden_label")}
                          </div>
                        )}
                      </>
                    )}

                    {/* {hiddenIds.includes(char.id) && (
                    <div className="absolute top-20 left-0 bg-red-200 text-red-800 px-4 py-2 text-sm font-medium rounded-tr-lg rounded-br-lg">
                      {t("character.hidden_label")}
                    </div>
                  )} */}
                    <div
                      className={`shrink-0 ${
                        selectedIds.includes(char.id) ? "mb-4 mt-10" : "mr-4"
                      }`}
                    >
                      <Image
                        src={
                          char.headshotImage?.content ||
                          "/assets/NavBar/Joyce.png"
                        }
                        alt={char.name}
                        width={selectedIds.includes(char.id) ? 100 : 50}
                        height={selectedIds.includes(char.id) ? 100 : 50}
                        className="rounded-full"
                      />
                    </div>

                    <div
                      className={`${
                        selectedIds.includes(char.id) ? "text-center" : "flex-1"
                      }`}
                    >
                      <h3 className="text-lg font-semibold">{char.name}</h3>
                      <p className="text-sm text-gray-600">{char.role}</p>
                      {selectedIds.includes(char.id) && (
                        <p className="text-xs text-gray-500 mt-2">
                          {char.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <ButtonOutline
                        onClick={() => {
                          // Find the correct index of the clicked character
                          const selectedIndex = Persona.findIndex(
                            (c: any) => c.id === char.id
                          );
                          setStepState('editing-persona')
                          setSelectedCharacter(selectedIndex);
                        }}
                        className={`${
                          selectedIds.includes(char.id) ? "mt-4" : "mt-0"
                        }`}
                      >
                        {t("action.edit_label")}
                      </ButtonOutline>
                    </div>
                  </div>
                ))}
            </div>

            {/* Create New Character Button (Stuck to Bottom) */}
            <div className="p-4 mt-auto">
              <ButtonOutline
                className="w-full"
                onClick={() => {
                  setStepState('creating-new');
                  form.reset();
                  // setEditMode(true);
                  setSelectedCharacter(-1);
                }}
              >
                {t("character.create_new_character_label")}
              </ButtonOutline>
            </div>
          </div>
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md p-6 flex flex-col">
            {personaState == "creating-new" ||
            personaState == "editing-persona" ? (
              <>
                <div>
                  <StepHeader
                    icon={<Monitor strokeWidth={3} />}
                    title={t("character.character_detail")}
                    onActionClick={(action) => {
                      switch (action) {
                        case "save":
                          console.log("Save Draft clicked");
                          break;
                        case "preview":
                          console.log("Preview clicked");
                          break;
                        case "revert":
                          console.log("Revert Changes clicked");
                          break;
                        case "delete":
                          selectedCharacter !== -1
                            ? (console.log("Delete Page clicked"),
                              setIsModalOpen(true),
                              setIsOpen(false))
                            : (console.log(
                                "Character not selected, modal not opened"
                              ),
                              setEditMode(false));
                          break;
                        default:
                          console.log("Unknown action");
                      }
                    }}
                  />
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                      <div>
                        <div className="flex-grow">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <FormTextInput
                                label={t("character.edit_name_label")}
                                name="name"
                                register={form.register}
                                error={form.formState.errors.name?.message}
                                placeholder={t(
                                  "character.edit_name_placeholder"
                                )}
                              />
                            </div>
                            <div>
                              <FormTextInput
                                label={t("character.edit_role_label")}
                                name="role"
                                register={form.register}
                                error={form.formState.errors.role?.message}
                                placeholder={t(
                                  "character.edit_role_placeholder"
                                )}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <FormTextArea
                              label={t("character.edit_description_label")}
                              name="description"
                              register={form.register}
                              error={form.formState.errors.description?.message}
                              placeholder={t(
                                "character.edit_description_placeholder"
                              )}
                            />
                          </div>

                          <div className="flex mt-4">
                            <button
                              //  onClick={() => {
                              //   const currentHiddenValue = form.getValues("hidden"); // Get current value
                              //   console.log("Current hidden value:", currentHiddenValue);

                              //   const newHiddenValue = !currentHiddenValue; // Toggle value
                              //   console.log("New hidden value:", newHiddenValue);

                              //   form.setValue("hidden", newHiddenValue, { shouldDirty: true }); // Update form state
                              // }}
                              //  onClick={() => toggleHidden(selectedCharacter)}
                              onClick={() => {
                                setIsHidden(!isHidden);
                              }}
                              className={`mt-1 relative min-w-10 h-6 flex items-center ${
                                isHidden
                                  ? "bg-[#008BE6] dark:bg-gray-600"
                                  : "bg-gray-300 dark:bg-gray-600"
                              } rounded-full p-[1] transition-all flex-shrink-0`}
                            >
                              <div
                                className={`w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md transition-all transform ${
                                  isHidden ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                            <div className="flex flex-col ml-4">
                              <span className="text-gray-700 font-semibold text-base">
                                {t("character.hide_character")}
                              </span>
                              <p className="text-sm text-gray-500 mt-1">
                                {t("character.hide_character_placeholder")}
                              </p>
                            </div>
                          </div>

                          {isHidden && (
                            <div className="w-full bg-[#FDF6EA] dark:bg-[#F9DAAC] p-6 mt-4 border-[1px] border-[#F9DAAC] rounded-md flex gap-2">
                              <CircleAlert size={22} />
                              <div>
                                <p className="text-light-text dark:text-dark-text text-sm font-semibold">
                                  {t("character.warning_label")}
                                </p>
                                <p className="text-light-text dark:text-dark-text text-sm font-semibold">
                                  {t("character.warning_placeholder_label")}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="text-start">
                              <FileUploadFull
                                text={t("character.headshot_image_label")}
                                element={"headshot_image"}
                                initialValue={
                                  selectedIds.includes(
                                    Persona[selectedCharacter]?.id
                                  )
                                    ? Persona[selectedCharacter]?.headshotImage
                                        ?.content || ""
                                    : ""
                                }
                                handleJSONUpdate={(imageType, imageData) => {
                                  console.log("Edited");
                                  setHeadshotImage(imageData);
                                  setHeadShotImageEdited(
                                    imageData === null || imageData === ""
                                      ? false
                                      : true
                                  );
                                }}
                              />
                            </div>
                            <div className="text-start">
                              <FileUploadFull
                                text={t("character.full_body_image_label")}
                                element={"body_image"}
                                initialValue={
                                  selectedIds.includes(
                                    Persona[selectedCharacter]?.id
                                  )
                                    ? Persona[selectedCharacter]?.bodyImage
                                        ?.content || ""
                                    : ""
                                }
                                handleJSONUpdate={(imageType, imageData) => {
                                  setBodyImage(imageData);
                                  setbodyImageEdited(
                                    imageData === null || imageData === ""
                                      ? false
                                      : true
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t flex justify-end gap-3">
                          <ButtonOutline
                            onClick={() => {
                              setStepState('no-selection');
                              handleCancel()
                            }}
                          >
                            {t("action.cancel_label")}
                          </ButtonOutline>
                          {/* <Link href="/onboarding"> */}
                          <ButtonOutline
                          // disabled={!isEdited}
                          >
                            {t("action.next_label")}
                          </ButtonOutline>
                          {/* </Link> */}
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </>
            ) : (
              <div className="self-center justify-center mt-[50%]">No Persona Selected</div>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={() => {
          setIsModalOpen(false);
          deletePersona(Persona[selectedCharacter].id);
        }}
        header="Are you sure you want to delete this character?"
        description="Are you sure you want to delete this character?"
        subDescription="<b>This action cannot be undone.</b>"
        cancelText="CANCEL"
        deleteText="DELETE"
      />
    </div>
  );
}
