-- Tabelas de Base (Sem dependências externas)
-- AUTOR
INSERT INTO Autor (ID_Autor, Nome_Autor) VALUES
(1, 'Alberto Mussa'), (2, 'Aluísio de Azevedo'), (3, 'Ariano Suassuna'),
(4, 'Autran Dourado'), (5, 'Bernardo Guimarães'), (6, 'Casimiro de Abreu'),
(7, 'Carlos Heitor Cony'), (8, 'Clarice Lispector'), (9, 'Denis Mandarino'),
(10, 'George Raymond Richard Martin'), (11, 'John Ronald Reuel Tolkien'),
(12, 'Clive Staples Lewis'), (13, 'Edgar Allan Poe'), (14, 'Rick Riordan'), (15, 'Alexandre Dumas');

-- DEPARTAMENTO
INSERT INTO Departamento (ID_Departamento, Nome_Departamento) VALUES
(1, 'Diretoria'), (2, 'Gerência'), (3, 'Financeiro'), (4, 'Contábil'), (5, 'TI'), (6, 'Recursos Humanos'), (7, 'Recepção');

-- CARGO
INSERT INTO Cargo (ID_Cargo, Nome_Cargo, Salario) VALUES
(1,'Diretor', 20000.00), (2,'Gerente', 8000.00), (3,'Coordenador de Finanças', 7000.00),
(4,'Coordenador Contabil', 7000.00), (5,'Coordenador de RH', 6000.00), (6, 'Coordenador de TI', 7000.00),
(7,'Analista de Sistemas', 3000.00), (8,'Analista de Suporte', 2500.00), (9,'Auxiliar Financeiro', 1700.00),
(10,'Auxiliar Contábil', 1700.00), (11,'Auxiliar de RH', 1300.00), (12,'Recepcionista', 1000.00);

-- ENDERECO
INSERT INTO Endereco (ID_Endereco, CEP, Logradouro, Bairro, Cidade, Estado, Numero) VALUES
(1, '05728-354', 'Avenida 23 de Maio', 'Jardim das Árvores', 'São Paulo', 'SP', 21),
(2, '02182-635', 'Rua Martins Fontes', 'Parque Industrial', 'São Paulo', 'SP', 252),
(3, '05728-355', 'Avenida dos Bandeirantes', 'Residencial Dourados', 'São Paulo', 'SP', 20),
(4, '02182-636', 'Avenida Eng. Luis Carlos Berrini', 'Vila Água Bonita', 'São Paulo', 'SP', 12),
(5, '05728-356', 'Rua da Consolação', 'Vila Brasil', 'São Paulo', 'SP', 14),
(6, '02182-637', 'Rua Ipiranga', 'Vila Cristal', 'São Paulo', 'SP', 123),
(7, '05728-357', 'Avenida Brigadeiro Faria Lima', 'Vila das Árvores', 'São Paulo', 'SP', 50),
(8, '02182-638', 'Rua Funchal', 'Vila das Nações', 'São Paulo', 'SP', 1000),
(9, '05728-358', 'Avenida Ibirapuera', 'Vila do Lago', 'Campinas', 'SP', 300),
(10, '02182-639', 'Avenida Interlagos', 'Vila dos Estados', 'Barretos', 'SP', 247),
(11, '05728-359', 'Avenida José Carlos Pace', 'Vila dos Pássaros', 'Boituva', 'SP', 23),
(12, '02182-640', 'Avenida Pres. Juscelino Kubitschek', 'Vila Dourados', 'Marabá', 'SP', 45),
(13, '05728-360', 'Avenida Brigadeiro Luis Antonio', 'Água Aguinha', 'Ibiuna', 'SP', 48),
(14, '02182-641', 'Marginal Pinheiros', 'Água Bonita', 'São José', 'SP', 69),
(15, '05728-361', 'Avenida Nossa Sra. do Sabará', 'Conceição', 'São Paulo', 'SP', 65),
(16, '02182-642', 'Avenida Nove de Julho', 'Conjunto Metalúrgicos', 'São Paulo', 'SP', 72),
(17, '05728-362', 'Rua Olimpíadas', 'Continental', 'São Paulo', 'SP', 68),
(18, '02182-643', 'Avenida Rebouças', 'Distrito Industrial Altino', 'São Paulo', 'SP', 2581),
(19, '05728-363', 'Avenida do Rio Bonito', 'Distrito Industrial Anhanguera', 'São Paulo', 'SP', 2541),
(20, '02182-644', 'Avenida Robert Kennedy', 'Distrito Industrial Autonomistas', 'São Paulo', 'SP', 3965),
(21, '05728-364', 'Avenida Jornalista Roberto Marinho', 'Distrito Industrial Centro', 'São Paulo', 'SP', 698),
(22, '02182-645', 'Avenida Santo Amaro', 'Distrito Industrial Mazzei', 'São Paulo', 'SP', 5879),
(23, '05728-365', 'Rua Maria Imaculada', 'Distrito Industrial Remédios', 'São Paulo', 'SP', 6598),
(24, '02182-646', 'Avenida Washington Luis', 'Helena Maria', 'São Paulo', 'SP', 654747),
(25, '05728-366', 'Avenida Alfredo Maia', 'IAPI', 'São Paulo', 'SP', 584),
(26, '02182-647', 'Avenida Alfredo Maluf', 'Jaguaribe', 'São Paulo', 'SP', 265),
(27, '05728-367', 'Avenida Alfredo Pujol', 'Jardim D''Abril', 'São Paulo', 'SP', 987),
(28, '02182-648', 'Avenida Amazonas', 'Jardim das Flores', 'São Paulo', 'SP', 574),
(29, '05728-368', 'Avenida Ampére', 'Jardim Elvira', 'São Paulo', 'SP', 414),
(30, '02182-649', 'Avenida Ana Camargo', 'Jardim Mutinga', 'São Paulo', 'SP', 174);

