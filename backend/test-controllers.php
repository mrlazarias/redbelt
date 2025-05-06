<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\AlarmeController;
use App\Http\Controllers\TipoAlarmeController;
use Illuminate\Http\Request;

echo "=== Testando os Controladores com Redis Cache ===\n\n";

// Limpar todos os caches para começar o teste
echo "Limpando cache...\n";
Cache::flush();
Redis::flushall();
echo "Cache limpo com sucesso!\n\n";

// Criar uma request mock
$request = Request::create('/api/alarmes', 'GET');

// Testar AlarmeController
echo "Testando AlarmeController::index()\n";
echo "Primeira chamada (deve buscar do banco)...\n";
$alarmeController = new AlarmeController();
$startTime = microtime(true);
$result1 = $alarmeController->index($request);
$endTime = microtime(true);
$firstCallTime = $endTime - $startTime;
echo "Tempo de execução: " . round($firstCallTime * 1000, 2) . " ms\n";

echo "Segunda chamada (deve buscar do cache)...\n";
$startTime = microtime(true);
$result2 = $alarmeController->index($request);
$endTime = microtime(true);
$secondCallTime = $endTime - $startTime;
echo "Tempo de execução: " . round($secondCallTime * 1000, 2) . " ms\n";

if ($secondCallTime < $firstCallTime) {
    echo "✅ Segunda chamada foi mais rápida, indicando que o cache está funcionando!\n";
} else {
    echo "❌ Segunda chamada não foi mais rápida. O cache pode não estar funcionando corretamente.\n";
}

// Testar TipoAlarmeController
echo "\nTestando TipoAlarmeController::index()\n";
echo "Primeira chamada (deve buscar do banco)...\n";
$tipoAlarmeController = new TipoAlarmeController();
$startTime = microtime(true);
$result1 = $tipoAlarmeController->index();
$endTime = microtime(true);
$firstCallTime = $endTime - $startTime;
echo "Tempo de execução: " . round($firstCallTime * 1000, 2) . " ms\n";

echo "Segunda chamada (deve buscar do cache)...\n";
$startTime = microtime(true);
$result2 = $tipoAlarmeController->index();
$endTime = microtime(true);
$secondCallTime = $endTime - $startTime;
echo "Tempo de execução: " . round($secondCallTime * 1000, 2) . " ms\n";

if ($secondCallTime < $firstCallTime) {
    echo "✅ Segunda chamada foi mais rápida, indicando que o cache está funcionando!\n";
} else {
    echo "❌ Segunda chamada não foi mais rápida. O cache pode não estar funcionando corretamente.\n";
}

// Verificar as chaves armazenadas no Redis após os testes
echo "\nChaves Redis após os testes:\n";
$keys = Redis::keys('*');
if (empty($keys)) {
    echo "Nenhuma chave encontrada no Redis.\n";
} else {
    foreach ($keys as $key) {
        echo "- $key\n";
    }
}

echo "\n=== Teste concluído ===\n"; 