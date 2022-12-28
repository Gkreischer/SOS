<?php
require_once(dirname(__FILE__) . "/../modules/fpdf/fpdf.php");
require_once(dirname(__FILE__) . "/../configuracao/Configuracao.php");
require_once(dirname(__FILE__) . "/../ordemServico/OrdemServico.php");
require_once(dirname(__FILE__) . "/../materialOs/MaterialOs.php");

class PDF extends FPDF
{

    public $data_loja;
    public $ordem_servico;
    public $id_ordem_servico;
    public $materiais;

    public function setDadosLoja($input)
    {
        $this->data_loja = $input;
    }

    public function setDadosOrdemServico($input)
    {
        $this->ordem_servico = $input;
    }

    public function setMateriais($input) {
        $this->materiais = $input;
    } 

    public function getMateriais() {

        $materiais = new MaterialOs();
        $result_materiais = $materiais->le(
            'material_os.id_material, material_os.quantidade, material_os.valor, materiais.nome, materiais.criado_em, materiais.atualizado_em',
            "INNER JOIN materiais
            ON materiais.id = material_os.id_material
            WHERE material_os.id_os = " . $this->id_ordem_servico
        );
        $this->setMateriais($result_materiais);
        return $this->materiais;
    }

    public function getDadosLoja()
    {
        $configuracao = new Configuracao();
        $result_busca = $configuracao->le('*');
        $result_busca = $result_busca[0];

        return $result_busca;
    }

    public function getDadosOrdemServico()
    {
        $ordem_servico = new OrdemServico();
        $result_busca = $ordem_servico->leComId(
            "ordem_servico.id, ordem_servico.id_cliente, ordem_servico.obs, ordem_servico.problema_relatado, ordem_servico.problema_diagnosticado,
        ordem_servico.id_tecnico_diagnostico, ordem_servico.id_tecnico_execucao, ordem_servico.aceito, ordem_servico.orcado, ordem_servico.finalizado,
        ordem_servico.entregue, ordem_servico.servico_executado, ordem_servico.obs_tecnico, ordem_servico.total_servico, ordem_servico.total_material,
        ordem_servico.total_os, ordem_servico.desconto, ordem_servico.criado_em, ordem_servico.atualizado_em, ordem_servico.concluida_em,
        clientes.nome, clientes.telefone, clientes.celular, clientes.whatsapp, equipamentos.id as id_equipamento, equipamentos.nome as equipamento, equipamentos.numero_serie as numero_serie, 
        equipamentos.descricao, categoria_equipamentos.categoria, funcionarios.id as id_atendente, funcionarios.nome as atendente,
        CASE WHEN clientes.cnpj != null THEN 'Pessoa Juridica' ELSE 'Pessoa Física' END as tipo_cliente",
            $this->id_ordem_servico,
            'inner join clientes
        on clientes.id = ordem_servico.id_cliente
        inner join equipamentos
        on equipamentos.id = ordem_servico.id_equipamento
        inner join categoria_equipamentos 
        on categoria_equipamentos.id = equipamentos.id_categoria
        inner join funcionarios
        on funcionarios.id = ordem_servico.id_atendente'
        );

        $this->ordem_servico = $result_busca[0];
        return $this->ordem_servico;
    }

    public function setIdOrdemServico($input)
    {
        if (is_numeric($input) && isset($input)) {
            $this->id_ordem_servico = $input;
        }
    }

    // Page header
    function Header()
    {

        $cnpj = substr($this->data_loja['cnpj'], 0, 2) . '.' . substr($this->data_loja['cnpj'], 2, 3) . '.' . substr($this->data_loja['cnpj'], 5, 3) . '/' . substr($this->data_loja['cnpj'], 8, 4) . '-' . substr($this->data_loja['cnpj'], 12, 2);
        $cep = substr($this->data_loja['cep'], 0, 5) . '-' . substr($this->data_loja['cep'], 5, 3);
        $telefone = '(' . substr($this->data_loja['telefone'], 0, 2) . ')' . substr($this->data_loja['telefone'], 2, 4) . '-' . substr($this->data_loja['telefone'], 4, 4);
        // Logo
        $this->Image($this->data_loja['caminho_logo'], 15, 8, 30);
        // Arial bold 13
        $this->SetFont('Arial', 'B', 13);
        // SPACE
        $this->Cell(40);
        // Title
        $this->Cell(130, 0, $this->data_loja['nome_fantasia'], 0, 1);
        // Arial regular 13
        $this->SetFont('Arial', '', 10);
        // SPACE
        $this->Cell(40);
        // RAZAO SOCIAL
        $this->Cell(180, 10, $this->data_loja['razao_social'], 0, 1);
        // SPACE
        $this->Cell(40);
        // CNPJ
        $this->Cell(180, 0, 'CNPJ: ' . $cnpj, 0, 1);
        // SPACE
        $this->Cell(40);
        // ENDERECO
        $this->MultiCell(180, 10, $this->data_loja['endereco'] . ' - ' .  $this->data_loja['bairro'] . ' - ' . $this->data_loja['cidade'] . ' - ' . $this->data_loja['estado'] . ' - ' . $cep);
        // SPACE
        $this->Cell(40);
        // TELEFONE
        $this->Cell(180, 0, 'Telefone: ' . $telefone, 0, 1);
        // Line break
        $this->Ln(10);
    }

    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Arial', 'I', 8);
        // Page number
        $this->Cell(0, 5, $this->PageNo() . '/{nb}', 0, 1, 'C');
        // SOS - Sistema de Ordem de Serviço
        $this->Cell(0, 5, 'SOS - Sistema de Ordem de Serviço', 0, 0, 'C');
    }
}

