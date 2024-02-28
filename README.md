# Jaya Desafio
Projeto para visualizar, confirmar, cancelar e solicitar pagamento.

## Docker
Gere o build da imagem com `docker build . -t client-react` e crie o container para imagem com  `docker run -d -p 80:80 client-react ` <br>
<br>
# Com docker-compose (PROJETO LARAVEL)
Coloque a pasta do React no mesmo nível do diretório do Laravel que contém o docker-compose e coloque o nome da pasta do React como `front-jaya-payment` <br>
ou altere no docker-compose.yml o valor `client.build.context` para `o valor da pasta do React` <br>
por fim execute o comando para iniciar o build e os containers `docker compose up -d ` <br>

## Instalação manual
# Instalação dos pacotes
Após instalar o NODE<br>
instale as dependências `npm install` <br>
Rode em dev usando `npm run dev`

# Tests
Os testes usam dados mocks. Então não precisa configuração extra.
Execute <br>
`npm run test`


# API
Caso precise alterar o HOST da API mude no hook `useClientAPI` em `src\utils\hooks.ts`
