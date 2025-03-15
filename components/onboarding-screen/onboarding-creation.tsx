"use client";

import { useEffect, useState } from "react";
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
import { useOnboarding } from "@/hooks/use-onboarding";
import Image from "next/image";
import ButtonOutline from "../ui/button-outline";
import { ErrorModal } from "../error-modal";
import { ensureBase64HasPrefix } from "@/lib/utils";
import { useShowcaseStore } from "@/hooks/use-showcases-store";
import { toast } from "sonner";
import { Persona } from "@/openapi-types";

const createDefaultStep = (id: string) => ({
  id,
  title: "New Step",
  description: "Description for this step",
  action: "NEXT",
  type: "DISPLAY",
  conditions: [],
  order: 0
});

export const CreateOnboardingScreen = () => {
  const t = useTranslations();
  const {
    screens,
    selectedStep,
    initializeScreens,
    setSelectedStep,
    moveStep,
    setStepState,
    addStep,
    removeStep,
    updateStep
  } = useOnboarding();

  const [showErrorModal, setErrorModal] = useState(false);
  const { displayShowcase } = useShowcaseStore();

  const personas = displayShowcase.personas || [];
  const initialId = personas.length > 0 ? personas[0]?.id : "";
  const [selectedPersonaId, setSelectedPersonaId] = useState(initialId);

  // Find the selected persona
  const selectedPersona = personas.find((p: Persona) => p.id === selectedPersonaId) || null;
  // Initialize with empty screens if creating new
  useEffect(() => {
    // Create a default first step if there are none
    if (!screens || screens.length === 0) {
      const defaultScreens = [
        createDefaultStep("intro-step"),
        createDefaultStep("credential-step")
      ];
      
      defaultScreens[0].title = "Introduction";
      defaultScreens[0].description = "Welcome to this showcase. Here you'll learn about digital credentials.";
      
      defaultScreens[1].title = "Credential Overview";
      defaultScreens[1].description = "In this step, you'll see how credentials work.";
      
      defaultScreens.forEach((screen, index) => {
        screen.order = index;
      });
      
      initializeScreens(defaultScreens);
    }
  }, [initializeScreens, screens]);

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

  const handleAddStep = () => {
    const newId = `step-${Date.now()}`;
    const newStep = createDefaultStep(newId);
    newStep.order = screens.length;
    addStep(newStep);
    toast.success("New step added");
  };

  return (
    <>
      {showErrorModal && (
        <ErrorModal
          errorText="Unknown error occurred"
          setShowModal={setErrorModal}
        />
      )}

      <div className="bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text rounded-md border shadow-sm">
        {personas.length === 0 ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">No personas selected</h3>
            <p className="mb-4">You need to select personas before creating onboarding steps.</p>
            <ButtonOutline
              onClick={() => window.history.back()}
            >
              Go Back to Select Personas
            </ButtonOutline>
          </div>
        ) : (
          <>
            <div className="flex bg-gray-100 rounded-t-md border-b">
              {personas.map((persona: any, index: number) => (
                <div
                  key={persona.id}
                  onClick={() => setSelectedPersonaId(persona.id)}
                  className={`w-full p-4 text-center cursor-pointer transition-colors duration-200 ${
                    selectedPersonaId === persona.id
                      ? "bg-white dark:bg-dark-bg shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mb-2 overflow-hidden">
                      <Image
                        src={
                          persona.headshotImage?.content
                            ? ensureBase64HasPrefix(persona.headshotImage.content)
                            : "/assets/NavBar/Joyce.png"
                        }
                        alt={persona.name}
                        width={50}
                        height={50}
                        className="rounded-full aspect-square object-cover"
                      />
                    </div>

                    <div className="text-lg font-semibold">{persona.name}</div>
                    <div className="text-sm text-gray-500">{persona.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b w-full light-border dark:dark-border">
              <div className="p-4">
                <h2 className="text-base font-bold">
                  {selectedPersona?.name || "Persona"}
                </h2>
                <p className="text-xs">
                  {t("onboarding.editing_steps_message")}
                </p>
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
                {screens.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No steps created yet. Click the button below to add your first step.</p>
                  </div>
                ) : (
                  screens.map((screen, index) => (
                    <div key={screen.id} className="flex flex-row">
                      <SortableStep
                        selectedStep={selectedStep}
                        myScreen={screen}
                        stepIndex={index + 1}
                        totalSteps={screens.length}
                        onDelete={() => removeStep(index)}
                        onEdit={() => {
                          setSelectedStep(index);
                          setStepState("editing");
                        }}
                      />
                    </div>
                  ))
                )}

                <DragOverlay>
                  {selectedStep !== null && screens[selectedStep] && (
                    <div className="top-1">
                      <p>{screens[selectedStep].title}</p>
                      <div className="highlight-container w-full flex flex-row justify-items-center items-center rounded p-3 unselected-item backdrop-blur">
                        <p className="text-sm">
                          {screens[selectedStep].description}
                        </p>
                      </div>
                    </div>
                  )}
                </DragOverlay>
              </SortableContext>
            </DndContext>

            <div className="p-4 mt-auto border-t">
              <ButtonOutline
                onClick={handleAddStep}
                className="w-full"
              >
                {t("onboarding.add_step_label") || "Add Step"}
              </ButtonOutline>
            </div>
          </>
        )}
      </div>
    </>
  );
};