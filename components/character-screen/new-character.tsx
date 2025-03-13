"use client";

import { useShowcaseStore } from "@/hooks/use-showcase-store";
import Image from "next/image";
import { CircleAlert, EyeOff, Monitor } from "lucide-react";

import { useEffect, useState } from "react";
import { FileUploadFull } from "../file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormTextInput, FormTextArea } from "../text-input";
import { characterSchema } from "@/schemas/character";
import { useTranslations } from "next-intl";
import StepHeader from "../step-header";
import ButtonOutline from "../ui/button-outline";
import DeleteModal from "../delete-modal";
import apiClient from "@/lib/apiService";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { usePersonas, useDeletePersona } from "@/hooks/use-personas";

type CharacterFormData = z.infer<typeof characterSchema>;

export default function NewCharacterPage() {
  const t = useTranslations();
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headshotImage, setHeadshotImage] = useState<string | null>(null);
  const [isFormEdited, setIsFormEdited] = useState(false);
  const [isHeadShotImageEdited, setHeadShotImageEdited] = useState<
    boolean | null
  >(null);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [isbodyImageEdited, setbodyImageEdited] = useState<boolean | null>(
    null
  );
  const [Persona, setPersona] = useState<any>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const [hiddenCharacters, setHiddenCharacters] = useState<{
    [key: string]: boolean;
  }>({});

  const {
    setEditMode,
    editMode,
    personaState,
    setStepState,
    setPersonaIds,
    addPersonaId,
    showcaseId,
  } = useShowcaseStore();

  const { data, isLoading, error } = usePersonas();
  const { mutateAsync: deletePersona, isPending: isDeleting } = useDeletePersona();
  console.log('Personas' ,data)
  
  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
      hidden: false,
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (form.formState.isDirty || isHeadShotImageEdited || isbodyImageEdited) {
      setIsFormEdited(true);
    }
  }, [form.formState.isDirty, isHeadShotImageEdited, isbodyImageEdited]);

  const createAssetAndPersona = async (
    headshotBase64: string | null | undefined,
    bodyBase64: string | null | undefined,
    persona: CharacterFormData
  ) => {
    try {
      const isEditing = selectedCharacter !== -1;
      const existingPersona = isEditing ? Persona[selectedCharacter] : null;
      const personaId = existingPersona?.slug;

      let headshotAssetId = existingPersona?.headshotImage?.id ?? undefined;
      let bodyAssetId = existingPersona?.bodyImage?.id ?? undefined;

      const isHeadshotRemoved = isHeadShotImageEdited === false;
      const isBodyRemoved = isbodyImageEdited === false;

      if (isHeadShotImageEdited === true && headshotBase64) {
        const headshotPayload = {
          mediaType: "image/jpeg",
          content: headshotBase64,
          fileName: "Headshot.jpg",
          description: "A beautiful headshot image",
        };
        const headshotResponse: any = await apiClient.post<{ id: string }>(
          "/assets",
          headshotPayload
        );
        headshotAssetId = headshotResponse.asset.id;
      } else if (isHeadshotRemoved) {
        headshotAssetId = null;
      }

      if (isbodyImageEdited === true && bodyBase64) {
        const bodyPayload = {
          mediaType: "image/jpeg",
          content: bodyBase64,
          fileName: "Body.jpg",
          description: "A full-body image",
        };
        const bodyResponse: any = await apiClient.post<{ id: string }>(
          "/assets",
          bodyPayload
        );
        bodyAssetId = bodyResponse.asset.id;
      } else if (isBodyRemoved) {
        bodyAssetId = null;
      }

      const personaData: any = {
        name: persona.name,
        role: persona.role,
        description: persona.description,
        hidden: persona.hidden,
        headshotImage:
          isHeadShotImageEdited === null ? headshotAssetId : headshotAssetId,
        bodyImage: isbodyImageEdited === null ? bodyAssetId : bodyAssetId,
      };

      let personaResponse: any;
      if (isEditing && personaId) {
        personaResponse = await apiClient.put(
          `/personas/${personaId}`,
          personaData
        );
        console.log("Persona Updated:", personaResponse);
      } else {
        personaResponse = await apiClient.post("/personas", personaData);
        console.log("Persona Created:", personaResponse);
        setSelectedIds((prevIds) =>
          [...prevIds, personaResponse?.personas?.id].filter(Boolean)
        );
        addPersonaId(personaResponse?.personas?.id);
      }

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


  //Update a showcase
  
  const updateShowcase = async () => {
    try {
      const showcaseData = {
        name: "Credential Showcase BCGov",
        description: "Collection of credential usage scenarios",
        status: "PENDING",
        hidden: false,
        scenarios: ["871b9ac3-f7a5-42ee-80c8-14f1587cb83d"],
        credentialDefinitions: ["008a241c-a0c2-4897-ba59-519cd134c238"],
        personas: selectedIds,
        bannerImage: "008a241c-a0c2-4897-ba59-519cd134c238",
        completionMessage: "You have successfully completed the showcase",
      };

      const response: any = await apiClient.put(
        `/showcases/${showcaseId}`,
        showcaseData
      );
      console.log("Showcase Updated:", response);
      let Id = response?.showcase?.id;
      // setShowcaseId(Id);
      return response;
    } catch (error) {
      console.error("Error updating showcase:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (selectedCharacter !== null && Persona.length > 0) {
      const selectedPersona = Persona[selectedCharacter];

      form.setValue("name", selectedPersona?.name || "");
      form.setValue("role", selectedPersona?.role || "");
      form.setValue("description", selectedPersona?.description || "");
      form.setValue(
        "hidden",
        selectedIds.length > 0 ? selectedPersona.hidden : false
      );
    }
  }, [selectedCharacter, Persona]);

  const handleFormSubmit = async (data: CharacterFormData) => {
    // Check if the form is edited BEFORE resetting the form
    // const isFormEdited = form.formState.isDirty;
    console.log("data", data);
    console.log("is form ", isFormEdited);
    
    let obj = {
      ...data,
      headshotImage: headshotImage ?? "",
      bodyImage: bodyImage ?? "",
    };

    console.log("bodyimage", bodyImage);
    console.log("head", headshotImage);
    console.log("obj", obj);

    if (isFormEdited) {
      console.log("called");
      await createAssetAndPersona(headshotImage ?? "", bodyImage ?? "", obj);

      // form.reset();
      setIsFormEdited(false);
    } else {
      // setTimeout(() => {
      //   router.push({
      //     pathname: "/onboarding",
      //     query: { personaIds: selectedIds },
      //   });
      // }, 500);
    }

    setEditMode(false);
    setPersonaIds(selectedIds);
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

  const toggleSelect = (slug: string) => {
    setSelectedIds((prev) => {
      const newSelectedIds = prev.includes(slug)
        ? prev.filter((charId) => charId !== slug) // Deselecting character
        : [...prev, slug]; // Selecting character

      // If deselecting and the current selected character is the one being removed, reset it
      if (
        !newSelectedIds.includes(slug) &&
        selectedCharacter === Persona.findIndex((c: any) => c.slug === slug)
      ) {
        setSelectedCharacter(null); // Reset to default (first character)
        setStepState("no-selection");
      } else {
        // Find the index of the selected character in Persona
        const selectedIndex = Persona.findIndex((c: any) => c.slug === slug);
        if (selectedIndex !== -1) {
          setSelectedCharacter(selectedIndex);
        }
      }
      return newSelectedIds;
    });
  };

  // const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   setSelectedCharacter(Number(e.currentTarget.value));
  //   setEditMode(false);
  // };

  // const toggleHidden = (personaId: string) => {
  //   setHiddenCharacters((prev) => ({
  //     ...prev,
  //     [personaId]: !prev[personaId],
  //   }));
  // };

  // useEffect(() => {
  //   console.log("isDirty changed:", form.formState.isDirty);
  // }, [form.formState.isDirty]);

  return (
    <div className="flex bg-light-bg dark:bg-dark-bg dark:text-dark-text text-light-text flex-col h-full w-full">
      <div className="flex flex-col h-screen">
        <div className="flex gap-4 p-4 h-full">

          <div className="w-1/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-bold">
                {t("character.select_your_character_title")}
              </h2>
              <p className="text-sm">
                {t("character.select_your_character_subtitle")}
              </p>
            </div>

            {isLoading ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                  Loading characters
                </div>
              </>
            ) : (
              <div className="flex-grow overflow-y-auto">
                {data?.personas &&
                  data?.personas?.map((char: any) => (
                    <div
                      key={char.slug}
                      className={`hover:bg-light-bg dark:hover:bg-dark-input-hover relative p-4 border-t border-b border-light-border-secondary dark:border-dark-border flex ${
                        selectedIds.includes(char.slug)
                          ? "flex-col items-center bg-gray-100 dark:bg-dark-bg border border-light-border-secondary"
                          : "flex-row items-center bg-white dark:bg-dark-bg-secondary"
                      }`}
                      onClick={() => {
                        toggleSelect(char.slug);
                        setStepState("editing-persona");
                      }}
                    >
                      {selectedIds.includes(char.slug) && (
                        <>
                          <div className="absolute left-0 top-4 bg-light-yellow text-light-text dark:text-dark-text px-4 py-2 text-sm font-medium rounded-tr-lg rounded-br-lg">
                            {t("character.selected_label")}
                          </div>
                          {char.hidden && (
                            <div className="flex gap-2 items-center absolute top-4 left-24 bg-[#D9D9D9] text-light-text dark:text-dark-text px-4 py-2 text-sm font-medium rounded">
                              <EyeOff size={22} />
                              {t("character.hidden_label")}
                            </div>
                          )}
                        </>
                      )}

                      {/* {hiddenIds.includes(char.slug) && (
                    <div className="absolute top-20 left-0 bg-red-200 text-red-800 px-4 py-2 text-sm font-medium rounded-tr-lg rounded-br-lg">
                      {t("character.hidden_label")}
                    </div>
                  )} */}
                      <div
                        className={`shrink-0 ${
                          selectedIds.includes(char.slug) ? "mb-4 mt-12" : "mr-4"
                        }`}
                      >
                        <Image
                          src={
                            char.headshotImage?.content
                              ? ensureBase64HasPrefix(
                                  char.headshotImage.content
                                )
                              : "/assets/NavBar/Joyce.png"
                          }
                          alt={char.name}
                          width={selectedIds.includes(char.slug) ? 100 : 50}
                          height={selectedIds.includes(char.slug) ? 100 : 50}
                          className="rounded-full aspect-square object-cover"
                        />
                      </div>

                      <div
                        className={`${
                          selectedIds.includes(char.slug)
                            ? "text-center"
                            : "flex-1"
                        }`}
                      >
                        <h3 className="text-lg font-semibold">{char.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {char.role}
                        </p>
                        {selectedIds.includes(char.slug) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {char.description}
                          </p>
                        )}
                      </div>
                      <div>
                        <ButtonOutline
                          onClick={() => {
                            const selectedIndex = Persona.findIndex(
                              (c: any) => c.slug === char.slug
                            );
                            setStepState("editing-persona");
                            setSelectedCharacter(selectedIndex);
                          }}
                          className={`${
                            selectedIds.includes(char.slug) ? "mt-4" : "mt-0"
                          }`}
                        >
                          {t("action.edit_label")}
                        </ButtonOutline>
                        {selectedIds.includes(char.slug) && (
                          <ButtonOutline
                            onClick={() => {
                              deletePersona(char.slug);
                              setStepState("editing-persona");
                              setSelectedCharacter(null);
                            }}
                          >
                            {t("action.delete_label")}
                          </ButtonOutline>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="p-4 mt-auto">
              <ButtonOutline
                className="w-full"
                onClick={() => {
                  setStepState("creating-new");
                  form.reset();
                  setSelectedCharacter(null);
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
                          selectedCharacter !== null
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
                              type="button"
                              onClick={() => {
                                if (
                                  selectedCharacter === null ||
                                  selectedCharacter >= Persona.length
                                )
                                  return;

                                const personaSlug = Persona[selectedCharacter].slug;
                                const newHiddenValue =
                                  !form.getValues("hidden");
                                form.setValue("hidden", newHiddenValue, {
                                  shouldDirty: true,
                                  shouldTouch: true,
                                  shouldValidate: true,
                                });
                                setPersona((prev: any) =>
                                  prev.map((char: any) =>
                                    char.slug === personaSlug
                                      ? { ...char, hidden: newHiddenValue }
                                      : char
                                  )
                                );
                              }}
                              className={`mt-1 relative min-w-10 h-6 flex items-center ${
                                form.watch("hidden")
                                  ? "bg-[#008BE6] dark:bg-gray-600"
                                  : "bg-gray-300 dark:bg-gray-600"
                              } rounded-full p-[1] transition-all flex-shrink-0`}
                            >
                              <div
                                className={`w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md transition-all transform ${
                                  form.watch("hidden")
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              />
                            </button>
                            <div className="flex flex-col ml-4">
                              <span className="text-gray-700 dark:text-white font-semibold text-base">
                                {t("character.hide_character")}
                              </span>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t("character.hide_character_placeholder")}
                              </p>
                            </div>
                          </div>

                          {form.watch("hidden") && (
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
                                // initialValue={
                                //   selectedIds.includes(
                                //     Persona[selectedCharacter]?.id
                                //   )
                                //     ? Persona[selectedCharacter]?.headshotImage
                                //         ?.content || ""
                                //     : ""
                                // }
                                initialValue={
                                  selectedIds.includes(
                                    Persona[selectedCharacter]?.slug
                                  )
                                    ? ensureBase64HasPrefix(
                                        Persona[selectedCharacter]
                                          ?.headshotImage.content
                                      ) || ""
                                    : ""
                                }
                                handleJSONUpdate={(imageType, imageData) => {
                                  console.log("Edited");
                                  setHeadshotImage(imageData);
                                  setIsFormEdited(true);
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
                                    Persona[selectedCharacter]?.slug
                                  )
                                    ? ensureBase64HasPrefix(
                                        Persona[selectedCharacter]?.bodyImage
                                          .content
                                      ) || ""
                                    : ""
                                }
                                handleJSONUpdate={(imageType, imageData) => {
                                  setBodyImage(imageData);
                                  setIsFormEdited(true);
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
                              setStepState("no-selection");
                              handleCancel();
                            }}
                          >
                            {t("action.cancel_label")}
                          </ButtonOutline>
                          {/* <Link href="/onboarding"> */}
                          <ButtonOutline
                            type="submit"
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
              <div className="self-center justify-center mt-[23%]">
                No Persona Selected
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={() => {
          setIsModalOpen(false);
          console.log('Persona[selectedCharacter].id',selectedCharacter)
          // deletePersona({Persona[selectedCharacter].id});
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
