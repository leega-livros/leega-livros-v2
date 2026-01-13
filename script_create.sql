create database biblioteca;
use biblioteca;

CREATE TABLE Autor (
  ID_Autor INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Nome_Autor VARCHAR(45) NULL,
  PRIMARY KEY(ID_Autor)
);

CREATE TABLE Cargo (
  ID_Cargo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Nome_Cargo VARCHAR(45) NULL,
  Salario DECIMAL(10,2) NULL,
  PRIMARY KEY(ID_Cargo)
);

CREATE TABLE Departamento (
  ID_Departamento INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  Nome_Departamento VARCHAR(20) NULL,
  PRIMARY KEY(ID_Departamento)
);

CREATE TABLE Devolucao (
  ID_Devolucao INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Funcionario INTEGER UNSIGNED NOT NULL,
  ID_Emprestimo INTEGER UNSIGNED NOT NULL,
  Data_Devolucao DATE NULL,
  Hora_Devolucao TIME NULL,
  PRIMARY KEY(ID_Devolucao),
  INDEX Devolucao_FKIndex1(ID_Emprestimo),
  INDEX Devolucao_FKIndex5(ID_Funcionario)
);

CREATE TABLE Editora (
  ID_Editora INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Endereco INTEGER UNSIGNED NOT NULL,
  Nome_Editora VARCHAR(45) NULL,
  PRIMARY KEY(ID_Editora),
  INDEX Editora_FKIndex1(ID_Endereco)
);

CREATE TABLE Emprestimo (
  ID_Emprestimo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Funcionario INTEGER UNSIGNED NOT NULL,
  ID_Estoque INTEGER UNSIGNED NOT NULL,
  ID_Usuario INTEGER UNSIGNED NOT NULL,
  Data_Emprestimo DATE NULL,
  Hora_Emprestimo TIME NULL,
  Data_Entrega DATE NULL,
  PRIMARY KEY(ID_Emprestimo),
  INDEX Emprestimo_FKIndex1(ID_Usuario),
  INDEX Emprestimo_FKIndex3(ID_Estoque),
  INDEX Emprestimo_FKIndex4(ID_Funcionario)
);

CREATE TABLE Endereco (
  ID_Endereco INTEGER UNSIGNED NOT NULL,
  CEP VARCHAR(10) NULL,
  Logradouro VARCHAR(60) NULL,
  Bairro VARCHAR(50) NULL,
  Cidade VARCHAR(50) NULL,
  Estado VARCHAR(2) NOT NULL DEFAULT 'SP',
  Numero INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(ID_Endereco)
);

CREATE TABLE Estoque (
  ID_Estoque INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Obra INTEGER UNSIGNED NOT NULL,
  Quantidade_Livro INTEGER UNSIGNED NULL,
  Qtd_Disponivel INTEGER UNSIGNED NULL,
  Valor_Unitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY(ID_Estoque),
  INDEX Estoque_FKIndex1(ID_Obra)
);

CREATE TABLE Financeiro_Multa (
  ID_Multa INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Emprestimo INTEGER UNSIGNED NOT NULL,
  ID_Devolucao INTEGER UNSIGNED NOT NULL,
  Valor_Total DECIMAL(10,2) NOT NULL,
  Dias_Atraso INTEGER UNSIGNED NOT NULL,
  Status_Multa ENUM('Pendente', 'Paga', 'Cancelada') NOT NULL DEFAULT 'Pendente',
  PRIMARY KEY(ID_Multa),
  INDEX Financeiro_Multa_FKIndex1(ID_Devolucao),
  INDEX Financeiro_Multa_FKIndex2(ID_Emprestimo)
);

CREATE TABLE Financeiro_Pagamento (
  ID_Pagamento INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Multa INTEGER UNSIGNED NOT NULL,
  Data_Pagamento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Forma_Pagamento ENUM('Dinheiro', 'Cartao', 'Pix') NOT NULL,
  PRIMARY KEY(ID_Pagamento),
  INDEX Financeiro_Pagamento_FKIndex1(ID_Multa)
);

CREATE TABLE Funcionario (
  ID_Funcionario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Departamento INTEGER UNSIGNED NOT NULL,
  ID_Cargo INTEGER UNSIGNED NOT NULL,
  Nome_Funcionario VARCHAR(60) NULL,
  Data_Admissao DATE NULL,
  Data_Demissao DATE NULL,
  PRIMARY KEY(ID_Funcionario),
  INDEX Funcionario_FKIndex2(ID_Cargo),
  INDEX Funcionario_FKIndex_Departamento(ID_Departamento)
);

CREATE TABLE Obra (
  ID_Obra INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Autor INTEGER UNSIGNED NOT NULL,
  ID_Editora INTEGER UNSIGNED NOT NULL,
  Titulo_Obra VARCHAR(45) NULL,
  Numero_Publicacao INTEGER UNSIGNED NULL,
  Genero VARCHAR(20) NULL,
  Data_Publicacao DATE NULL,
  PRIMARY KEY(ID_Obra),
  INDEX Obra_FKIndex1(ID_Editora),
  INDEX Obra_FKIndex2(ID_Autor)
);

