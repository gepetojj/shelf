import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";
import "@mantine/dropzone/styles.css";

import { Forms } from "./_components/forms";

export default async function Page() {
	return (
		<Layout>
			<>
				<AppHeader />
				<Forms />
			</>
			<></>
		</Layout>
	);
}
