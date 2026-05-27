<?php
namespace App\Encoder;
use App\Encoder\EncoderInterface;
class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'json';
    }
    public function decode(string $data, string $format): array
    {
        return json_decode($data, true) ?? [];
    }
    public function encode(array $data, string $format): string
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}