CREATE TABLE Reserva (
  ID_Reserva INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Obra INTEGER UNSIGNED NOT NULL,
  ID_Usuario INTEGER UNSIGNED NOT NULL,
  ID_Estoque INTEGER UNSIGNED NOT NULL,
  ID_Funcionario INTEGER UNSIGNED NOT NULL,
  ID_Emprestimo INTEGER UNSIGNED NOT NULL,
  Status_Livro ENUM('Disponivel','Emprestado','Reservado') NOT NULL DEFAULT 'Disponivel',
  Data_Reserva DATE NULL,
  Hora_Reserva TIME NULL,
  PRIMARY KEY(ID_Reserva),
  INDEX Reserva_FKIndex1(ID_Emprestimo),
  INDEX Reserva_FKIndex2(ID_Funcionario),
  INDEX Reserva_FKIndex3(ID_Estoque),
  INDEX Reserva_FKIndex4(ID_Usuario),
  INDEX Reserva_FKIndex5(ID_Obra)
);

CREATE TABLE Usuario (
  ID_Usuario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  ID_Endereco INTEGER UNSIGNED NOT NULL,
  Nome_Usuario VARCHAR(45) NULL,
  Telefone VARCHAR(15) NULL,
  CPF VARCHAR(20) NULL,
  Status_Usuario ENUM('Ativo', 'Suspenso', 'Inativo') NULL DEFAULT 'Ativo',
  PRIMARY KEY(ID_Usuario),
  INDEX Usuario_FKIndex1(ID_Endereco)
);

-- 1. Obra (Autor e Editora)
ALTER TABLE Obra 
ADD CONSTRAINT FK_Obra_Autor FOREIGN KEY (ID_Autor) REFERENCES Autor(ID_Autor),
ADD CONSTRAINT FK_Obra_Editora FOREIGN KEY (ID_Editora) REFERENCES Editora(ID_Editora);

-- 2. Editora (Endereco)
ALTER TABLE Editora 
ADD CONSTRAINT FK_Editora_Endereco FOREIGN KEY (ID_Endereco) REFERENCES Endereco(ID_Endereco);

-- 3. Estoque (Obra)
ALTER TABLE Estoque 
ADD CONSTRAINT FK_Estoque_Obra FOREIGN KEY (ID_Obra) REFERENCES Obra(ID_Obra);

-- 4. Usuario (Endereco)
ALTER TABLE Usuario 
ADD CONSTRAINT FK_Usuario_Endereco FOREIGN KEY (ID_Endereco) REFERENCES Endereco(ID_Endereco);

-- 5. Funcionario (Depto e Cargo)
ALTER TABLE Funcionario 
ADD CONSTRAINT FK_Funcionario_Depto FOREIGN KEY (ID_Departamento) REFERENCES Departamento(ID_Departamento),
ADD CONSTRAINT FK_Funcionario_Cargo FOREIGN KEY (ID_Cargo) REFERENCES Cargo(ID_Cargo);

-- 6. Emprestimo (Funcionario, Estoque e Usuario)
ALTER TABLE Emprestimo 
ADD CONSTRAINT FK_Emprestimo_Func FOREIGN KEY (ID_Funcionario) REFERENCES Funcionario(ID_Funcionario),
ADD CONSTRAINT FK_Emprestimo_Estoque FOREIGN KEY (ID_Estoque) REFERENCES Estoque(ID_Estoque),
ADD CONSTRAINT FK_Emprestimo_User FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario);

-- 7. Devolucao (Funcionario e Emprestimo)
ALTER TABLE Devolucao 
ADD CONSTRAINT FK_Devolucao_Func FOREIGN KEY (ID_Funcionario) REFERENCES Funcionario(ID_Funcionario),
ADD CONSTRAINT FK_Devolucao_Emp FOREIGN KEY (ID_Emprestimo) REFERENCES Emprestimo(ID_Emprestimo);

-- 8. Reserva (Obra, Usuario, Estoque, Funcionario e Emprestimo)
ALTER TABLE Reserva 
ADD CONSTRAINT FK_Reserva_Obra FOREIGN KEY (ID_Obra) REFERENCES Obra(ID_Obra),
ADD CONSTRAINT FK_Reserva_User FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario),
ADD CONSTRAINT FK_Reserva_Estoque FOREIGN KEY (ID_Estoque) REFERENCES Estoque(ID_Estoque),
ADD CONSTRAINT FK_Reserva_Func FOREIGN KEY (ID_Funcionario) REFERENCES Funcionario(ID_Funcionario),
ADD CONSTRAINT FK_Reserva_Emp FOREIGN KEY (ID_Emprestimo) REFERENCES Emprestimo(ID_Emprestimo);

-- 9. NOVAS: Financeiro (Conectando Multas ao Emprestimo e Pagamentos às Multas)
ALTER TABLE Financeiro_Multa
ADD CONSTRAINT FK_Multa_Emprestimo FOREIGN KEY (ID_Emprestimo) REFERENCES Emprestimo(ID_Emprestimo);

ALTER TABLE Financeiro_Pagamento
ADD CONSTRAINT FK_Pagamento_Multa FOREIGN KEY (ID_Multa) REFERENCES Financeiro_Multa(ID_Multa);