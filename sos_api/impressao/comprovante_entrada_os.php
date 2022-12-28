<?php
require(dirname(__FILE__) . "/../modules/fpdf/fpdf.php");
require(dirname(__FILE__) . "/../configuracao/Configuracao.php");
require(dirname(__FILE__) . "/../ordemServico/OrdemServico.php");

class PDF extends FPDF
{

    public $data_loja;
    public $ordem_servico;
    public $id_ordem_servico;

    public function setDadosLoja($input)
    {
        $this->data_loja = $input;
    }

    public function setDadosOrdemServico($input)
    {
        $this->ordem_servico = $input;
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
    $pdf->Cell(0, 10, 'Comprovante entrada de Ordem de Serviço', 0, 1, 'C');
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
    $pdf->Ln(5);
    $pdf->MultiCell(0, 5, $dados_loja['texto_comprovante_os'], 1, 'C');
    $pdf->Ln(5);

    $pdf->Cell(0, 1, '', 'B', 1, 'C');

    // VIA CLIENTE
    

    // CABEÇALHO
    $cnpj = substr($pdf->data_loja['cnpj'], 0, 2) . '.' . substr($pdf->data_loja['cnpj'], 2, 3) . '.' . substr($pdf->data_loja['cnpj'], 5, 3) . '/' . substr($pdf->data_loja['cnpj'], 8, 4) . '-' . substr($pdf->data_loja['cnpj'], 12, 2);
    $cep = substr($pdf->data_loja['cep'], 0, 5) . '-' . substr($pdf->data_loja['cep'], 5, 3);
    $telefone = '(' . substr($pdf->data_loja['telefone'], 0, 2) . ')' . substr($pdf->data_loja['telefone'], 2, 4) . '-' . substr($pdf->data_loja['telefone'], 4, 4);

    $pdf->SetFont('Arial', '', 11);
    // Title
    $pdf->Cell(0, 10, $pdf->data_loja['nome_fantasia'], 0, 1);
    // RAZAO SOCIAL
    $pdf->Cell(0, 0, $pdf->data_loja['razao_social'], 0, 1);
    // CNPJ
    $pdf->Cell(0, 10, 'CNPJ: ' . $cnpj, 0, 1);
    // ENDERECO
    $pdf->Cell(0, 0, $pdf->data_loja['endereco'] . ' - ' .  $pdf->data_loja['bairro'] . ' - ' . $pdf->data_loja['cidade'] . ' - ' . $pdf->data_loja['estado'] . ' - ' . $cep, 0, 1);
    // TELEFONE
    $pdf->Cell(0, 10, 'Telefone: ' . $telefone, 0, 1);
    // FIM CABEÇALHO

    // DADOS ORDEM SERVICO
    $pdf->SetFont('Arial', '', 10);
    $pdf->Cell(0, 5, 'OS: ' . $dados_ordem_servico['id'], 0, 1);
    $pdf->MultiCell(0, 5, 'Data: ' . $data_entrada, 0, 1);
    $pdf->MultiCell(0, 5, 'Cliente: ' . $dados_ordem_servico['nome'], 0, 1);
    $pdf->Multicell(0, 5, 'Equipamento: ' . $dados_ordem_servico['equipamento'], 0, 1);
    $pdf->MultiCell(0, 5, 'Problema relatado: ' . $dados_ordem_servico['problema_relatado'], 0, 1);

    if (isset($dados_ordem_servico['obs'])) {
        $pdf->MultiCell(0, 5, 'Obs: ' . $dados_ordem_servico['obs'], 0, 1);
    }
    $pdf->Ln(5);
    // FIM DADOS ORDEM SERVICO

    $pdf->MultiCell(0, 5, $dados_loja['texto_comprovante_os'], 1, 'C');

    // ASSINATURA DO CLIENTE
    $pdf->Ln(10);
    $pdf->Cell(45);
    $pdf->Cell(100, 0.1, '', 1, 1, 'C');
    $pdf->Cell(0, 5, 'De acordo - ' . date("d/m/Y H:i:s"), 0, 1, 'C');
    $pdf->Ln(10);


    // $pdf->SetFont('Arial', '', 10);
    // $pdf->Cell(0, 5, 'Cliente: ' . $dados_ordem_servico['nome'], 0, 1);
    // $pdf->Cell(0, 5, 'Equipamento: ' . $dados_ordem_servico['equipamento'], 0, 1);
    // $pdf->MultiCell(0, 5, 'Problema relatado: ' . $dados_ordem_servico['problema_relatado'], 0, 1);

    // MATERIAIS
    // for($i=1;$i<=80;$i++)
    //     $pdf->Cell(0,5,'Printing line number '.$i,0,1);
    $pdf->Output('I', 'comprovante_entrada_os_' . $dados_ordem_servico['id'], true);

    // print_r($dados_ordem_servico);
} else {
    echo 'Ordem incorreta';
}
