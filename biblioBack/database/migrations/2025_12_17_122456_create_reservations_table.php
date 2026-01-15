<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReservationsTable extends Migration
{
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('book_id');
            $table->unsignedBigInteger('user_id');
            $table->dateTime('reserved_at')->useCurrent();
            $table->dateTime('expires_at')->nullable();
            $table->integer('position')->nullable();
            $table->enum('status', ['pending', 'notified', 'fulfilled', 'cancelled', 'expired'])->default('pending');
            $table->dateTime('notified_at')->nullable();
            $table->timestamps();

            $table->foreign('book_id')->references('id')->on('books')->onDelete('restrict');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');

            $table->index(['book_id', 'user_id']);
            $table->index('status');
            $table->index('expires_at');
        });
    }

    public function down()
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['book_id']);
            $table->dropForeign(['user_id']);
        });
        Schema::dropIfExists('reservations');
    }
}
