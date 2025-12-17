<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookCopiesTable extends Migration
{
    public function up()
    {
        Schema::create('book_copies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('book_id');
            $table->string('barcode')->unique();
            $table->date('acquisition_date')->nullable();
            $table->enum('status', ['available', 'loaned', 'reserved', 'lost', 'damaged', 'maintenance'])->default('available');
            $table->string('location')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['book_id', 'status']);

            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('book_copies', function (Blueprint $table) {
            $table->dropForeign(['book_id']);
        });
        Schema::dropIfExists('book_copies');
    }
}