-- ATUALIZAÇÃO DE CIDADE
UPDATE Endereco SET Cidade='São Paulo' WHERE ID_Endereco IN (8,14,15);
UPDATE Endereco SET Cidade='Campinas'  WHERE ID_Endereco=9;
UPDATE Endereco SET Cidade='Barretos'  WHERE ID_Endereco=10;
UPDATE Endereco SET Cidade='Boituva'   WHERE ID_Endereco=11;
UPDATE Endereco SET Cidade='Marabá'    WHERE ID_Endereco=12;
UPDATE Endereco SET Cidade='Ibiuna'    WHERE ID_Endereco=13;
UPDATE Endereco SET Cidade='São José'  WHERE ID_Endereco=14;

-- Tabelas de Nível 1 (Dependem das tabelas acima)
-- EDITORA
INSERT INTO Editora (ID_Editora, ID_Endereco, Nome_Editora) VALUES
(1, 8, 'Aleph'), (2, 9, 'Moderna'), (3, 10, 'Saraiva'), (4, 11, 'Ática'),
(5, 12, 'Casa'), (6, 13, 'Leya'), (7, 14, 'Draco'), (8, 15, 'Nova');

-- USUARIO (Adicionado o campo Status_Usuario padrão 'Ativo')
INSERT INTO Usuario (ID_Usuario, ID_Endereco, Nome_Usuario, Telefone, CPF, Status_Usuario) VALUES
(1, 1, 'Antonio Marcos da Silva', '5844-2647', '193.107.214-21', 'Ativo'),
(2, 2, 'Carlos Drummond de Andrade', '5846-6576', '122.147.655-47', 'Ativo'),
(3, 3, 'Juliana Bento Souza', '5879-5469', '193.107.214-22', 'Ativo'),
(4, 4, 'Arlene Batista', '1254-5647', '122.147.655-48', 'Ativo'),
(5, 5, 'Bret Berlusconi', '5844-2648', '193.107.214-23', 'Ativo'),
(6, 6, 'Cindy Crall', '5846-6577', '122.147.655-49', 'Ativo'),
(7, 7, 'Donatelo Siqueira', '5879-5470', '193.107.214-24', 'Ativo'),
(8, 8, 'Emily Mall', '1254-5648', '122.147.655-50', 'Ativo'),
(9, 9, 'Franklin Pekens', '5844-2649', '193.107.214-25', 'Ativo'),
(10, 10, 'Gert Hender', '5846-6578', '122.147.655-51', 'Ativo'),
(11, 11, 'Harvey Jonks', '5879-5471', '193.107.214-26', 'Ativo'),
(12, 12, 'Irene Silva', '1254-5649', '122.147.655-52', 'Ativo'),
(13, 13, 'Jose Albino', '5844-2650', '193.107.214-27', 'Ativo'),
(14, 14, 'Katia Suellen', '5846-6579', '122.147.655-53', 'Ativo'),
(15, 15, 'Lee Shimizu', '5879-5472', '193.107.214-28', 'Ativo'),
(16, 16, 'Maria Aparecida', '1254-5650', '122.147.655-54', 'Ativo'),
(17, 17, 'Nate Rogan', '5844-2651', '193.107.214-29', 'Ativo'),
(18, 18, 'Ophelia Maria', '5846-6580', '122.147.655-55', 'Ativo'),
(19, 19, 'Philippe Coutinho', '5879-5473', '193.107.214-30', 'Ativo'),
(20, 20, 'Rina Pontes', '1254-5651', '122.147.655-56', 'Ativo'),
(21, 21, 'Sean Woods', '5844-2652', '193.107.214-31', 'Ativo'),
(22, 22, 'Tammy Miranda', '5846-6581', '122.147.655-57', 'Ativo'),
(23, 23, 'Vicente Del Bosque', '5879-5474', '193.107.214-32', 'Ativo'),
(24, 24, 'Whitney Cinse', '1254-5652', '122.147.655-58', 'Ativo'),
(25, 25, 'Alberto Roberto', '5844-2653', '193.107.214-33', 'Ativo'),
(26, 26, 'Beryl Berey', '5846-6582', '122.147.655-59', 'Ativo'),
(27, 27, 'Chris Nicolas', '5879-5475', '193.107.214-34', 'Ativo'),
(28, 28, 'Debby Loyd', '1254-5653', '122.147.655-60', 'Ativo'),
(29, 29, 'Ernesto Coimbra', '5844-2654', '193.107.214-35', 'Ativo'),
(30, 30, 'Florence Seedorf', '5846-6583', '122.147.655-61', 'Ativo');

