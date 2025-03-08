"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialFormData, SchemaData } from "@/schemas/credential";
import { Form } from "@/components/ui/form";
import { FormTextInput } from "../text-input";
import { CredentialAttributes } from "./components/credential-attribute";
import ButtonOutline from "../ui/button-outline";
import { credentialDefinitionSchema } from "@/schemas/credential"; // Importing the Zod schema
import {
	ClipboardCopy,
	Tag,
	Hash,
	FileText,
	Database,
	Type,
} from "lucide-react";

export const CredentialsForm = () => {
	const { selectedCredential, selectedSchema, mode } = useCredentials();
	const t = useTranslations();

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
				attributes: selectedSchema?.attributes || [],
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
		return (
			<div className="space-y-6 my-4">
				{/* Header */}
				<div className="flex items-center gap-x-2 px-4 py-3 border-b border-gray-200">
					<h3 className="text-lg font-bold text-foreground">
						{t("credentials.view_header_title")}
					</h3>
				</div>

				<div className="space-y-6">
					{/* Basic Information */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6 bg-gray-100 rounded-xl shadow-md">
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
								className="flex flex-col p-4 bg-white rounded-lg shadow-sm space-y-2"
							>
								<h6 className="text-md font-semibold text-black">
									{item.label}
								</h6>
								<p className="text-sm font-medium text-gray-900 break-words">
									{item.value || "—"}
								</p>
							</div>
						))}
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
					)}
					{/* Pass attributes from selectedSchema in "create" mode */}
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
