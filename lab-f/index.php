<?php

require __DIR__ . '/autoload.php';

use App\Serializer;
use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;

$inputData = $_COOKIE['last_data']       ?? '';
$formatIn  = $_COOKIE['last_format_in']  ?? 'csv';
$formatOut = $_COOKIE['last_format_out'] ?? 'json';
$result    = '';
$error     = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = $_POST['data']       ?? '';
    $formatIn  = $_POST['format_in']  ?? 'csv';
    $formatOut = $_POST['format_out'] ?? 'json';

    setcookie('last_data',       $inputData, time() + 3600);
    setcookie('last_format_in',  $formatIn,  time() + 3600);
    setcookie('last_format_out', $formatOut, time() + 3600);

    $serializer = new Serializer([
        new CsvEncoder(),
        new JsonEncoder(),
        new YamlEncoder(),
    ]);
    try {
        $result = $serializer->convert($inputData, $formatIn, $formatOut);
    } catch (\Throwable $e) {
        $error = 'Błąd konwersji: ' . $e->getMessage();
    }
}

$formats = ['csv' => 'CSV', 'ssv' => 'SSV', 'tsv' => 'TSV', 'json' => 'JSON', 'yaml' => 'YAML'];

function formatOptions(array $formats, string $selected): string
{
    $html = '';
    foreach ($formats as $value => $label) {
        $sel   = $selected === $value ? ' selected' : '';
        $html .= "<option value=\"{$value}\"{$sel}>{$label}</option>";
    }
    return $html;
}

?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter danych</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
        h1 { font-size: 1.4rem; margin-bottom: 1rem; }
        .row { display: flex; gap: 1rem; }
        .col { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
        label { font-weight: bold; font-size: 0.9rem; }
        textarea { width: 100%; height: 200px; font-family: monospace; font-size: 0.85rem; padding: 0.5rem; resize: vertical; }
        select { width: 100%; padding: 0.4rem; }
        button { padding: 0.5rem 1.5rem; cursor: pointer; }
        pre { background: #f4f4f4; padding: 1rem; overflow: auto; min-height: 50px; border: 1px solid #ddd; }
    </style>
</head>
<body>
<h1>Konwerter danych</h1>

<form method="POST">
    <div class="row">
        <div class="col">
            <label for="format_in">Format wejściowy</label>
            <select name="format_in" id="format_in">
                <?= formatOptions($formats, $formatIn) ?>
            </select>
            <label for="data">Dane wejściowe</label>
            <textarea name="data" id="data"><?= htmlspecialchars($inputData) ?></textarea>
        </div>
        <div class="col">
            <label for="format_out">Format wyjściowy</label>
            <select name="format_out" id="format_out">
                <?= formatOptions($formats, $formatOut) ?>
            </select>
            <label>Wynik</label>
            <pre><?= htmlspecialchars($result) ?></pre>
        </div>
    </div>
    <?php if ($error): ?>
        <p style="color:red"><?= htmlspecialchars($error) ?></p>
    <?php endif; ?>
    <br>
    <button type="submit">Convert</button>
</form>
</body>
</html>