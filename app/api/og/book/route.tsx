import { ImageResponse } from "next/og";

import { loadGoogleFont } from "../loadGoogleFont";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const hasTitle = searchParams.has("title");
	const title = hasTitle ? searchParams.get("title")?.slice(0, 100) : "Arquivos PDF.";

	const font = await loadGoogleFont("Nunito Sans", "");

	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					textAlign: "center",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					flexWrap: "nowrap",
					backgroundColor: "#1C1C1C",
					backgroundImage:
						"radial-gradient(circle at 25px 25px, #262626 2%, transparent 0%), radial-gradient(circle at 75px 75px, #262626 2%, transparent 0%)",
					backgroundSize: "100px 100px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						width: "100%",
						height: "100%",
						padding: "5rem",
					}}
				>
					<svg
						width={700}
						height={600}
						viewBox="0 0 75 65"
						style={{ width: "700px", height: "600px", top: "68%", left: "12%", position: "absolute" }}
					>
						<path
							d="M4.332.688c.125.496-.16 1-.633 1.128a.843.843 0 0 1-.547-.035L1.754 2.984c.012.075.016.149.012.22l1.945.987a.84.84 0 0 1 .414-.257c.473-.133.957.164 1.082.656.125.492-.16.996-.629 1.129a.825.825 0 0 1-.351.02L2.59 7.14a.907.907 0 0 1-.656.828c-.473.129-.957-.164-1.082-.657-.122-.496.16-1 .632-1.128a.849.849 0 0 1 .766.164l1.305-1.121a1.022 1.022 0 0 1-.07-.22L1.358 3.93a.807.807 0 0 1-.25.113.878.878 0 0 1-1.078-.656c-.125-.492.157-1 .63-1.13a.856.856 0 0 1 .605.06L2.62 1.151C2.5.66 2.781.16 3.25.032c.473-.13.957.163 1.082.655Zm4.09 5.48c.34.105.71.156 1.11.156.41 0 .765-.062 1.062-.195.304-.133.539-.32.699-.563.164-.238.246-.515.246-.832 0-.375-.117-.675-.351-.898-.231-.227-.586-.39-1.063-.496l-.79-.172c-.276-.063-.476-.145-.589-.246a.58.58 0 0 1-.176-.438.69.69 0 0 1 .285-.57c.188-.144.446-.215.778-.215.574 0 1.058.172 1.46.524l.282-.72a2.064 2.064 0 0 0-.758-.452 2.863 2.863 0 0 0-.976-.164c-.391 0-.735.066-1.032.203-.3.137-.53.324-.703.57-.168.246-.25.531-.25.863 0 .766.453 1.247 1.356 1.446l.797.172c.296.066.507.148.625.25a.488.488 0 0 1 .191.41c0 .21-.09.383-.262.52-.172.128-.449.195-.832.195a2.8 2.8 0 0 1-1.695-.547l-.281.758c.234.183.523.332.867.441ZM12.246.961V6.25h.902V4.187c0-.285.079-.511.23-.683.161-.176.372-.262.638-.262.218 0 .375.067.476.196.106.128.16.335.16.62V6.25h.903V4.016c0-1.004-.418-1.508-1.25-1.508-.246 0-.47.05-.672.156-.2.098-.367.254-.485.45V.96Zm0 0"
							style={{
								stroke: "none",
								fillRule: "nonzero",
								fill: "#f5e02f",
								fillOpacity: 1,
							}}
						/>
						<path
							d="M17.18 6.094c.289.152.633.23 1.03.23.259 0 .513-.043.767-.125a1.87 1.87 0 0 0 .636-.347l-.254-.63c-.16.133-.343.235-.539.301-.195.059-.394.09-.593.09-.657 0-1.016-.328-1.082-.984h2.527v-.277c0-.57-.149-1.02-.442-1.348-.289-.332-.683-.496-1.183-.496-.344 0-.649.082-.918.246-.266.16-.473.383-.629.668a2.133 2.133 0 0 0-.223 1c0 .387.078.726.23 1.012.157.28.391.511.673.66Zm.258-2.696a.862.862 0 0 1 .644-.253c.254 0 .453.082.594.246.14.16.222.394.242.699h-1.773c.03-.29.128-.52.293-.692Zm0 0"
							style={{
								stroke: "none",
								fillRule: "evenodd",
								fill: "#f5e02f",
								fillOpacity: 1,
							}}
						/>
						<path
							d="M20.684 5.973c.199.234.511.351.93.351.171 0 .347-.023.519-.066l.015-.742c-.05.015-.101.023-.152.03-.055.005-.105.005-.16.005-.363 0-.547-.223-.547-.672V.96h-.902v3.96c0 .462.097.813.293 1.052Zm2.175-2.684V6.25h.903V3.29h.96v-.708h-.96v-.156c0-.25.062-.438.18-.563.12-.129.328-.207.613-.226l.336-.024-.059-.687-.355.023c-.555.035-.961.184-1.227.45-.262.265-.39.656-.39 1.175v.008h-.68v.707Zm2.13 1.918V6.25H26V5.207Zm0 0"
							style={{
								stroke: "none",
								fillRule: "nonzero",
								fill: "#f5e02f",
								fillOpacity: 1,
							}}
						/>
					</svg>
					<span
						style={{
							display: "flex",
							alignItems: "flex-end",
							justifyContent: "center",
							flexDirection: "column",
							color: "white",
							paddingLeft: "20rem",
						}}
					>
						<span style={{ color: "#b1b1b1", fontSize: "1.5rem", textAlign: "right" }}>Leia</span>
						<strong style={{ fontSize: "2rem", textAlign: "right", fontWeight: "bold" }}>{title}</strong>
					</span>
				</div>
			</div>
		),
		{
			width: 800,
			height: 400,
			fonts: [
				{
					name: "Nunito Sans",
					data: font,
					style: "normal",
				},
			],
		},
	);
}
