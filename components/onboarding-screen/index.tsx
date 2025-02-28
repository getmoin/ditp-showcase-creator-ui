"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextArea, FormTextInput } from "@/components/text-input";
import { Edit } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { BasicStepFormData } from "@/schemas/onboarding";
import { basicStepSchema } from "@/schemas/onboarding";
import { LocalFileUpload } from "./local-file-upload";
import { useTranslations } from "next-intl";
import { OnboardingScreen } from "./onboarding-screen";
import { OnboardingSteps } from "./onboarding-steps";

export const OnboardingMain = () => {
  const t = useTranslations();
  // const {
  //   screens,
  //   selectedStep,
  //   setSelectedStep,
  //   updateStep,
  //   setStepState,
  //   stepState
  // } = useOnboarding();

  // const currentStep = selectedStep !== null ? screens[selectedStep] : null;
  // const isEditMode = stepState === "editing-basic";

  // const defaultValues = currentStep
  //   ? {
  //       title: currentStep.title,
  //       text: currentStep.text,
  //       image: currentStep.image || "",
  //     }
  //   : {
  //       title: "",
  //       text: "",
  //       image: "",
  //     };

  // const form = useForm<BasicStepFormData>({
  //   resolver: zodResolver(basicStepSchema),
  //   defaultValues,
  //   mode: 'all',
  // });

  // React.useEffect(() => {
  //   if (currentStep) {
  //     form.reset({
  //       title: currentStep.title,
  //       text: currentStep.text,
  //       image: currentStep.image || "",
  //     });
  //   }
  // }, [currentStep, form]);

  // const onSubmit = (data: BasicStepFormData) => {
  //   if (selectedStep !== null) {
  //     updateStep(selectedStep, {
  //       ...screens[selectedStep],
  //       ...data,
  //     });
  //     setStepState('no-selection');
  //     setSelectedStep(null);
  //   }
  // };

  // const handleCancel = () => {
  //   form.reset();
  //   setStepState('no-selection');
  //   setSelectedStep(null);
  // };

  // if (selectedStep === null) {
  //   return null;
  // }

  // if (!isEditMode && currentStep) {
  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-between mt-3">
  //         <div>
  //           <p className="text-foreground text-sm">{t('onboarding.section_title')}</p>
  //           <h3 className="text-2xl font-bold text-foreground">
  //             {t('onboarding.details_step_header_title')}
  //           </h3>
  //         </div>
  //         <Button
  //           variant="outline"
  //           onClick={() => setStepState("editing-basic")}
  //           className="flex items-center gap-2"
  //         >
  //           <Edit className="h-4 w-4" />
  //           {t('action.edit_label')}
  //         </Button>
  //       </div>
  //       <hr />

  //       <div className="space-y-6">
  //         <div className="space-y-2">
  //           <h4 className="text-sm font-medium text-muted-foreground">
  //             {t('onboarding.page_title_label')}
  //           </h4>
  //           <p className="text-lg">{currentStep.title}</p>
  //         </div>

  //         <div className="space-y-2">
  //           <h4 className="text-sm font-medium text-muted-foreground">
  //             {t('onboarding.page_description_label')}
  //           </h4>
  //           <p className="text-lg whitespace-pre-wrap">{currentStep.text}</p>
  //         </div>

  //         {currentStep.image && (
  //           <div className="space-y-2">
  //             <h4 className="text-sm font-medium text-muted-foreground">
  //               {t('onboarding.icon_label')}
  //             </h4>
  //             <div className="w-32 h-32 rounded-lg overflow-hidden border">
  //               <img
  //                 src={currentStep.image}
  //                 alt="Step icon"
  //                 className="w-full h-full object-cover"
  //               />
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  //     <div className="flex flex-col min-h-screen">
  //     <div className="flex gap-12 container mx-auto px-4 py-8 mt-20">
  //       <div className="w-2/5 rounded left-col text-light-text dark:text-dark-text">
  //         <div className="flex w-full">
  //           <div>
  //             <h2 className="text-4xl font-bold text-foreground">
  //               {t("header_title")}
  //             </h2>
  //             <p className="w-full mt-3">{t("header_subtitle")}</p>
  //           </div>
  //         </div>

  //         <OnboardingScreen />
  //       </div>
  //       <OnboardingSteps />
  //     </div>
  //   </div>
  // );
 

  return (
    <div className="flex text-light-text bg-light-bg dark:bg-dark-bg dark:text-dark-text flex-col h-full w-full bg-gray-100">
      <div className="flex flex-col h-full">
        <div className="flex gap-4 p-4 h-full">
          {/* Left Section - Character Selection with Header */}
          <div className="w-1/3 bg-[white] dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
          <div className="p-4 border-b shadow">
              <h2 className="text-base font-bold text-foreground">
                {t("onboarding.header_title")}
              </h2>
              <p className="w-full text-xs">{t("onboarding.header_subtitle")}</p>
          </div>
            <OnboardingScreen />
          </div>
          {/* Right Section - Character Details with Header */}
          <div className="w-2/3 bg-white dark:bg-dark-bg-secondary border shadow-md rounded-md flex flex-col">
            <OnboardingSteps />
          </div>
        </div>
      </div>
    </div>
  );
};
