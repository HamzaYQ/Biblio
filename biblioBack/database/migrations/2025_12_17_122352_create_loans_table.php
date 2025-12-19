<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('book_copy_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('issued_by')->nullable();
            // Utiliser dateTime évite les problèmes de default value sur MySQL
            $table->dateTime('loaned_at');
            $table->dateTime('due_at');
            $table->dateTime('returned_at')->nullable();
            $table->enum('status', ['ongoing', 'returned', 'overdue', 'lost'])->default('ongoing');
            $table->timestamps();

            $table->index('status');
            $table->index('user_id');
            $table->index('due_at');
            $table->index(['status', 'due_at']);

            // clés étrangères (adapte les noms des tables si nécessaire)
            $table->foreign('book_copy_id')->references('id')->on('book_copies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('issued_by')->references('id')->on('staff')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loans');
    }
}
