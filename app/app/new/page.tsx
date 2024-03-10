import { Header } from "../_components/Header";
import { Form } from "./_components/Form";

export default async function Page({ searchParams }: Readonly<{ searchParams: { isbn?: string } }>) {
	return (
		<>
			<section className="flex w-full max-w-[45rem] flex-col home-break:max-w-full">
				<Header />
				<Form isbn={searchParams.isbn} />
			</section>
			<div
				className="sticky hidden w-1/2 home-break:inline"
				aria-hidden="true"
			></div>
		</>
	);
}
