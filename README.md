<!-- # Tormenta 20 API - Backend -->

Este é um sistema não-oficial feito com base no Sistema de RPG Tormenta 20.

Todas as informações exibidas pertencem a [Jambô Editora](https://jamboeditora.com.br/). E caso solicitado será removido imediatamente. Apoiem os criadores adquirindo o livro.

## Índice

1. [Tecnologias Utilizadas](#tecnologias-utilizadas)
2. [Demo](#demo)
3. [Instalação](#instalação)
4. [Rotas](#rotas)
    1. [Observações](#observações)
    2. [Classes](#classes)
    3. [Divindades](#divindades)
    4. [Habilidades](#habilidades)
    5. [Raças](#raças)
    6. [Perícias](#perícias)

## Tecnologias Utilizadas
- [Node.js](https://nodejs.org/en/);
- [Express.js](https://expressjs.com/);
- [Nodemon](https://nodemon.io/) (como dependência de desenvolvimento)

## Instalação

Clone o projeto e use o npm ou yarn para instalar as dependencias

```bash
npm install
```
```bash
yarn install
```

## Rotas

#### Observações:

- Os atributos precedidos de dois-pontos(:) são parâmetros a serem passados na rota;
- As palavras compostas serão separadas com underline(_);
- Acentos não são aceitos nas rotas;

Atualmente o projeto suporta as seguintes rotas:

#### Classes:
- "GET/api/classes" - Retorna todas as Classes;
- "GET/api/classes/:classe" - Retorna a classe do parâmetro. Ex.: classes/barbaro;
- "GET/api/classes/:classe/habilidades" - Retorna as Habilidades da classe do parâmetro. Ex.: classes/barbaro/habilidades;
- "GET/api/classes/:classe/tabela-nivel" - Retorna as Tabela de Nível da classe do parâmetro. Ex.: classes/barbaro/tabela-nivel;
- "GET/api/classes/:classe/proeficiencias/" - Retorna as Proeficiências da classe do parâmetro. Ex.: classes/barbaro/proeficiencias;
- "GET/api/classes/:classe/pericias/" - Retorna as Perícias da classe do parâmetro. Ex.: classes/barbaro/pericias;

- "POST/api/classes" Cria uma nova classe
- "PUT/api/classes/:classe" Edita a classe (deve ser usado o nome da classe)
- "DELETE/api/classes/:classe" Exclui a classe (deve ser usado o nome da classe)

#### Divindades:
- "/divindades" - Retorna todas as Divindades;
- "/divindades/:divindade" - Retorna a divindade do parâmetro. Ex.: divindade/valkaria;

- "POST/api/divindades" Cria uma nova Divindade
- "PUT/api/divindades/:divindade" Edita a divindade (deve ser usado o nome da divindade)
- "DELETE/api/divindades/:divindade" Exclui a divindade (deve ser usado o nome da divindade)

#### Raças:
- "/racas" - Retorna todas as Raças;
- "/racas/:raca" - Retorna a raça do parâmetro. Ex.: racas/humano;

- "POST/api/racas" Cria uma nova Raça
- "PUT/api/racas/:raca" Edita a raça (deve ser usado o nome da raça)
- "DELETE/api/racas/:raca" Exclui a raça (deve ser usado o nome da Raça)

#### Perícias:
- "/pericias" - Retorna todas as Perícias;
- "/pericias/:pericia" - Retorna a perícia do parâmetro. Ex.: pericias/atletismo;

- "POST/api/pericias" Cria uma nova Pericia
- "PUT/api/pericias/:pericia" Edita a percia (deve ser usado o nome da pericia)
- "DELETE/api/pericias/:pericia" Exclui a pericia (deve ser usado o nome da pericia)

#### Poderes:

"GET/api/poderes" - Retorna todos os Poderes;
"GET/api/poderes/:poder" - Retorna o poder do parâmetro. Ex.: poder/estilo_desarmado;
"Get/api/poderes/grupo/:grupo" - Retorna os poderes por grupo. Ex.: grupo/poderes_de_combate

"POST/api/poderes" - Cria um novo poder
"PUT/api/poderes/:poder" - Edita um poder existente (deve ser usado o nome do poder)
"DELETE/api/poderes/:poder" - Exclui um poder (deve ser usado o nome do poder)


