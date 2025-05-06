<?php

namespace App\Http\Controllers;

use App\Models\TipoAlarme;
use Illuminate\Http\Request;

class TipoAlarmeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(TipoAlarme::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|unique:tipo_alarmes'
        ]);

        $tipo = TipoAlarme::create($data);
        return response()->json($tipo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tipoAlarme = TipoAlarme::findOrFail($id);
        return response()->json($tipoAlarme);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tipoAlarme = TipoAlarme::findOrFail($id);
        
        $data = $request->validate([
            'nome' => 'required|string|unique:tipo_alarmes,nome,' . $id,
        ]);
        
        $tipoAlarme->update($data);
        return response()->json($tipoAlarme);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tipoAlarme = TipoAlarme::findOrFail($id);
        $tipoAlarme->delete();
        
        return response()->json(null, 204);
    }
}
