<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentReference extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'status',
        'used_by_user_id',
        'used_at',
        'notes',
    ];

    protected $casts = [
        'used_at' => 'datetime',
    ];
}


