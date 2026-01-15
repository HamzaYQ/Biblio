<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default policy values
        DB::table('settings')->insert([
            ['key' => 'default_loan_days', 'value' => '14', 'description' => 'Nombre de jours de prêt par défaut', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'fine_per_day', 'value' => '0.50', 'description' => 'Montant de la pénalité par jour de retard (en dirham marocain)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'max_loans_per_user', 'value' => '5', 'description' => 'Nombre maximum de prêts simultanés par utilisateur', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'grace_days', 'value' => '0', 'description' => 'Nombre de jours de grâce avant application des pénalités', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
