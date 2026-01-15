<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFinesTable extends Migration
{
    public function up()
    {
        Schema::create('fines', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('loan_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->text('reason')->nullable();
            $table->unsignedBigInteger('issued_by')->nullable();
            $table->dateTime('issued_at')->useCurrent();
            $table->boolean('paid')->default(false);
            $table->dateTime('paid_at')->nullable();
            $table->enum('payment_method', ['cash', 'card', 'online', 'other'])->nullable();
            $table->string('payment_reference')->nullable();
            $table->unsignedBigInteger('handled_by')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'paid']);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('loan_id')->references('id')->on('loans')->onDelete('set null');
            $table->foreign('issued_by')->references('id')->on('staff')->onDelete('set null');
            $table->foreign('handled_by')->references('id')->on('staff')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('fines', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['loan_id']);
            $table->dropForeign(['issued_by']);
            $table->dropForeign(['handled_by']);
        });
        Schema::dropIfExists('fines');
    }
}
