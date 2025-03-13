import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialFormData, schemaAttribute } from "@/schemas/credential";
import apiClient from "@/lib/apiService"; // Import the API client
import Image from "next/image";
import { ensureBase64HasPrefix } from "@/lib/utils";

export const CredentialsDisplay = () => {
	const { setSelectedCredential, startCreating, viewCredential } =
		useCredentials();
	const [credentials, setCredentials] = useState<CredentialFormData[]>([]);
	const [openId, setOpenId] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const t = useTranslations();
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch credential definitions
				const definitionResponse = await apiClient.get<{
					credentialDefinitions: CredentialFormData[];
				}>("/credentials/definitions");

				if (definitionResponse?.credentialDefinitions) {
					setCredentials(definitionResponse.credentialDefinitions);
				} else {
					setError("Credential definitions not found.");
				}
			} catch (err) {
				setError("Failed to fetch data.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleSelectCredential = (
		credential: CredentialFormData & { id: string }
	) => {
		setSelectedCredential(credential);
		viewCredential(credential);
		setOpenId(credential.id);
	};

	const toggleDetails = (id: string) => {
		const credential = credentials.find((cred) => cred.id === id);
		if (openId === id) {
			setOpenId(null);
			setSelectedCredential(null);
		} else {
			setOpenId(id);
			handleSelectCredential(credential as CredentialFormData & { id: string });
		}
	};

	const handleCreate = () => {
		startCreating();
		setOpenId(null);
	};

	return (
		<div className="w-full h-full bg-white  dark:bg-dark-bg-secondary dark:border dark:border-dark-bg shadow-lg rounded-lg">
			<div className="p-4 border-b dark:border-dark-border">
				<h2 className="text-lg font-bold">
					{t("credentials.credential_title")}
				</h2>
				<p className="text-sm text-gray-400">
					{t("credentials.credential_subtitle")}
				</p>
			</div>

			<div className="mx-auto px-4 mt-4 mb-0">
				<div className="relative max-w-[550px] w-full">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={22}
					/>
					<Input
						type="text"
						placeholder={t("action.search_label")}
						className="bg-white dark:bg-dark-bg w-full pl-10 pr-3 py-4 border rounded-md text-light-text dark:text-dark-text "
					/>
				</div>
			</div>
			<hr className="border-gray-200 dark:border-dark-border" />
			{loading && <p className="text-center py-4">Loading credentials...</p>}
			{error && <p className="text-center text-red-500 py-4">{error}</p>}

			{!loading &&
				!error &&
				credentials.map((item:any) => (
					<div
						key={item.id}
						className="border-b dark:border-dark-border hover:bg-gray-100"
					>
						{openId === item.id ? (
							<div className="p-3 bg-light-bg flex flex-col dark:bg-dark-bg items-center text-center">
								<div className="flex flex-col py-2 w-full items-center">
									{/* Assuming item.icon is an object, render the relevant property */}
									<Image
									    alt={item?.icon?.fileName}
										src={ensureBase64HasPrefix(item?.icon?.content)|| ""}
										// src={item?.icon?.content}
										width={14}
										height={14}
										// src={`data:${item.icon};base64,${item.icon?.content}`}
										className="w-14 h-14 rounded-full shadow mb-4"
									/>

									<span className="text-md font-semibold">
										{item.name as string}
									</span>
									<span className="text-sm mt-1 text-black dark:text-gray-400">
										Version {item.version}
									</span>
									<span className="text-sm mt-1 text-black dark:text-gray-400"></span>
									<div className="flex flex-row gap-4 justify-center mt-1">
										{item.credentialSchema &&
										item.credentialSchema.attributes &&
										Array.isArray(item.credentialSchema.attributes) &&
										item.credentialSchema.attributes.length > 0 ? (
											<div className="mt-2 text-xs">
												<div className="flex flex-wrap gap-2">
													{item.credentialSchema.attributes.map((attr : any ) => (
														<span
															key={attr.id} // Using `id` for unique key
															className="bg-gray-200 dark:bg-dark-border px-2 py-1 rounded"
														>
															{attr.name}
														</span>
													))}
												</div>
											</div>
										) : (
											<p className="text-sm text-gray-500 dark:text-gray-400">
												Schema not available
											</p>
										)}
									</div>
								</div>
							</div>
						) : (
							<div
								className="flex justify-between items-center p-3 cursor-pointer"
								onClick={() => toggleDetails(item.id)}
							>
								<div className="flex items-center gap-3">
									{/* Render item.icon correctly if it's an object */}
									<div className="flex items-center gap-3">
										<img
											src={ensureBase64HasPrefix(item?.icon?.content)|| ""}
											// src={`data:${item.icon};base64,${item.icon?.content}`}
											className="w-10 h-10 rounded-full shadow "
										/>
									</div>
									<div>
										<p className="text-xs text-black dark:text-gray-200 font-bold">
											{item.name}
										</p>
										<p className="text-xs  text-gray-500 dark:text-gray-400">
											{item.version}
										</p>
									</div>
								</div>

								<div>
									<p className="text-xs text-black dark:text-gray-200 font-bold">
										{t('credentials.attributes_label')}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{item.credentialSchema && Array.isArray(item.credentialSchema.attributes)
											? item.credentialSchema.attributes.length
											: 0}
									</p>
								</div>
							</div>
						)}
					</div>
				))}

			<div className="flex flex-col items-center p-4">
				<ButtonOutline
					className="mt-4 border w-full py-2 rounded-md font-bold"
					onClick={handleCreate}
				>
					CREATE CREDENTIAL
				</ButtonOutline>
			</div>
		</div>
	);
};
