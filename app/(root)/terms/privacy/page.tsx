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
							<h1 className="text-2xl font-bold">Política de privacidade</h1>
							<h2 className="text-xs font-light italic">Válida a partir de 28 de Junho de 2024</h2>
						</div>
						<div
							id="section-1"
							className="flex flex-col gap-3"
						>
							<a
								href="#section-1"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 1 - Informações gerais
							</a>
							<p className="text-justify text-neutral-200">
								A presente Política de Privacidade contém informações sobre coleta, uso, armazenamento,
								tratamento e proteção dos dados pessoais dos usuários e visitantes do OU aplicativo
								Shelfbooks OU/E site, com a finalidade de demonstrar absoluta transparência quanto ao
								assunto e esclarecer a todos interessados sobre os tipos de dados que são coletados, os
								motivos da coleta e a forma como os usuários podem gerenciar ou excluir as suas
								informações pessoais. Esta Política de Privacidade aplica-se a todos os usuários e
								visitantes do OU aplicativo Shelfbooks.club OU site e integra os Termos e Condições
								Gerais de Uso do OU aplicativo Shelfbooks.club OU site, devidamente inscrita no CNPJ sob
								o nº 52717128000174. O presente documento foi elaborado em conformidade com a Lei Geral
								de Proteção de Dados Pessoais (Lei 13.709/18), o Marco Civil da Internet (Lei 12.965/14)
								(e o Regulamento da UE n. 2016/6790). Ainda, o documento poderá ser atualizado em
								decorrência de eventual atualização normativa, razão pela qual se convida o usuário a
								consultar periodicamente esta seção.
							</p>
						</div>

						<div
							id="section-2"
							className="flex flex-col gap-3"
						>
							<a
								href="#section-2"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 2 - Como recolhemos os dados pessoais do usuário e do visitante?
							</a>
							<p className="text-justify text-neutral-200">
								Os dados pessoais do usuário e visitante são recolhidos pela plataforma da seguinte
								forma:
							</p>
							<ul className="flex list-disc flex-col gap-2 px-8 text-justify text-neutral-200">
								<li>
									Quando o usuário cria uma conta/perfil na plataforma: esses dados são os dados de
									identificação básicos, como e-mail, nome, localização, endereço IP. A partir deles,
									podemos identificar o usuário e o visitante, além de garantir uma maior segurança e
									bem-estar às suas necessidades. Ficam cientes os usuários e visitantes de que seu
									perfil na plataforma estará acessível a todos demais usuários e visitantes da
									plataforma.
								</li>
								<li>
									Quando um usuário e visitante acessa OU páginas do site OU o aplicativo: as
									informações sobre interação e acesso são coletadas pela empresa para garantir uma
									melhor experiência ao usuário e visitante. Estes dados podem tratar sobre as
									palavras-chaves utilizadas em uma busca, o compartilhamento de um documento
									específico, comentários, visualizações de páginas, perfis, a URL de onde o usuário e
									visitante provêm, o navegador que utilizam e seus IPs de acesso, dentre outras que
									poderão ser armazenadas e retidas.
								</li>
								<li>
									Por intermédio de terceiro: a plataforma recebe dados de terceiros, como Google,
									Instagram e outros, quando um usuário faz login com o seu perfil de um desses sites.
									A utilização desses dados é autorizada previamente pelos usuários junto ao terceiro
									em questão.
								</li>
								<li>Outras</li>
							</ul>
						</div>

						<div
							id="section-3"
							className="flex flex-col gap-3"
						>
							<a
								href="#section-3"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 3 - Quais dados pessoais recolhemos sobre o usuário e visitante?
							</a>
							<p className="text-justify text-neutral-200">
								Os dados pessoais do usuário e visitante recolhidos são os seguintes:
							</p>
							<ul className="flex list-disc flex-col gap-2 px-8 text-justify text-neutral-200">
								<li>Dados para a criação da conta/perfil na plataforma citados acima.</li>
								<li>
									Dados para otimização da navegação: palavras-chave utilizadas, acesso às páginas,
									endereço IP, interação com outros perfis e usuários.
								</li>
								<li>
									Dados para concretizar transações: dados referentes ao pagamento e transações, tais
									como, número do cartão de crédito e outras informações sobre o cartão, além dos
									pagamentos efetuados.
								</li>
								<li>
									Newsletter: o e-mail cadastrado pelo visitante que optar por se inscrever na
									Newsletter será coletado e armazenado até que o usuário solicite o descadastro.
								</li>
							</ul>
							<p className="text-justify text-neutral-200">
								Dados relacionados a contratos: diante da formalização do contrato de compra e venda ou
								de prestação de serviços entre a plataforma e o usuário e visitante poderão ser
								coletados e armazenados dados relativos à execução contratual, inclusive as comunicações
								realizadas entre a empresa e o usuário.
							</p>
						</div>

						<div
							id="section-4"
							className="flex flex-col gap-3"
						>
							<a
								href="#section-4"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 4 - Para que finalidades utilizamos os dados pessoais do usuário e visitante?
							</a>
							<p className="text-justify text-neutral-200">
								Os dados pessoais do usuário e do visitante coletados e armazenados pela plataforma tem
								por finalidade:
							</p>
							<ul className="flex list-disc flex-col gap-2 px-8 text-justify text-neutral-200">
								<li>
									Bem-estar do usuário e visitante: aprimorar o produto e/ou serviço oferecido,
									facilitar, agilizar e cumprir os compromissos estabelecidos entre o usuário e a
									empresa, melhorar a experiência dos usuários e fornecer funcionalidades específicas
									a depender das características básicas do usuário.
								</li>
								<li>
									Melhorias da plataforma: compreender como o usuário utiliza os serviços da
									plataforma, para ajudar no desenvolvimento de negócios e técnicas.
								</li>
								<li>
									Anúncios: apresentar anúncios personalizados para o usuário com base nos dados
									fornecidos.
								</li>
								<li>
									Comercial: os dados são usados para personalizar o conteúdo oferecido e gerar
									subsídio à plataforma para a melhora da qualidade no funcionamento dos serviços.
								</li>
								<li>
									Previsão do perfil do usuário: tratamento automatizado de dados pessoais para
									avaliar o uso na plataforma.
								</li>
								<li>
									Dados de cadastro: para permitir o acesso do usuário a determinados conteúdos da
									plataforma, exclusivo para usuários cadastrados.
								</li>
								<li>
									Dados de contrato: conferir às partes segurança jurídica e facilitar a conclusão do
									negócio.
								</li>
								<li>Outras.</li>
							</ul>
							<p className="text-justify text-neutral-200">
								O tratamento de dados pessoais para finalidades não previstas nesta Política de
								Privacidade somente ocorrerá mediante comunicação prévia ao usuário, de modo que os
								direitos e obrigações aqui previstos permanecem aplicáveis.
							</p>
						</div>

						<div
							id="section-5"
							className="flex flex-col gap-3 text-neutral-200"
						>
							<a
								href="#section-5"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 5 - Por quanto tempo os dados pessoais ficam armazenados?
							</a>
							<p className="text-justify">
								Os dados pessoais do usuário e visitante são armazenados pela plataforma durante o
								período necessário para a prestação do serviço ou o cumprimento das finalidades
								previstas no presente documento, conforme o disposto no inciso I do artigo 15 da Lei
								13.709/18.
							</p>
							<p className="text-justify">
								Os dados podem ser removidos ou anonimizados a pedido do usuário, excetuando os casos em
								que a lei oferecer outro tratamento.
							</p>
							<p className="text-justify">
								Ainda, os dados pessoais dos usuários apenas podem ser conservados após o término de seu
								tratamento nas seguintes hipóteses previstas no artigo 16 da referida lei:
							</p>
							<ul className="flex flex-col gap-2 px-8 text-justify">
								<li>I - cumprimento de obrigação legal ou regulatória pelo controlador;</li>
								<li>
									II - estudo por órgão de pesquisa, garantida, sempre que possível, a anonimização
									dos dados pessoais;
								</li>
								<li>
									III - transferência a terceiro, desde que respeitados os requisitos de tratamento de
									dados dispostos nesta Lei;
								</li>
								<li>
									IV - uso exclusivo do controlador, vedado seu acesso por terceiro, e desde que
									anonimizados os dados.
								</li>
							</ul>
						</div>

						<div
							id="section-6"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-6"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 6 - Segurança dos dados pessoais armazenados
							</a>
							<p>
								A plataforma se compromete a aplicar as medidas técnicas e organizativas aptas a
								proteger os dados pessoais de acessos não autorizados e de situações de destruição,
								perda, alteração, comunicação ou difusão de tais dados.
							</p>
							<p>
								Os dados relativas a cartões de crédito são criptografados usando a tecnologia
								&quot;secure socket layer&quot; (SSL) que garante a transmissão de dados de forma segura
								e confidencial, de modo que a transmissão dos dados entre o servidor e o usuário ocorre
								de maneira cifrada e encriptada.
							</p>
							<p>
								A plataforma não se exime de responsabilidade por culpa exclusiva de terceiro, como em
								caso de ataque de hackers ou crackers, ou culpa exclusiva do usuário, como no caso em
								que ele mesmo transfere seus dados a terceiros. O site compromete-se a comunicar o
								usuário em caso de alguma violação de segurança dos seus dados pessoais.
							</p>
							<p>
								Os dados pessoais armazenados são tratados com confidencialidade, dentro dos limites
								legais. No entanto, podemos divulgar suas informações pessoais caso sejamos obrigados
								pela lei para fazê-lo ou se você violar nossos Termos de Serviço.
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
								Seção 7 - Compartilhamento dos dados
							</a>
							<p>
								O compartilhamento de dados do usuário ocorre apenas com os dados referentes a
								publicações realizadas pelo próprio usuário, tais ações são compartilhadas publicamente
								com os outros usuários.
							</p>
							<p>
								Os dados do perfil do usuário são compartilhados publicamente em sistemas de busca e
								dentro da plataforma, sendo permitido ao usuário modificar tal configuração para que seu
								perfil não apareça nos resultados de busca de tais ferramentas.
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
								Seção 8 - Cookies ou dados de navegação
							</a>
							<p>
								Os cookies referem-se a arquivos de texto enviados pela plataforma ao computador do
								usuário e visitante e que nele ficam armazenados, com informações relacionadas à
								navegação no site. Tais informações são relacionadas aos dados de acesso como local e
								horário de acesso e são armazenadas pelo navegador do usuário e visitante para que o
								servidor da plataforma possa lê-las posteriormente a fim de personalizar os serviços da
								plataforma.
							</p>
							<p>
								O usuário e o visitante da plataforma manifestam conhecer e aceitar que pode ser
								utilizado um sistema de coleta de dados de navegação mediante a utilização de cookies.
							</p>
							<p>
								O cookie persistente permanece no disco rígido do usuário e visitante depois que o
								navegador é fechado e será usado pelo navegador em visitas subsequentes ao site. Os
								cookies persistentes podem ser removidos seguindo as instruções do seu navegador. Já o
								cookie de sessão é temporário e desaparece depois que o navegador é fechado. É possível
								redefinir seu navegador da web para recusar todos os cookies, porém alguns recursos da
								plataforma podem não funcionar corretamente se a capacidade de aceitar cookies estiver
								desabilitada.
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
								Seção 9 - Consentimento
							</a>
							<p>
								Ao utilizar os serviços e fornecer as informações pessoais na plataforma, o usuário está
								consentindo com a presente Política de Privacidade.
							</p>
							<p>
								O usuário, ao cadastrar-se, manifesta conhecer e pode exercitar seus direitos de
								cancelar seu cadastro, acessar e atualizar seus dados pessoais e garante a veracidade
								das informações por ele disponibilizadas.
							</p>
							<p>
								O usuário tem direito de retirar o seu consentimento a qualquer tempo, para tanto deve
								entrar em contato através do e-mail shelf@shelfbooks.club.
							</p>
						</div>

						<div
							id="section-10"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-10"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 10 - Alterações para essa Política de Privacidade
							</a>
							<p>
								Reservamos o direito de modificar essa Política de Privacidade a qualquer momento,
								então, é recomendável que o usuário e visitante revisem-a com frequência.
							</p>
							<p>
								As alterações e esclarecimentos vão surtir efeito imediatamente após sua publicação na
								plataforma. Quando realizadas alterações os usuários serão notificados. Ao utilizar o
								serviço ou fornecer informações pessoais após eventuais modificações, o usuário e
								visitante demonstra sua concordância com as novas normas.
							</p>
							<p>
								Diante da fusão ou venda da plataforma à outra empresa os dados dos usuários podem ser
								transferidos para os novos proprietários para que a permanência dos serviços oferecidos.
							</p>
						</div>

						<div
							id="section-11"
							className="flex flex-col gap-3 text-justify text-neutral-200"
						>
							<a
								href="#section-11"
								className="text-xl font-medium text-neutral-100"
							>
								Seção 11 - Jurisdição para resolução de conflitos
							</a>
							<p>
								Para a solução de controvérsias decorrentes do presente instrumento será aplicado
								integralmente o Direito brasileiro.
							</p>
							<p>
								Os eventuais litígios deverão ser apresentados no foro da comarca em que se encontra a
								sede da empresa.
							</p>
						</div>
					</section>
				</>
				<></>
			</Layout>
		</>
	);
}