-- FUNCIONARIO
INSERT INTO Funcionario (ID_Funcionario, ID_Departamento, ID_Cargo, Nome_Funcionario, Data_Admissao, Data_Demissao) VALUES
(1, 7, 12, 'Fabriola Pereira', '2000-01-10', '2012-09-20'), (2, 2, 2, 'Carlos Meireles', '1995-04-11', '9999-01-01'),
(3, 1, 1, 'Adalberto Cristovão', '1990-07-11', '9999-01-01'), (4, 1, 1, 'Camilla Prado', '1985-10-10', '9999-01-01'),
(5, 2, 2, 'Marcio Tales de Souza', '1981-01-09', '9999-01-01'), (6, 5, 6, 'Fernando da Silva', '1976-04-10', '9999-01-01'),
(7, 3, 3, 'Barbara Maria', '1971-07-11', '9999-01-01'), (8, 7, 12, 'Alice Meire', '1966-10-10', '9999-01-01'),
(9, 6, 5, 'João Da Silva', '1962-01-09', '9999-01-01'), (10,4, 4, 'Marcos Prado', '1957-04-10', '9999-01-01'),
(11,7, 12, 'Claudia Cristina', '2012-10-10', '9999-01-01');

-- OBRA
INSERT INTO Obra (ID_Obra, ID_Autor, ID_Editora, Titulo_Obra, Numero_Publicacao, Genero, Data_Publicacao) VALUES
(1, 15, 1, 'O Conde de Monte Cristo', 12, 'Auto Ajuda', '2005-05-10'), (2, 12, 2, 'Tratado de Confissom', 5, 'Filosofia', '2010-12-31'),
(3, 10, 5, 'Triste Fim de Policarpo Quaresm', 3, 'Política', '2001-03-05'), (4, 14, 8, 'Tratado da Natureza Humana', 78, 'Romance', '2002-05-14'),
(5, 8, 7, 'Farsa de Inês Pereira', 2, 'Religioso', '1986-04-25'), (6, 15, 6, 'Filho Nativo', 45, 'Poema', '2004-06-12'),
(7, 10, 6, 'Jogo Dos Tronos', 6, 'Ficção', '2001-08-26'), (8, 13, 8, 'Diabo dos Números', 2, 'Terror', '1981-08-31'),
(9, 10, 6, 'Furia dos Reis', 1, 'Estrangeiro', '2008-08-06'), (10, 1, 6, 'Filhos e Amantes', 98, 'Infanto Juvenil', '2005-09-01'),
(11, 3, 5, 'Finis Patriae', 46, 'Política', '2013-03-04'), (12, 3, 5, 'Finnegans Wake', 2, 'Romance', '2013-09-30'),
(13, 15, 1, 'Os Três Mosqueteiros', 2, 'Romance', '1953-03-06'), (14, 6, 3, 'Falcão de Malta', 2, 'Auto Ajuda', '2010-01-02'),
(15, 14, 2, 'Vidas Secas', 45, 'Filosofia', '2004-07-09'), (16, 2, 4, 'Flores sem Fruto', 1, 'Política', '2001-08-15'),
(17, 4, 7, 'Deixados para Trás', 8, 'Política', '1931-09-12'), (18, 12, 8, 'Deus das Moscas', 2, 'Romance', '2003-09-25'),
(19, 11, 4, 'Senhor dos Aneis', 4, 'Ficção', '1989-02-28'), (20, 7, 3, 'Fluviais', 8, 'Terror', '2011-03-18'),
(21, 2, 2, 'Folhas Caídas', 1, 'Ficção', '2010-09-19'), (22, 5, 6, 'Força das Coisas', 24, 'Terror', '1985-11-25'),
(23, 15, 5, 'Fortaleza de Sharpe', 81, 'Política', '2001-01-01'), (24, 9, 1, 'Frankenstein', 8, 'Romance', '2010-12-13'),
(25, 11, 7, 'Rei Arthur', 85, 'Religioso', '1999-07-15'), (26, 6, 6, 'Dom Casmurro', 2, 'Poema', '2011-08-15'),
(27, 8, 4, 'Dia dos Gafanhotos', 85, 'Política', '2011-11-11'), (28, 12, 8, 'Diabo dos Números', 2, 'Romance', '2013-05-06'),
(29, 3, 2, 'Discurso do Método', 8, 'Religioso', '2012-08-06'), (30, 10, 3, 'Arte Da Guerra', 8, 'Romance', '1913-05-01');



