<?php

use App\Controllers\BlogpostsController;
use App\Controllers\AuthController;
use App\Controllers\ChallengesController;
use App\Controllers\CommentsController;
use App\Controllers\ExamplesController;
use App\Controllers\MailsController;
use App\Controllers\TagsController;
use App\Controllers\UploadsController;
use App\Controllers\UserController;
use App\Controllers\WorkoutsController;
use Illuminate\Support\Facades\Route;
use App\Controllers\BmiController;

// guest endpoints
Route::get('/blogpost', [BlogpostsController::class, 'index']);
// Route::get('/comments', [CommentsController::class, 'index']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/tags', [TagsController::class, 'index']);
Route::get('/challenges', [ChallengesController::class, 'index']);
Route::post('/user', [UserController::class, 'create']);
Route::post('/auth/verify', [UserController::class, 'verifyEmail']);

// user endpoints
Route::middleware(['auth:sanctum'])->group(function () {
  Route::post('/auth/logout', [AuthController::class, 'logout']);

  Route::get('/user', [UserController::class, 'show']);
  Route::patch('/user', [UserController::class, 'update']);
  Route::delete('/user', [UserController::class, 'destroy']);

  // Route::post('/blogpost', [BlogpostsController::class, 'create']);
  // Route::patch('/blogpost', [BlogpostsController::class, 'update']);
  // Route::delete('/blogpost', [BlogpostsController::class, 'destroy']);

  // Route::post('/comments', [CommentsController::class, 'create']);
  // Route::patch('/comments', [CommentsController::class, 'update']);
  // Route::delete('/comments', [CommentsController::class, 'destroy']);

  // Route::post('/tags', [TagsController::class, 'create']);
  // Route::put('/tags/assign', [TagsController::class, 'assign']);


  Route::get('/user/challenges', [UserController::class, 'showChallenges']); // Eigene Challenges anzeigen

  // Challenge management
  Route::post('/challenges', [ChallengesController::class, 'create']); // Neue Challenge erstellen
  Route::patch('/challenges/{id}', [ChallengesController::class, 'updateChallenge']); // Challenge aktualisieren
  Route::delete('/challenges/{id}', [ChallengesController::class, 'destroy']); // Challenge löschen




  Route::delete('/uploads', [UploadsController::class, 'destroy']);

  Route::post('/mails/send', [MailsController::class, 'send']);


  Route::get('/workouts', [WorkoutsController::class, 'index']);
  Route::post('/workouts', [WorkoutsController::class, 'create']);
  Route::patch('/workouts', [WorkoutsController::class, 'update']);
  Route::delete('/workouts', [WorkoutsController::class, 'destroy']);

  Route::get('/bmi', [BmiController::class, 'index']);
  Route::patch('/bmi', [BmiController::class, 'update']);
  Route::delete('/bmi', [BmiController::class, 'destroy']);
});

// example endpoints
// Route::get('/examples/ping', [ExamplesController::class, 'ping']);
// Route::get('/examples/about', [ExamplesController::class, 'about']);
// Route::post('/examples/echo', [ExamplesController::class, 'echo']);
// Route::post('/examples/reverse', [ExamplesController::class, 'reverse']);
// Route::post('/examples/sum', [ExamplesController::class, 'sum']);
// Route::post('/examples/count', [ExamplesController::class, 'count']);
// Route::post('/examples/temperature', [ExamplesController::class, 'temperature']);
// Route::post('/examples/bmi', [ExamplesController::class, 'bmi']);
