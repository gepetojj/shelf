import { AppHeader } from "@/components/ui/app-header";
import { Layout } from "@/components/ui/layout";

export default async function Page() {
	return (
		<>
			<style>{`body { scroll-behavior: smooth; }`}</style>

			<Layout>
				<>
					<AppHeader />
					<section className="flex h-full w-full flex-col gap-10 px-4 py-7 home-break-mobile:px-12">
						<div className="flex flex-col gap-1">
							<h1 className="text-2xl font-bold">Termos e condições gerais de uso</h1>
							<h2 className="text-xs font-light italic">Válido a partir de 09 de Julho de 2024</h2>
						</div>
						<div
							id="section-0"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<p>
								Shelf, pessoa jurídica de direito privado descreve, através deste documento, as regras
								de uso do site https://shelfbooks.club e qualquer outro site, loja ou aplicativo operado
								pelo proprietário.
							</p>
							<p>
								Ao navegar neste website, consideramos que você está de acordo com os Termos de Uso
								abaixo.
							</p>
							<p>
								Caso você não esteja de acordo com as condições deste contrato, pedimos que não faça
								mais uso deste website, muito menos cadastre-se ou envie os seus dados pessoais.
							</p>
							<p>
								Se modificarmos nossos Termos de Uso, publicaremos o novo texto neste website, com a
								data de revisão atualizada. Podemos alterar este documento a qualquer momento. Caso haja
								alteração significativa nos termos deste contrato, podemos informá-lo por meio das
								informações de contato que tivermos em nosso banco de dados ou por meio de notificações.
							</p>
							<p>
								A utilização deste website após as alterações significa que você aceitou os Termos de
								Uso revisados. Caso, após a leitura da versão revisada, você não esteja de acordo com
								seus termos, favor encerrar o seu acesso.
							</p>
						</div>

						<div
							id="section-1"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-1"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 1 - Usuário
							</a>
							<p>
								A utilização deste website atribui de forma automática a condição de Usuário e implica a
								plena aceitação de todas as diretrizes e condições incluídas nestes Termos.
							</p>
						</div>

						<div
							id="section-2"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-2"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 2 - Adesão em conjunto com a Política de Privacidade
							</a>
							<p>
								A utilização deste website acarreta a adesão aos presentes Termos de Uso e a versão mais
								atualizada da Política de Privacidade de Shelf.
							</p>
						</div>

						<div
							id="section-3"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-3"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 3 - Condições de acesso
							</a>
							<p>
								Em geral, o acesso ao website da Shelf possui caráter gratuito e não exige prévia
								inscrição ou registro.
							</p>
							<p>
								Contudo, para usufruir de algumas funcionalidades, o usuário poderá precisar efetuar um
								cadastro, criando uma conta de usuário com login e senha próprios para acesso.
							</p>
							<p>
								É de total responsabilidade do usuário fornecer apenas informações corretas, autênticas,
								válidas, completas e atualizadas, bem como não divulgar o seu login e senha para
								terceiros.
							</p>
							<p>
								Partes deste website oferecem ao usuário a opção de publicar comentários em determinadas
								áreas. Shelf não consente com a publicação de conteúdos que tenham natureza
								discriminatória, ofensiva ou ilícita, ou ainda infrinjam direitos de autor ou quaisquer
								outros direitos de terceiros.
							</p>
							<p>
								A publicação de quaisquer conteúdos pelo usuário deste website, incluindo mensagens e
								comentários, implica em licença não-exclusiva, irrevogável e irretratável, para sua
								utilização, reprodução e publicação pela Shelf no seu website, plataformas e aplicações
								de internet, ou ainda em outras plataformas, sem qualquer restrição ou limitação.
							</p>
						</div>

						<div
							id="section-4"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-4"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 4 - Cookies
							</a>
							<p>
								Informações sobre o seu uso neste website podem ser coletadas a partir de cookies.
								Cookies são informações armazenadas diretamente no computador que você está utilizando.
								Os cookies permitem a coleta de informações tais como o tipo de navegador, o tempo
								despendido no website, as páginas visitadas, as preferências de idioma, e outros dados
								de tráfego anônimos. Nós e nossos prestadores de serviços utilizamos informações para
								proteção de segurança, para facilitar a navegação, exibir informações de modo mais
								eficiente, e personalizar sua experiência ao utilizar este website, assim como para
								rastreamento online. Também coletamos informações estatísticas sobre o uso do website
								para aprimoramento contínuo do nosso design e funcionalidade, para entender como o
								website é utilizado e para auxiliá-lo a solucionar questões relevantes.
							</p>
							<p>
								Caso não deseje que suas informações sejam coletadas por meio de cookies, há um
								procedimento simples na maior parte dos navegadores que permite que os cookies sejam
								automaticamente rejeitados, ou oferece a opção de aceitar ou rejeitar a transferência de
								um cookie (ou cookies) específico(s) de um site determinado para o seu computador.
								Entretanto, isso pode gerar inconvenientes no uso do website.
							</p>
							<p>
								As definições que escolher podem afetar a sua experiência de navegação e o funcionamento
								que exige a utilização de cookies. Neste sentido, rejeitamos qualquer responsabilidade
								pelas consequências resultantes do funcionamento limitado deste website provocado pela
								desativação de cookies no seu dispositivo (incapacidade de definir ou ler um cookie).
							</p>
						</div>

						<div
							id="section-5"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-5"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 5 - Propriedade Intelectual
							</a>
							<p>
								Todos os elementos de Shelf são de propriedade intelectual da mesma ou de seus
								licenciados. Estes Termos ou a utilização do website não concede a você qualquer licença
								ou direito de uso dos direitos de propriedade intelectual da Shelf ou de terceiros.
							</p>
						</div>

						<div
							id="section-6"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-6"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 6 - Links para sites de terceiros
							</a>
							<p>
								Este website poderá, de tempos a tempos, conter links de hipertexto que redirecionará
								você para sites das redes dos nossos parceiros, anunciantes, fornecedores etc. Se você
								clicar em um desses links para qualquer um desses sites, lembre-se que cada site possui
								as suas próprias práticas de privacidade e que não somos responsáveis por essas
								políticas. Consulte as referidas políticas antes de enviar quaisquer Dados Pessoais para
								esses sites.
							</p>
							<p>
								Não nos responsabilizamos pelas políticas e práticas de coleta, uso e divulgação
								(incluindo práticas de proteção de dados) de outras organizações, tais como Facebook,
								Apple, Google, Microsoft, ou de qualquer outro desenvolvedor de software ou provedor de
								aplicativo, loja de mídia social, sistema operacional, prestador de serviços de internet
								sem fio ou fabricante de dispositivos, incluindo todos os Dados Pessoais que divulgar
								para outras organizações por meio dos aplicativos, relacionadas a tais aplicativos, ou
								publicadas em nossas páginas em mídias sociais. Nós recomendamos que você se informe
								sobre a política de privacidade e termos de uso de cada site visitado ou de cada
								prestador de serviço utilizado.
							</p>
						</div>

						<div
							id="section-7"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-7"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 7 - Prazos e alterações
							</a>
							<p>O funcionamento deste website se dá por prazo indeterminado.</p>
							<p>
								O website no todo ou em cada uma das suas seções, pode ser encerrado, suspenso ou
								interrompido unilateralmente por Shelf, a qualquer momento e sem necessidade de prévio
								aviso.
							</p>
						</div>

						<div
							id="section-8"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-8"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 8 - Dados pessoais
							</a>
							<p>
								Durante a utilização deste website, certos dados pessoais serão coletados e tratados por
								Shelf e/ou pelos Parceiros. As regras relacionadas ao tratamento de dados pessoais de
								Shelf estão estipuladas na Política de Privacidade.
							</p>
						</div>

						<div
							id="section-9"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-9"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 9 - Contato
							</a>
							<p>
								Caso você tenha qualquer dúvida sobre os Termos de Uso, por favor, entre em contato pelo
								e-mail shelf@shelfbooks.club.
							</p>
						</div>
					</section>
				</>
				<></>
			</Layout>
		</>
	);
}
