
CREATE TABLE contato(
	id	UUID			PRIMARY KEY,
	nome 		VARCHAR(150) 	NOT NULL,
	cpf			VARCHAR(14)		NOT NULL UNIQUE,
	telefone 	VARCHAR(20) 	NOT NULL,
	email	 	VARCHAR(50) 	NOT NULL
);

DESC contato;