-- Tabelas de Nível 2 (Dependem da Obra e Funcionários)
-- ESTOQUE
INSERT INTO Estoque (ID_Estoque, ID_Obra, Quantidade_Livro, Qtd_Disponivel, Valor_Unitario) VALUES
(1, 1, 5, 1, 90.00), (2, 2, 12, 10, 55.00), (3, 3, 4, 2, 20.00), (4, 4, 4, 0, 64.32),
(5, 5, 23, 18, 97.35), (6, 6, 13, 11, 98.65), (7, 7, 33, 28, 41.63), (8, 8, 6, 4, 65.48),
(9, 9, 15, 12, 53.25), (10, 10, 4, 0, 87.10), (11, 11, 15, 13, 106.84), (12, 12, 6, 1, 115.85),
(13, 13, 19, 14, 86.54), (14, 14, 7, 5, 97.21), (15, 15, 26, 22, 37.15), (16, 16, 16, 11, 21.45),
(17, 17, 25, 15, 25.35), (18, 18, 9, 6, 85.37), (19, 19, 15, 12, 60.50), (20, 20, 9, 6, 94.20),
(21, 21, 10, 7, 55.00), (22, 22, 15, 11, 85.00), (23, 23, 17, 16, 122.50), (24, 24, 64, 59, 105.00),
(25, 25, 17, 14, 80.00), (26, 26, 25, 22, 108.25), (27, 27, 2, 0, 57.85), (28, 28, 7, 3, 101.00),
(29, 29, 3, 0, 82.12), (30, 30, 16, 14, 90.36);

