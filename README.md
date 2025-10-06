# lab-vortex

Desafio para processo seletivo do Laboratório Vortex.

# Requisitos

Desafio: Sistema de Indicação (Referral System)

Objetivo: Criar uma aplicação web de página única (SPA - Single Page Application) que permita o cadastro de usuários e implemente um sistema de pontos por indicação.

## Funcionais

- Página de Cadastro: Um formulário para registrar um novo usuário com os campos: nome, e-mail e senha.
- Validação: A validação dos campos deve ser feita no front-end. O e-mail precisa ter um formato válido e a senha deve ter no mínimo 8 caracteres, contendo letras e números.
- Página de Perfil (Pós-login): Após o cadastro, o usuário é direcionado para uma página simples que exibe:
  - Seu nome de usuário.
  - Sua pontuação atual (que inicia em 0).
  - Seu link de indicação único
  - Um botão "Copiar Link" que copia o link de indicação para a área de transferência do usuário.
- Lógica de Indicação: Se um novo usuário se cadastrar usando um link de indicação, o usuário que o indicou deve ganhar 1 ponto. A pontuação na página de perfil deve ser atualizada para refletir isso (não precisa ser em tempo real, pode atualizar ao recarregar a página).

## Não Funcionais

- Front-end: A escolha da tecnologia é sua (React, Vue, Angular ou até mesmo HTML/CSS/JS puros). Justifique sua escolha no README.md.
- Estilização: Você não deve usar frameworks de UI/CSS como Bootstrap, Material UI ou Tailwind. Queremos ver suas habilidades com CSS puro ou pré-processadores (SASS/LESS). A aplicação deve ser responsiva e funcional tanto em desktops quanto em celulares.
- Back-end: Crie uma API REST simples para gerenciar os cadastros e a pontuação. Da mesma forma que no Front-end, a tecnologia fica a sua escolha (Node, FastAPI, Gin, Spring…). Utilize um banco de dados da sua preferência também, podendo ser SQL ou NoSQL. Justifique as escolhas das suas tecnologias no README.md.
- Uso de IA: Encorajamos o uso de qualquer ferramenta que acelere seu desenvolvimento, incluindo assistentes de IA como o Copilot ou o Cursor. Queremos ver como você as utiliza a seu favor.
