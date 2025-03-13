"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { SortableStep } from "@/components/onboarding-screen/sortable-step";
import { useShowcaseStore } from "@/hooks/use-showcase-store";
import { useIssuanceStep, useOnboarding } from "@/hooks/use-onboarding";
import Image from "next/image";
import ButtonOutline from "../ui/button-outline";
import apiClient from "@/lib/apiService";
import { ErrorModal } from "../error-modal";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { useScenario } from "@/hooks/use-onboarding";

export const OnboardingScreen = () => {
  const t = useTranslations();
  const { showcaseJSON, selectedCharacter, personaIds } = useShowcaseStore();
  const {
    screens,
    selectedStep,
    initializeScreens,
    setSelectedStep,
    moveStep,
    removeStep,
    setStepState,
    stepState,
    setScenarioId,
    scenarioId
  } = useOnboarding();

  const {data, isLoading } = useIssuanceStep('credential-issuance-flow');
  // const {data, isLoading } = useScenario('credential-issuance-flow');
  // const {data, isLoading } = useScenario(scenarioId);

  console.log('Data from Query',data);
  
  // const [IsOnboarding, setIsOnboarding] = useState(Data);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setErrorModal] = useState(false);

  const scenarioData =  useScenario('credential-issuance-flow') || {}

  // Extract personas
  const personas = scenarioData.data?.issuanceScenario.personas || []; 

  let InitialId = personas.length > 0 ? personas[0]?.id : "";
  const [selectedPersonaId, setSelectedPersonaId] = useState(InitialId);

  // Find the selected persona
  const selectedPersona = personas.find((p:any) => p.id === selectedPersonaId) || null;

  const Steps = data ? data?.steps : []

  const initialScreens = useMemo(() => {
    return JSON.parse(JSON.stringify(Steps));
  }, [data]);


  useEffect(() => {
    initializeScreens(JSON.parse(JSON.stringify(Steps)));
  }, [initialScreens, initializeScreens]);

  useEffect(() => {
    // createScenario();
  }, []);



  const createScenario = async () => {
    try {
      setLoading(true);
      const scenarioData = {
        name: "Credential Issuance Flow",
        description: "This scenario issues credentials to users",
        steps: [
          {
            title: "Download BC wallet",
            description: "Download BC wallet to start your demo",
            order: 1,
            type: "HUMAN_TASK",
            asset: "345c45f0-c2d1-462c-981f-68c32bdb31c8",
            // subScenario: "123e4567-e89b-12d3-a456-434314174000",
            actions: [
              {
                title: "Download Wallet",
                text: "Download your wallet to continue",
                actionType: "ARIES_OOB",
                proofRequest: {
                  attributes: {
                    attribute1: {
                      attributes: ["attribute1", "attribute2"],
                      restrictions: ["restriction1", "restriction2"],
                    },
                  },
                  predicates: {
                    predicate1: {
                      name: "example_name",
                      type: "example_type",
                      value: "example_value",
                      restrictions: ["restriction1", "restriction2"],
                    },
                  },
                },
              },
            ],
          },
        ],
        personas: personaIds,
        hidden: false,
        issuer: "70692d76-319e-493b-b585-01e7f7b9cae4",
      };

      console.log('scenarioData',scenarioData)
      const response: any = await apiClient.post(
        "/scenarios/issuances",
        scenarioData
      );
      console.log("Scenario Created:", response);
      // console.log("Scenario:", response?.issuanceScenario);
      let Id = response?.issuanceScenario?.slug;
      console.log('Idd',Id);
      setScenarioId(Id);
      getIssuanceFlow(Id);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error creating scenario:", error);
      setLoading(false);
      setErrorModal(true);
      // throw error;
    }
  };

  const getIssuanceFlow = async (issuanceFlowId: string) => {
    try {
      setLoading(true);
      console.log(`Fetching issuance flow : ${issuanceFlowId}`);
      const response: any = await apiClient.get(
        `/scenarios/issuances/${issuanceFlowId}`
      );
      console.log("Issuance Flow Data:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error fetching issuance flow:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };


  const createIssuanceStep = async (issuanceFlowId: string, stepData: any) => {
    try {
      console.log(
        `Creating issuance step for flow: ${issuanceFlowId} with data:`,
        stepData
      );
      const response = await apiClient.post(
        `/scenarios/issuances/${issuanceFlowId}/steps`,
        stepData
      );
      console.log("Issuance Step Created:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error creating issuance step:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const updateIssuanceStep = async (
    issuanceFlowId: string,
    stepId: string,
    stepData: any
  ) => {
    try {
      console.log(
        `Updating issuance step ${stepId} for flow ${issuanceFlowId} with data:`,
        stepData
      );
      const response = await apiClient.put(
        `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}`,
        stepData
      );
      console.log("Issuance Step Updated:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error updating issuance step:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const createIssuanceStepAction = async (
    issuanceFlowId: string,
    stepId: string,
    actionData: any
  ) => {
    try {
      console.log(
        `Creating action for step ${stepId} in flow ${issuanceFlowId} with data:`,
        actionData
      );
      const response = await apiClient.post(
        `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions`,
        actionData
      );
      console.log("Issuance Step Action Created:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error creating issuance step action:", error);
      setLoading(false);
      setErrorModal(true);
    }
  };

  const updateIssuanceStepAction = async (
    issuanceFlowId: string,
    stepId: string,
    actionId: string,
    actionData: any
  ) => {
    try {
      console.log(
        `Updating action ${actionId} for step ${stepId} in flow ${issuanceFlowId} with data:`,
        actionData
      );
      const response = await apiClient.put(
        `/scenarios/issuances/${issuanceFlowId}/steps/${stepId}/actions/${actionId}`,
        actionData
      );
      console.log("Issuance Step Action Updated:", response);
      setLoading(false);
      return response;
    } catch (error) {
      console.error("Error updating issuance step action:", error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = screens.findIndex((screen) => screen.id === active.id);
    const newIndex = screens.findIndex((screen) => screen.id === over.id);

    if (oldIndex !== newIndex) {
      moveStep(oldIndex, newIndex);
      setSelectedStep(newIndex);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const index = screens.findIndex((screen) => screen.id === event.active.id);
    setSelectedStep(index);
  };

  return (
    <>
      {showErrorModal && (
        <ErrorModal
          errorText="Unknown error occurred"
          setShowModal={setErrorModal}
        />
      )}
      <>
        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading Scenario
          </div>
        )}
        <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
          <div className="flex bg-gray-100 rounded-md border-b">
            {/* {Data && Data.issuanceFlow.personas?.map((char: any, index: number) => ( */}
            {personas &&
              personas?.map((char: any, index: number) => (
                <div
                  key={char.id}
                  onClick={() => setSelectedPersonaId(char.id)}
                  className={`w-full p-4 text-center border ${
                    index === 0
                      ? "bg-white dark:bg-dark-bg shadow-md"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mb-2">
                      <Image
                        // src={char.headshotImage.content}
                        src={
                          ensureBase64HasPrefix(char.headshotImage?.content) ||
                          "/assets/NavBar/Joyce.png"
                        }
                        alt={char.name}
                        width={50}
                        height={50}
                        className="rounded-full aspect-square object-cover"
                      />
                    </div>

                    <div className="text-lg font-semibold">{char.name}</div>
                    <div className="text-sm text-gray-500">{char.role}</div>

                    {/* {stepState == "no-selection" && (
                  <div className="w-full mt-2 px-3 py-1 bg-yellow-400 text-xs font-semibold rounded">
                    Incomplete
                  </div>
                )} */}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex flex-cols">
            <div className="border-b w-full light-border dark:dark-border">
              <div className="p-4">
                <h2 className="text-base font-bold">
                  {t("onboarding.editing_steps_label", {
                    name: selectedPersona?.name,
                  })}
                  {/* {t("onboarding.editing_steps_label", { name: "Ana" })} */}
                </h2>
                <p className="text-xs">
                  {t("onboarding.editing_steps_message")}
                </p>
              </div>
            </div>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={screens.map((screen) => screen.id)}
              strategy={verticalListSortingStrategy}
            >
              {screens.map((screen, index) => (
                <div key={screen.id} className="flex flex-row">
                  <SortableStep
                    selectedStep={selectedStep}
                    myScreen={screen}
                    stepIndex={index + 1}
                    totalSteps={screens.length}
                  />
                </div>
              ))}

              <DragOverlay>
                {selectedStep !== null && Steps[selectedStep] && (
                  <div className="top-1">
                    <p>{Steps[selectedStep].title}</p>
                    <div className="highlight-container w-full flex flex-row justify-items-center items-center rounded p-3 unselected-item backdrop-blur">
                      <p className="text-sm">
                        {Steps[selectedStep].description}
                      </p>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        </div>

        <div className="p-4 mt-auto pt-10">
          <ButtonOutline
            onClick={() => {
              setStepState("creating-new");
              window.scrollTo({ top: 200, behavior: "smooth" });
            }}
            className="w-full"
          >
            {t("onboarding.add_step_label")}
          </ButtonOutline>
        </div>
      </>
    </>
  );
};
