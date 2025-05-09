<?php
require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Teste de conexão Redis ===\n";

// Verificar conexão do Redis
try {
    Redis::ping();
    echo "✅ Redis está conectado!\n";
} catch (\Exception $e) {
    echo "❌ Falha ao conectar ao Redis: " . $e->getMessage() . "\n";
}

echo "\n=== Teste de cache ===\n";

// Testar operações de cache
$testKey = 'test_cache_key';
$testValue = 'Teste realizado em: ' . date('Y-m-d H:i:s');

// Salvar um valor no cache
try {
    Cache::put($testKey, $testValue, 60); // Armazenar por 60 segundos
    echo "✅ Valor armazenado no cache: $testValue\n";
} catch (\Exception $e) {
    echo "❌ Falha ao armazenar valor no cache: " . $e->getMessage() . "\n";
}

// Obter o valor do cache
try {
    $retrievedValue = Cache::get($testKey);
    
    if ($retrievedValue === $testValue) {
        echo "✅ Valor recuperado do cache com sucesso: $retrievedValue\n";
    } else {
        echo "❌ Valor recuperado não corresponde: $retrievedValue\n";
    }
} catch (\Exception $e) {
    echo "❌ Falha ao obter valor do cache: " . $e->getMessage() . "\n";
}

echo "\n=== Lista de chaves no Redis ===\n";

// Listar todas as chaves atuais no Redis
try {
    $keys = Redis::keys('*');
    echo "Total de chaves encontradas: " . count($keys) . "\n";
    foreach ($keys as $index => $key) {
        echo ($index + 1) . ". $key\n";
    }
} catch (\Exception $e) {
    echo "❌ Falha ao listar chaves no Redis: " . $e->getMessage() . "\n";
}

echo "\n=== Teste de filas ===\n";

// Fazer um teste simples com filas
try {
    $dispatchedJob = \Illuminate\Support\Facades\Queue::push(function () {
        // Job simples para testar
        \Log::info('Job de teste executado: ' . date('Y-m-d H:i:s'));
        return true;
    });
    
    echo "✅ Job enviado para a fila com sucesso!\n";
    echo "Execute 'php artisan queue:work --once' para processar esse job.\n";
} catch (\Exception $e) {
    echo "❌ Falha ao enviar job para a fila: " . $e->getMessage() . "\n";
}

echo "\n=== Teste concluído ===\n"; 