<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Public email verification link (redirects to frontend with status)
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmailWeb'])->name('verify.email');

// Serve passport photos
Route::get('/storage/passport_photos/{filename}', function ($filename) {
    $path = storage_path('app/public/passport_photos/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path);
})->name('passport.photo');
