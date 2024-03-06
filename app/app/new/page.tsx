import { Header } from "../_components/Header";
import { Form } from "./_components/Form";

export default async function Page({ searchParams }: Readonly<{ searchParams: { isbn?: string } }>) {
	return (
		<>
			<section className="flex w-full flex-col">
				<Header />
				<Form isbn={searchParams.isbn} />
			</section>
			<div
				className="sticky w-1/2"
				aria-hidden="true"
			></div>
		</>
	);
}
