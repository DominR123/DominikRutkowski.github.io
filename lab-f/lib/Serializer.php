<?php
namespace App;
use App\Encoder\EncoderInterface;
class Serializer
{
    /** @var EncoderInterface[] */
    private array $encoders;
    public function __construct(array $encoders)
    {
        $this->encoders = $encoders;
    }
    public function convert(string $data, string $from, string $to): string
    {
        if ($from === $to) {
            return $data;
        }

        $decoded = [];
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($from)) {
                $decoded = $encoder->decode($data, $from);
                break;
            }
        }
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($to)) {
                return $encoder->encode($decoded, $to);
            }
        }
        return 'Błąd: nieobsługiwany format.';
    }
}