CREATE TABLE `clientes` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) UNIQUE NOT NULL,
  `cpf` varchar(255) UNIQUE,
  `razao_social` varchar(255) UNIQUE,
  `cnpj` varchar(255) UNIQUE,
  `telefone` varchar(255),
  `celular` varchar(255) NOT NULL,
  `whatsapp` boolean NOT NULL,
  `email` varchar(255),
  `endereco` varchar(255),
  `bairro` varchar(255),
  `cidade` varchar(255),
  `estado` char(2),
  `cep` varchar(255),
  `obs` varchar(255),
  `criado_em` timestamp DEFAULT (now()),
  `atualizado_em` timestamp
);

CREATE TABLE `equipamentos` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `id_categoria` int NOT NULL,
  `numero_serie` varchar(255),
  `descricao` varchar(255),
  `criado_em` timestamp DEFAULT (now()),
  `atualizado_em` timestamp
);

CREATE TABLE `categoria_equipamentos` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `categoria` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `materiais` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) UNIQUE NOT NULL,
  `id_categoria` int NOT NULL,
  `descricao` varchar(255),
  `valor` decimal(10,2),
  `caminho_imagem` varchar(255),
  `criado_em` timestamp DEFAULT (now()),
  `atualizado_em` timestamp
);

CREATE TABLE `categoria_materiais` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `categoria` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `funcionarios` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) UNIQUE NOT NULL,
  `cpf` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `telefone` varchar(255) NOT NULL,
  `celular` varchar(255),
  `caminho_imagem` varchar(255),
  `cargo` varchar(255) NOT NULL,
  `nivel` int DEFAULT 0,
  `senha` varchar(255) NOT NULL,
  `token` varchar(255),
  `criado_em` timestamp DEFAULT (now()),
  `atualizado_em` timestamp
);

CREATE TABLE `ordem_servico` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `id_equipamento` int NOT NULL,
  `id_atendente` int NOT NULL,
  `id_tecnico_diagnostico` int,
  `id_tecnico_execucao` int,
  `aceito` int DEFAULT 0,
  `orcado` int DEFAULT 0,
  `finalizado` int DEFAULT 0,
  `entregue` int DEFAULT 0,
  `problema_relatado` varchar(255),
  `problema_diagnosticado` varchar(255),
  `servico_executado` varchar(255),
  `obs` varchar(255),
  `obs_tecnico` varchar(255),
  `total_servico` decimal(10,2) DEFAULT 0,
  `total_material` decimal(10,2) DEFAULT 0,
  `total_os` decimal(10,2) DEFAULT 0,
  `desconto` decimal(10,2) DEFAULT 0,
  `criado_em` timestamp DEFAULT (now()),
  `atualizado_em` timestamp,
  `concluida_em` timestamp,
  `entregue_em` timestamp
);

CREATE TABLE `material_os` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_os` int NOT NULL,
  `id_material` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT 0,
  `valor` decimal(10,2)
);

CREATE TABLE `configuracao` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `razao_social` varchar(255) UNIQUE NOT NULL,
  `nome_fantasia` varchar(255) UNIQUE NOT NULL,
  `cnpj` varchar(255) UNIQUE NOT NULL,
  `telefone` varchar(255) NOT NULL,
  `celular` varchar(255),
  `email` varchar(255),
  `whatsapp` int NOT NULL DEFAULT 0,
  `caminho_logo` varchar(255),
  `endereco` varchar(255),
  `bairro` varchar(255),
  `cidade` varchar(255),
  `estado` char(2),
  `cep` varchar(255),
  `texto_comprovante_os` text,
  `criado_em` timestamp DEFAULT (now()),
  `atualizado_em` timestamp
);

CREATE INDEX `clientes_index_0` ON `clientes` (`id`);

CREATE INDEX `clientes_index_1` ON `clientes` (`nome`);

CREATE INDEX `clientes_index_2` ON `clientes` (`cpf`);

CREATE INDEX `clientes_index_3` ON `clientes` (`cnpj`);

CREATE INDEX `equipamentos_index_4` ON `equipamentos` (`id_categoria`);

CREATE INDEX `equipamentos_index_5` ON `equipamentos` (`id_cliente`);

CREATE INDEX `categoria_equipamentos_index_6` ON `categoria_equipamentos` (`categoria`);

CREATE INDEX `materiais_index_7` ON `materiais` (`nome`);

CREATE INDEX `materiais_index_8` ON `materiais` (`id_categoria`);

CREATE INDEX `categoria_materiais_index_9` ON `categoria_materiais` (`id`);

CREATE INDEX `categoria_materiais_index_10` ON `categoria_materiais` (`categoria`);

CREATE INDEX `funcionarios_index_11` ON `funcionarios` (`id`);

CREATE INDEX `funcionarios_index_12` ON `funcionarios` (`email`);

CREATE INDEX `ordem_servico_index_13` ON `ordem_servico` (`id_cliente`);

CREATE INDEX `ordem_servico_index_14` ON `ordem_servico` (`id_equipamento`);

CREATE INDEX `ordem_servico_index_15` ON `ordem_servico` (`id_atendente`);

CREATE INDEX `ordem_servico_index_16` ON `ordem_servico` (`id_tecnico_diagnostico`);

CREATE INDEX `ordem_servico_index_17` ON `ordem_servico` (`id_tecnico_execucao`);

CREATE INDEX `material_os_index_18` ON `material_os` (`id_os`);

CREATE INDEX `material_os_index_19` ON `material_os` (`id_material`);

ALTER TABLE `equipamentos` ADD FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `ordem_servico` ADD FOREIGN KEY (`id_equipamento`) REFERENCES `equipamentos` (`id`);

ALTER TABLE `equipamentos` ADD FOREIGN KEY (`id_categoria`) REFERENCES `categoria_equipamentos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `material_os` ADD FOREIGN KEY (`id_material`) REFERENCES `materiais` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `materiais` ADD FOREIGN KEY (`id_categoria`) REFERENCES `categoria_materiais` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `ordem_servico` ADD FOREIGN KEY (`id_atendente`) REFERENCES `funcionarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `ordem_servico` ADD FOREIGN KEY (`id_tecnico_diagnostico`) REFERENCES `funcionarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `ordem_servico` ADD FOREIGN KEY (`id_tecnico_execucao`) REFERENCES `funcionarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `ordem_servico` ADD FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `material_os` ADD FOREIGN KEY (`id_os`) REFERENCES `ordem_servico` (`id`) ON DELETE NO ACTION;
