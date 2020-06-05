### IS - Trabalho prático

____________

Repositório que contém o trabalho prático da unidade curricular de IS.

____________

### Resolução

1. Objetivo do trabalho

O presente relatório tem como objetivo relatar e justificar todas as decisões tomadas na realização do trabalho prático da unidade curricular Interoperabilidade Semântica do quarto ano do Mestrado Intregrado em Engenharia Informática. Este trabalho consiste no desenvolvimento de um sistema web que interopere com sistemas como o ORCID e o SCOPUS.

2. Programas

Foram desenvolvidos dois programas: um programa de background, para atualizações à base de dados; um servidor para percorrer a informação da base de dados e apresentar numa interface Web.

	
3. Background

A informação proveniente doORCIDe doSCOPUSque irá alimentar a interface Web necessitade um prévio processamento, antes de ser colocada na base de dados. Para além disto, é impor-tante ter um programa que atualize regularmente a informação da base de dados, nomeadamente oconjunto das publicações de cada autor. A execução deste programa é da responsabilidade de umadministrador. Partindo destas premissas, foi então desenvolvido o programa de background.

4. Servidor

A interface Web foi desenvolvida em NodeJs, apoiada porExpress. Nesta, são tratados pedidos GET e POST. O primeiro tipo de pedidos relaciona-se com a consulta de autores e respetivas publicações. Relativamente aos pedidos POST, estes auxiliam o registo de um autor na base de dados, uma vez que armazenam um ORCID ID para posteriormente o programa de background povoar a base de dados com a informação do respetivo autor.


### Pastas importantes
1. Background: /src/background
2. Servidor: /src/api

### Contribuidores
- [Fábio Senra](https://github.com/FabioSenra)
- [Jaime Leite](https://github.com/jaimeleite)
- [Nuno Rei](https://github.com/NunoRei)
- [Rui Barbosa](https://github.com/ruibarbosa95)