-- EMPRESTIMO
INSERT INTO Emprestimo (ID_Emprestimo, ID_Funcionario, ID_Estoque, ID_Usuario, Data_Emprestimo, Hora_Emprestimo, Data_Entrega) VALUES
(1, 1, 10, 1, '2011-08-15', '08:00:00', '2011-08-17'), (2, 8, 14, 20, '2011-09-26', '08:00:00', '2011-09-28'),
(3, 8, 18, 13, '2011-07-11', '10:00:00', '2011-07-13'), (4, 8, 17, 29, '2011-08-18', '18:10:00', '2011-08-20'),
(5, 1, 23, 2, '2011-06-09', '08:00:00', '2011-06-11'), (6, 8, 24, 21, '2011-08-20', '08:00:00', '2011-08-22'),
(7, 1, 21, 14, '2012-03-25', '08:00:00', '2012-03-27'), (8, 8, 6, 30, '2011-08-19', '13:00:00', '2011-08-21'),
(9, 8, 30, 19, '2012-03-27', '13:00:00', '2012-03-29'), (10, 1, 9, 3, '2011-08-19', '09:54:00', '2011-08-21'),
(11, 8, 11, 12, '2012-03-29', '13:00:00', '2012-03-31'), (12, 1, 25, 8, '2011-08-19', '09:54:00', '2011-08-21'),
(13, 1, 16, 11, '2012-03-31', '14:55:00', '2012-04-02'), (14, 1, 1, 4, '2012-04-01', '12:01:00', '2012-04-03'),
(15, 8, 26, 11, '2013-06-25', '14:29:00', '2013-06-27'), (16, 1, 13, 22, '2011-08-20', '10:00:00', '2011-08-22'),
(17, 1, 19, 8, '2011-08-20', '14:55:00', '2011-08-22'), (18, 11, 4, 10, '2013-07-07', '16:30:00', '2013-07-09'),
(19, 8, 27, 12, '2013-07-07', '11:11:00', '2013-07-09'), (20, 11, 2, 5, '2013-06-25', '17:54:00', '2013-06-27'),
(21, 8, 20, 18, '2012-12-28', '10:00:00', '2012-12-30'), (22, 8, 22, 15, '2013-06-25', '08:36:00', '2013-06-27'),
(23, 8, 7, 9, '2012-12-28', '14:55:00', '2012-12-30'), (24, 11, 12, 17, '2012-12-28', '13:00:00', '2012-12-30'),
(25, 8, 5, 6, '2013-07-07', '10:00:00', '2013-07-09'), (26, 8, 8, 23, '2013-07-07', '18:10:00', '2013-07-09'),
(27, 11, 27, 16, '2013-01-31', '14:55:00', '2013-02-02'), (28, 11, 29, 7, '2013-01-31', '10:00:00', '2013-02-02'),
(29, 11, 3, 24, '2013-01-31', '18:10:00', '2013-02-02');


