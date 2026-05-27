<?php
namespace App\Encoder;
use App\Encoder\EncoderInterface;
class YamlEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'yaml';
    }
    public function decode(string $data, string $format): array
    {
        $lines  = explode("\n", $data);
        $result = [];
        $current = null;

        foreach ($lines as $line) {
            if (preg_match('/^-\s*$/', trim($line))) {
                if ($current !== null) {
                    $result[] = $current;
                }
                $current = [];
                continue;
            }

            if (preg_match('/^-\s+(\S+):\s*(.*)$/', trim($line), $m)) {
                if ($current !== null) {
                    $result[] = $current;
                }
                $current = [];
                $current[$m[1]] = $this->parseScalar($m[2]);
                continue;
            }

            if (preg_match('/^\s{2,}(\S+):\s*(.*)$/', $line, $m) ||
                preg_match('/^(\S+):\s+(.+)$/', $line, $m)) {
                if ($current === null) {
                    $current = [];
                }
                $current[$m[1]] = $this->parseScalar($m[2]);
            }
        }

        if ($current !== null && count($current) > 0) {
            $result[] = $current;
        }
        return $result;
    }
    private function parseScalar(string $value): string
    {
        $value = trim($value);
        if (preg_match('/^["\'](.+)["\']$/', $value, $m)) {
            return $m[1];
        }
        return $value;
    }

    public function encode(array $data, string $format): string
    {
        if (empty($data)) {
            return '';
        }
        $yaml = '';
        foreach ($data as $record) {
            $yaml .= "-\n";
            foreach ($record as $key => $value) {
                $yaml .= "  {$key}: " . $this->encodeScalar($value) . "\n";
            }
        }
        return $yaml;
    }
    private function encodeScalar(mixed $value): string
    {
        if (is_string($value) && preg_match('/[:{}\[\],&*#?|<>=!%@`\']/', $value)) {
            return '"' . addslashes($value) . '"';
        }
        return (string) $value;
    }
}