// Instanciation of inherited class
$id_ordem_recebida = $_GET['id'];

if (isset($id_ordem_recebida) && is_numeric($id_ordem_recebida)) {
    $pdf = new PDF();

    $pdf->setIdOrdemServico($_GET['id']);
    $dados_loja = $pdf->getDadosLoja();
    $pdf->setDadosLoja($dados_loja);

    $pdf->setIdOrdemServico($_GET['id']);
    $dados_ordem_servico = $pdf->getDadosOrdemServico();

    $pdf->AliasNbPages();
    $pdf->AddPage();

    $pdf->SetCreator('SOS - Sistema de Ordem de Serviço', true);
    $pdf->SetAuthor('SOS - Sistema de Ordem de Serviço', true);


    // DADOS ORDEM SERVICO
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->Cell(0, 10, 'Orçamento da Ordem de Serviço', 0, 1, 'C');
    $pdf->Cell(0, 10, 'Dados ordem de serviço', 0, 1);
    $pdf->Cell(0, 10, 'OS: ' . $dados_ordem_servico['id'], 0, 1);

    $data_entrada = $dados_ordem_servico['criado_em'];
    $data_entrada = substr($data_entrada, 8, 2) . '/' . substr($data_entrada, 5, 2) . '/' . substr($data_entrada, 0, 4) . ' ' . substr($data_entrada, 10, 9);
    
    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(0, 5, 'Data: ' . $data_entrada, 0, 1);
    $pdf->Cell(0, 5, 'Cliente: ' . $dados_ordem_servico['nome'], 0, 1);
    $pdf->Cell(0, 5, 'Equipamento: ' . $dados_ordem_servico['equipamento'], 0, 1);
    $pdf->MultiCell(0, 5, 'Problema relatado: ' . $dados_ordem_servico['problema_relatado'], 0, 1);

    if (isset($dados_ordem_servico['obs'])) {
        $pdf->MultiCell(0, 5, 'Obs: ' . $dados_ordem_servico['obs'], 0, 1);
    }


    // MATERIAIS
    $materiais = $pdf->getMateriais();

    if(count($materiais) > 0){
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 10, 'Materiais', 0, 1);
        $pdf->SetFont('Arial', '', 10);
        foreach($materiais as $material){
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(0, 5, $material['nome'], 0, 1);
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(0, 5, 'Qtd.: ' . $material['quantidade'], 'B', 1);
            $pdf->Cell(0, 5, 'R$' . number_format($material['valor'], 2, ',', '.'), 0, 1);
    }
    $pdf->Cell(0, 10, 'Total materiais: R$ ' . number_format($dados_ordem_servico['total_material'], 2, ',', '.'), 0, 1, 'R');

    }
    // SERVICO
    $pdf->SetFont('Arial', 'B', 14);
    $pdf->Cell(0, 10, 'Valores', 0, 1);
    $pdf->SetFont('Arial', '', 12);
    $pdf->Cell(0, 5, 'Total serviço: R$ ' . number_format($dados_ordem_servico['total_servico'], 2, ',', '.'), '0', 1,);
    $pdf->Cell(0, 5, 'Total material: R$ ' . number_format($dados_ordem_servico['total_material'], 2, ',', '.'), 0, 1);
    $pdf->Cell(0, 5, 'Desconto: R$ ' . number_format($dados_ordem_servico['desconto'], 2, ',', '.'), 0, 1);
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->Cell(0, 10, 'Total Ordem de Serviço: R$ ' . number_format($dados_ordem_servico['total_os'], 2, ',', '.'), 'B', 1);

    $pdf->Output('I', 'orcamento_os_' . $dados_ordem_servico['id'], true);
    
    // print_r($dados_ordem_servico);
} else {
    echo 'Ordem incorreta';
}
