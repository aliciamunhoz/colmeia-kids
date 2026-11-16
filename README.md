# Colmeia Kids

App de gestão de creches em React Native (Expo + TypeScript) com três perfis: **encarregado de educação**, **educadora** e **administração**. Todos os dados são locais: ficam guardados no dispositivo (AsyncStorage) e não há servidor.

## Como executar

Requer Node.js 20 ou superior.

```bash
npm install
```

```bash
npm start
```

Leia o QR code com a app **Expo Go** (Android/iOS). Para abrir no browser:

```bash
npm run web
```

Para verificar os tipos:

```bash
npm run typecheck
```

## Contas de teste

**Todas as contas usam a password `colmeia123`.**

| Perfil | Nome | Email | Creche / sala | O que tem para testar |
| --- | --- | --- | --- | --- |
| Encarregado | Ana Ferreira | `ana.ferreira@email.pt` | Bragança | 2 filhos (Tomás e Beatriz), diário completo, 2 mensagens e 2 notificações por ler, fatura de outubro por pagar |
| Encarregado | Rui Santos | `rui.santos@email.pt` | Bragança | Filha Leonor (Little Bees), fatura já paga |
| Encarregado | Marta Costa | `marta.costa@email.pt` | Bragança | Filha Beatriz Costa (Little Bees), já saiu hoje às 16:30 |
| Educadora | Sofia Ribeiro | `sofia@colmeia.pt` | Bragança · Little Bees | Sala com 6 crianças (3 presentes, 2 por chegar, 1 já saiu) |
| Educadora | Inês Martins | `ines@colmeia.pt` | Bragança · Ladybirds | Sala com 2 crianças |
| Educadora | Joana Pires | `joana@colmeia.pt` | Porto · Sunflowers | Outra creche: 1 criança |
| Administração | Rui Costa | `rui.costa@colmeia.pt` | Bragança **e** Porto | Pode trocar de creche no menu lateral |

No ecrã de Login também há **atalhos** (Parent, Educator, Administration) que entram com a primeira conta de cada perfil: Ana Ferreira, Sofia Ribeiro e Rui Costa.

### Contas criadas durante os testes

Um utilizador criado pela administração (Utilizadores → **+**) fica com a password `colmeia123` e já pode entrar. Uma conta **bloqueada** (Editar utilizador → "Block account") deixa de conseguir entrar e o Login mostra a mensagem de conta bloqueada.

## Dados da demonstração

- **Data fixa:** a app está em **sexta-feira, 25 de setembro de 2026**, para os dados coincidirem com o Figma. As horas dos novos registos são as reais.
- **Diário:** o do Tomás tem registos de segunda a sexta (21 a 25 de setembro).
- **Repor os dados iniciais:** entre como encarregado e use Perfil → **Reset demo data**. Assim apaga todas as alterações feitas nos testes.
- **Chave de gravação:** se o modelo de dados mudar no código, a chave em `src/data/DataContext.tsx` (`colmeia-kids:data:v4`) também tem de mudar; só assim os dados antigos são ignorados.

## Testes manuais sugeridos

### Login

- [ ] Email certo e password errada → aparece "Email or password is incorrect."
- [ ] `ana.ferreira@email.pt` / `colmeia123` → entra na Home do encarregado
- [ ] "Forgot password?" com um email que não existe → erro; com um email que existe → confirmação de envio

### Encarregado (Ana Ferreira)

- [ ] Home: trocar entre Tomás e Beatriz e confirmar que o estado e o resumo mudam
- [ ] Notificações: "Mark all read" → o ponto vermelho do sino desaparece
- [ ] Diário: escolher outro dia na semana, filtrar por refeições, abrir o calendário e escolher 22 de setembro
- [ ] Mensagens: abrir a conversa com a Educator Sofia (2 por ler) e enviar uma mensagem
- [ ] Check-in: no Tomás, separador Check-out → "Confirm check-out"
- [ ] Pagamentos: "View invoice and reference" → "Pay now with MB Way (demo)" → a fatura passa a Paid
- [ ] Perfil: alterar o telemóvel e guardar; alterar a password (as regras ficam verdes ao escrever)

### Educadora (Sofia Ribeiro)

- [ ] Sala: "Check in" no Martim Alves → passa a "In" com a hora atual
- [ ] Perfil do Tomás: registar uma refeição, o humor, a avaliação e um incidente
- [ ] Incidente sem descrição → erro no campo; com descrição → guarda e notifica a Ana
- [ ] **New** (botão central): publicar uma atividade com "Select all"
- [ ] **Announce**: enviar um aviso com "Send push notification" ligado

### Administração (Rui Costa)

- [ ] Dashboard: confirmar os números e trocar para a creche do Porto no menu lateral
- [ ] Utilizadores → **+**: criar uma educadora na sala Crickets → ecrã "User saved"
- [ ] Crianças → **+**: inscrever uma criança, ligar a um encarregado e escolher o plano
- [ ] Faturas → **+**: criar uma fatura com um item extra → registar o pagamento
- [ ] Fatura FT 2026/0987 (Martim, em atraso) → "Send reminder"
- [ ] Mensalidades → "Generate October invoices" (repetir não cria duplicados)
- [ ] Presenças de hoje: "Notify" numa criança que não chegou
- [ ] Pesquisa (🔍): procurar "Ferreira"

### Fluxos entre perfis

1. A **Sofia** regista um incidente do Tomás → a **Ana** vê a notificação.
2. A **Sofia** publica uma atividade → a **Ana** vê-a nas notificações e no diário de hoje.
3. O **Rui Costa** cria uma fatura para o Tomás → a **Ana** vê o novo valor em dívida em Pagamentos.
4. A **Ana** faz o check-out do Tomás → a **Sofia** vê "Out" na sala.

## Limitações do protótipo

- A câmara (QR, fotografias) é simulada: tocar no leitor de QR faz a leitura, e as "fotos" são blocos de cor com ícone.
- Exportar, PDF e anexos mostram apenas um aviso (`Alert`), que **só aparece no telemóvel**: no browser não acontece nada.
- As passwords ficam guardadas em texto simples, apenas para a demonstração.

## SVGs

Os ficheiros em `assets/icons/` e `assets/avatars/` são importados como componentes
React através de `react-native-svg-transformer`, configurado em `metro.config.js`.
Não é necessário gerar ficheiros TypeScript ao alterar um SVG.

Ao adicionar um ícone ou avatar, importe-o e adicione-o ao mapa em
`src/components/Icon/icons.ts` ou `src/components/Avatar/avatars.ts`.
Os ícones usam `currentColor`: a configuração em `.svgrrc.json` substitui a cor
original `#18235A`, permitindo definir a cor pela propriedade `color` de `Icon`.
As cores dos avatares são preservadas.

Depois de alterar a configuração do Metro ou do SVGR, reinicie o servidor com
`npm start -- --clear`.

## Estrutura

```
src/
  theme/        cores, tipografia, espaçamentos (design system do Figma)
  components/   componentes gráficos reutilizáveis
  navigation/   navegadores por perfil e tipos das rotas
  data/         modelo, dados iniciais (seed), reducer, seletores, persistência
  context/      sessão (utilizador autenticado e creche ativa)
  screens/      auth/, parent/, educator/, admin/, shared/
```
