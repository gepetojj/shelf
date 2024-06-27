import { Metadata } from "next";

import { getURL } from "@/lib/url";

export const defaultMetadata: Metadata = {
	title: {
		default: "Shelf: Organize suas leituras",
		template: "%s | Shelf",
	},
	description:
		"Transforme a maneira como você lê, organiza e compartilha conhecimento com o Shelf, o aplicativo definitivo para apaixonados por livros e PDFs. " +
		"Com o Shelf, você terá uma biblioteca digital sempre ao seu alcance, onde quer que esteja.",
	applicationName: "Shelf",
	keywords: [
		"Shelf",
		"leitura",
		"organização",
		"livros",
		"pdfs",
		"biblioteca digital",
		"conhecimento",
		"compartilhamento",
	],
	creator: "João Pedro <gepeto@shelfbooks.club>",
	openGraph: {
		title: "Shelf: Organize suas leituras",
		description:
			"Transforme a maneira como você lê, organiza e compartilha conhecimento com o Shelf, a solução perfeita para aprimorar sua experiência de leitura. Com o Shelf, você terá uma biblioteca digital sempre ao seu alcance, onde quer que esteja.",
		type: "website",
		siteName: "Shelf",
		locale: "pt_BR",
		url: getURL(),
		images: [
			{
				url: `${getURL()}/api/og`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Shelf: Organize suas leituras",
		description:
			"Transforme a maneira como você lê, organiza e compartilha conhecimento com o Shelf, a solução perfeita para aprimorar sua experiência de leitura. Com o Shelf, você terá uma biblioteca digital sempre ao seu alcance, onde quer que esteja.",
		images: [
			{
				url: `${getURL()}/api/og`,
			},
		],
	},
	category: "Books & Literature",
};
