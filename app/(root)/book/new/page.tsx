import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import "@mantine/dropzone/styles.css";

import { Form } from "./_components/form";

export default async function Page({ searchParams }: Readonly<{ searchParams: { isbn?: string } }>) {
	return (
		<Layout>
			<>
				<AppHeader />
				<Form isbn={searchParams.isbn} />
			</>
			<></>
		</Layout>
	);
}