-- Tabelas de Nível 3 (Dependem de Empréstimo)
-- DEVOLUCAO (Depende de Funcionario e Emprestimo)
-- DEVOLUCAO
INSERT INTO Devolucao (ID_Devolucao, ID_Funcionario, ID_Emprestimo, Data_Devolucao, Hora_Devolucao) VALUES
(1, 1, 5, '2011-06-11', '18:00:00'), (2, 8, 3, '2011-07-13', '13:00:00'),
(3, 1, 1, '2011-08-17', '14:55:00'), (4, 8, 4, '2011-08-20', '12:01:00'),
(5, 8, 8, '2011-08-21', '10:00:00'), (6, 1, 10, '2011-08-21', '14:55:00'),
(7, 1, 12, '2011-08-21', '13:00:00'), (8, 8, 6, '2011-08-22', '14:55:00'),
(9, 1, 16, '2011-08-26', '10:00:00'), (10, 1, 17, '2011-08-22', '18:00:00'),
(11, 8, 2, '2011-09-28', '14:29:00'), (12, 1, 7, '2012-03-30', '17:54:00'),
(13, 8, 9, '2012-03-29', '08:36:00'), (14, 8, 11, '2012-03-31', '16:30:00'),
(15, 1, 13, '2012-04-08', '11:11:00'), (16, 1, 14, '2012-04-03', '10:00:00'),
(17, 8, 21, '2012-12-30', '18:00:00'), (18, 8, 23, '2013-01-12', '15:00:00'),
(19, 11, 24, '2012-12-30', '16:00:00'), (20, 11, 27, '2013-02-02', '18:00:00');

-- RESERVA
INSERT INTO Reserva (ID_Reserva, ID_Emprestimo, ID_Funcionario, ID_Usuario, ID_Estoque, Status_Livro, Data_Reserva, Hora_Reserva) VALUES
(1, 5, 1, 2,  14, 'Disponivel', '2011-06-08', '08:40:00'), (2, 3, 8, 13, 3, 'Reservado', '2011-07-11', '09:30:00'),
(3, 1, 1, 1,  14, 'Reservado', '2011-08-14', '08:00:00'), (4, 4, 8, 29, 20, 'Emprestado', '2011-08-18', '15:00:00'),
(5, 8, 8, 30,  16, 'Emprestado', '2011-08-19', '10:00:00'), (6, 10, 1, 3,  8, 'Reservado', '2011-08-18', '15:00:00'),
(7, 12, 1, 8,  25, 'Disponivel', '2011-08-19', '09:00:00'), (8, 6, 8, 21,  24, 'Disponivel', '2011-08-08', '08:15:00'),
(9, 16, 1, 22, 13, 'Disponivel', '2011-08-18', '18:00:00'), (10, 17, 1, 8,  22, 'Reservado', '2011-08-15', '14:00:00');


-- Inserindo multas baseadas nas devoluções com atraso identificadas no escopo
INSERT INTO Financeiro_Multa ( ID_Devolucao, Valor_Total, Dias_Atraso, Status_Multa) VALUES
( 9, 20.00, 4, 'Pendente'),  -- Empréstimo 16: Entrega 22/08, Devolução 26/08 (4 dias)
( 12, 15.00, 3, 'Pendente'),  -- Empréstimo 07: Entrega 27/03, Devolução 30/03 (3 dias)
( 15, 30.00, 6, 'Pendente'), -- Empréstimo 13: Entrega 02/04, Devolução 08/04 (6 dias)
( 18, 65.00, 13, 'Paga');    -- Empréstimo 23: Entrega 30/12, Devolução 12/01 (13 dias)

-- Registrando o pagamento da multa de maior valor (ID_Multa 4)
INSERT INTO Financeiro_Pagamento (ID_Multa, Data_Pagamento, Forma_Pagamento) VALUES
(4, '2013-01-12 15:30:00', 'Pix');

/* INSERT INTO Usuario (ID_Endereco, Nome_Usuario, Telefone, CPF)
SELECT ID_Endereco, Nome_Usuario, Telefone, CPF
FROM Usuario
WHERE ID_Usuario = 6; */