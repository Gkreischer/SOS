# SOS - Sistema de ordem de serviço v1.0

O programa utiliza as seguintes tecnologias:

Linguagens: Javascript, PHP, SQL
Frameworks: Ionic(Angular)
Backend: Apache, MariaDB, Docker, Linux

O servidor web Apache no Docker serve a aplicação Ionic do tipo PWA para manipulação de informações armazenadas no SGBD MariaDB.
Requisitos:

- Criar, Alterar e Deletar ordens de serviço.
- Criar, Alterar e Deletar equipamentos.
- Criar, Alterar e Deletar funcionários.
- Criar, Alterar e Deletar clientes.
- Criar, Alterar e Deletar produtos
* Exibição e Alteração de Ordens de Serviço e Dados Pessoais Online

* Serviço será implementado em versões posteriores pois dependem de alterações na infra-estrutura.

A parte principal é a ordem de serviço, onde deve ter também serviços de impressão de comprovantes.

O banco de dados foi modelado no dbdiagram.io, implementado no MariaDB utilizando um servidor PHP para controlar o fluxo de informações.


