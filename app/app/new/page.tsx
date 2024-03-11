import { Layout } from "@/components/ui/Layout";

import { Header } from "../_components/layout/Header";
import { Form } from "./_components/Form";

export default async function Page({ searchParams }: Readonly<{ searchParams: { isbn?: string } }>) {
	return (
		<Layout>
			<>
				<Header />
				<Form isbn={searchParams.isbn} />
			</>
			<></>
		</Layout>
	);
}
