"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import {
	CredentialFormData,
	SchemaData,
	IssuerData,
} from "@/schemas/credential";
import { Form } from "@/components/ui/form";
import { FormTextInput } from "../text-input";
import { FileUploadFull } from "../file-upload";
import { CredentialAttributes } from "./components/credential-attribute";
import ButtonOutline from "../ui/button-outline";
import { credentialDefinitionSchema } from "@/schemas/credential"; // Importing the Zod schema

export const CredentialsForm = () => {
	const {
		selectedCredential,
		selectedSchema,
		setIssuer,
		mode,
		updateCredentialImage,
	} = useCredentials();
	const t = useTranslations();
	const [formData, setFormData] = useState({
		name: "",
		version: "",
		revocation: false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDirty, setIsDirty] = useState(false);
	const form = useForm<CredentialFormData>({
		resolver: zodResolver(credentialDefinitionSchema), // Use the schema here, not the type
		mode: "onChange",
	});

	useEffect(() => {
		if (mode === "create" && selectedSchema) {
			form.reset({
				id: "",
				name: "",
				version: "",
				icon: {},
				representations: [],
				revocation: {},
				createdAt: "",
				updatedAt: "",
				schemaId: selectedSchema.id,
			});
		}
	}, [selectedSchema, mode, form]);

	const onSubmit = (data: CredentialFormData) => {
		if (mode === "create") {
			console.log("Creating credential", data);
			// Add creation logic here (merge schema and credential data to create the credential)
		}
	};

	const handleCancel = () => {
		// Add cancel logic (e.g., resetting the form or switching mode)
	};

	// If mode is "view" and a credential is selected, show details
	if (mode === "view" && selectedCredential) {
		const credentialDefinition = selectedCredential;
		console.log("Selected Credential in View Mode:", selectedCredential);

		const formattedDate = new Date(
			selectedCredential?.createdAt
		).toLocaleDateString("en-US", {
			weekday: "long", // "Monday"
			year: "numeric", // "2025"
			month: "long", // "March"
			day: "numeric", // "8"
		});

		const formattedTime = new Date(
			selectedCredential?.createdAt
		).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		});
		const handleChange = (e) => {
			const { name, value, type, checked } = e.target;
			setFormData((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
			setIsDirty(true);
		};

		const handleSubmit = (e) => {
			e.preventDefault();
			setIsSubmitting(true);

			// Perform validation using Zod
			const result = credentialDefinitionSchema.safeParse(formData);

			if (result.success) {
				console.log("Form Submitted Successfully:", formData);
				// Continue with submission logic (e.g., API call)
			} else {
				const newErrors: Record<string, string> = result.error.errors.reduce(
					(acc, error) => {
						acc[error.path[0]] = error.message;
						return acc;
					},
					{}
				);
				setErrors(newErrors);
				setIsSubmitting(false);
			}
		};
		return (
			<div className=" my-4">
				{/* Header */}
				<div className="flex items-center gap-x-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-bold text-foreground">
						{t("credentials.view_header_title")}
					</h3>
				</div>

				<div className="space-y-6">
					{/* Basic Information */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6 bg-gray-100 dark:bg-dark-bg shadow-md">
						{/* Icon (if available) */}
						{credentialDefinition.icon && (
							<div className="px-4 py-3">
								<h6 className="text-md font-bold">
									{t("credentials.icon_label")}
								</h6>
								<img
									src={`data:${credentialDefinition.icon.mediaType};base64,${credentialDefinition.icon.content}`}
									alt={
										credentialDefinition.icon.description || "Credential Icon"
									}
									className="w-24 h-24 rounded-lg shadow"
								/>
							</div>
						)}
						{[
							{
								label: "Created At:",
								value: `${formattedDate} at ${formattedTime}`,
							},
							{
								label: t("credentials.credential_name_label"),
								value: credentialDefinition?.name,
							},
							{
								label: t("credentials.issuer_name_label"),
								value: credentialDefinition?.issuer?.name,
							},

							{
								label: t("credentials.version_label"),
								value: credentialDefinition?.version,
							},
							{
								label: t("credentials.schema_id_label"),
								value: credentialDefinition?.schemaId,
							},
							{
								label: t("credentials.identifier_type_label"),
								value: credentialDefinition?.identifierType,
							},
							{
								label: t("credentials.identifier_label"),
								value: credentialDefinition?.identifier,
							},
							{
								label: t("credentials.type_label"),
								value: credentialDefinition?.type,
							},
							{
								label: t("credentials.revocation_label"),
								value: credentialDefinition?.revocation?.description,
							},
						].map((item, index) => (
							<div
								key={index}
								className="flex flex-col p-4 bg-white rounded-lg dark:bg-dark-bg-secondary shadow-sm space-y-2"
							>
								<h6 className="text-md font-semibold dark:text-white text-black">
									{item.label}
								</h6>
								<p className="text-sm font-medium text-gray-900 dark:text-white break-words">
									{item.value || "—"}
								</p>
							</div>
						))}

						{/* Displaying Attributes */}
						{credentialDefinition?.schema &&
							credentialDefinition.schema.attributes?.length > 0 && (
								<div className="col-span-2 space-y-4">
									<h6 className="text-md font-bold">
										{t("credentials.attributes_label")}
									</h6>
									{credentialDefinition.schema.attributes.map(
										(attribute, index) => (
											<div
												key={index}
												className="flex flex-col p-4 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm space-y-2"
											>
												<h6 className="text-md font-semibold dark:text-white text-black">
													{attribute.name || `Attribute ${index + 1}`}
												</h6>
												<p className="text-sm font-medium dark:text-white text-gray-900 break-words">
													{attribute.value || "—"}
												</p>
											</div>
										)
									)}
								</div>
							)}
					</div>
					<div
						className=" mx-4 flex items-center bg-[#F7F9FC] dark:bg-[#202223] dark:border-dark-border  border border-gray-300 rounded text-white text-sm font-bold px-4 py-3"
						role="alert"
					>
						<svg
							className="fill-current text-[#202223] dark:text-white w-4 h-4 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
						</svg>
						<p className="font-normal dark:text-white text-[#202223]">
							<span className="font-semibold">
								This credential is now available for use! <br />
							</span>
							You can select this credential when creating a{" "}
							<span className="font-semibold">Showcase </span>and assign it to
							any <span className="font-semibold">persona</span> in your
							scenario.
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Otherwise, render the form for "create" mode
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="my-4 flex flex-col"
			>
				<div className="flex items-center gap-x-2 px-4 py-3 border-b border-gray-200">
					<h3 className="text-lg font-bold text-foreground">
						{mode === "create"
							? t("credentials.add_header_title")
							: t("credentials.view_header_title")}
					</h3>
				</div>
				<div className="flex-1 overflow-auto p-4 space-y-4">
					{mode === "create" && (
						<>
							<div className="grid grid-cols-2 gap-4">
								<FormTextInput
									label={t("credentials.credential_name_label")}
									name="name"
									register={form.register}
									error={form.formState.errors.name?.message}
									placeholder={t("credentials.credential_name_placeholder")}
								/>
								<FormTextInput
									label={t("credentials.version_label")}
									name="version"
									register={form.register}
									error={form.formState.errors.version?.message}
									placeholder={t("credentials.version_placeholder")}
								/>
							</div>
							<div className="flex space-x-4">
								<label className="text-sm font-bold" htmlFor="issuanceCheckbox">
									{t("credentials.revocation_label")}
								</label>
								<div className="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										{...form.register("revocation")}
										className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
									/>
									<span className="text-sm">
										{t("credentials.revocation_checkbox_label")}
									</span>
								</div>
							</div>
							<div className="grid grid-cols-1 gap-4 mt-6">
								<div className="text-start">
									<FileUploadFull
										text={t("credentials.image_label")}
										name="Logo"
										handleJSONUpdate={updateCredentialImage}
									/>
								</div>
							</div>
						</>
					)}

					<CredentialAttributes mode="create" form={form} />
				</div>
				<div className="flex justify-end gap-4 mt-6">
					<ButtonOutline type="button" onClick={handleCancel}>
						{t("action.cancel_label")}
					</ButtonOutline>
					<ButtonOutline
						type="submit"
						disabled={
							mode === "create"
								? !form.formState.isDirty || !form.formState.isValid
								: false
						}
						className={`${
							form.formState.isDirty && form.formState.isValid
								? "cursor-pointer"
								: "cursor-not-allowed opacity-50"
						}`}
					>
						{mode === "create"
							? t("action.create_label")
							: t("action.save_label")}
					</ButtonOutline>
				</div>
			</form>
		</Form>
	);
};
