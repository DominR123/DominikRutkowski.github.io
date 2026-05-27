<?php
namespace App\Encoder;
use App\Encoder\EncoderInterface;
class CsvEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return in_array(strtolower($format), ['csv', 'ssv', 'tsv']);
    }
    private function getDelimiter(string $format): string
    {
        return match (strtolower($format)) {
            'ssv'   => ';',
            'tsv'   => "\t",
            default => ',',
        };
    }
    public function decode(string $data, string $format): array
    {
        $delimiter = $this->getDelimiter($format);
        $lines     = explode("\n", trim($data));

        if (empty($lines)) {
            return [];
        }

        $headers = str_getcsv(array_shift($lines), $delimiter, '"', '');
        $result  = [];

        foreach ($lines as $line) {
            if (trim($line) === '') {
                continue;
            }
            $row = str_getcsv($line, $delimiter, '"', '');
            if (count($headers) === count($row)) {
                $result[] = array_combine($headers, $row);
            }
        }

        return $result;
    }
    public function encode(array $data, string $format): string
    {
        if (empty($data)) {
            return '';
        }
        $delimiter = $this->getDelimiter($format);
        $lines = [];
        $lines[] = implode($delimiter, array_keys($data[0]));
        foreach ($data as $row) {
            $lines[] = implode($delimiter, array_values($row));
        }
        return implode("\n", $lines) . "\n";
    }
}