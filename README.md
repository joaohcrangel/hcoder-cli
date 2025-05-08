# Hcoder CLI

**Hcoder CLI** é uma aplicação de linha de comando construída com [NestJS](https://nestjs.com/) e [nest-commander](https://github.com/jmcdo29/nest-commander), criada como exemplo no curso **NestJS CLI** da [Hcode](https://hcode.com.br).

## 🎯 Objetivo

Este projeto serve como base para a criação de ferramentas de linha de comando utilizando o ecossistema NestJS. A aplicação permite criar novos recursos e configurar opções de maneira simples e modular.

## Como Usar

É necessário ter o Node.js 22 instalado. Em seguida, instale o CLI globalmente:

```bash
npm i -g @hcode/hcoder
```

Depois, basta usar o comando:

```bash
hcoder
```

## 🚀 Instalação de Desenvolvimento

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/joaohcrangel/hcoder-cli.git
cd hcoder-cli
npm install
```

## 🛠️ Desenvolvimento

Durante o desenvolvimento, você pode executar o CLI de duas maneiras:

### 1. Usando `npx` com `ts-node`

```bash
npx ts-node src/main [comando] [opções]
```

### 2. Usando o script `start` do `package.json`

```bash
npm start -- [comando] [opções]
```

> Obs: O uso do `--` após `npm start` é necessário para encaminhar os argumentos corretamente.

## 🧰 Comandos disponíveis

```bash
Usage: main [options] [command]

Options:
  -h, --help                  display help for command

Commands:
  configure|config [options]  Configura as opções do CLI
  new|n                       Criar novos recursos
  help [command]              Exibe ajuda para um comando específico
```

## 📦 Produção

No ambiente de produção, o CLI será executado com o comando:

```bash
hcoder [comando] [opções]
```

## 📚 Curso relacionado

Este projeto faz parte do curso [NestJS CLI](https://hcode.com.br) da Hcode.

---

Feito com 💻 por [Hcode Consultoria e Treinamentos](https://hcode.com.br)
