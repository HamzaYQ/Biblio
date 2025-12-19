<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->string('isbn', 13)->unique()->nullable();
            $table->unsignedBigInteger('publisher_id')->nullable();
            $table->smallInteger('published_year')->nullable();
            $table->integer('pages')->nullable();
            $table->string('language')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_url')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('title');

            $table->foreign('publisher_id')->references('id')->on('publishers')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropForeign(['publisher_id']);
        });
        Schema::dropIfExists('books');
    }
}
