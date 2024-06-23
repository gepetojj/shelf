import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";

import { Tabs } from "./_components/tabs";

export default async function Page() {
	return (
		<>
			<Layout>
				<>
					<AppHeader />
					<div className="flex flex-col px-4 py-4 pb-10 sm:px-12">
						<Tabs />
					</div>
				</>
				<></>
			</Layout>
		</>
	);
}
