<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ApplicationSubmission;
use App\Models\PaymentReference;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AutoCheckPaymentReferences extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:auto-check-references';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically check and mark payment references as used when applications are submitted';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting automatic payment reference check...');
        
        // Find submissions that have payment references but haven't been marked as used
        $submissions = ApplicationSubmission::whereNotNull('payment_reference')
            ->where('payment_verified', true)
            ->whereDoesntHave('paymentReference', function($query) {
                $query->where('status', 'used');
            })
            ->with(['user', 'paymentReference'])
            ->get();

        $processedCount = 0;
        $errorCount = 0;

        foreach ($submissions as $submission) {
            try {
                DB::beginTransaction();

                // Find the payment reference
                $paymentRef = PaymentReference::where('reference', $submission->payment_reference)
                    ->where('status', 'unused')
                    ->first();

                if ($paymentRef) {
                    // Mark the reference as used
                    $paymentRef->update([
                        'status' => 'used',
                        'used_by_user_id' => $submission->user_id,
                        'used_at' => now(),
                        'notes' => 'Auto-marked as used by application submission #' . $submission->id
                    ]);

                    $this->info("Marked reference {$paymentRef->reference} as used by user {$submission->user->name} (ID: {$submission->user_id})");
                    $processedCount++;
                } else {
                    $this->warn("Payment reference {$submission->payment_reference} not found or already used for submission #{$submission->id}");
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("Error processing submission #{$submission->id}: " . $e->getMessage());
                $errorCount++;
            }
        }

        $this->info("Auto-check completed. Processed: {$processedCount}, Errors: {$errorCount}");
        
        return Command::SUCCESS;
    }
}
