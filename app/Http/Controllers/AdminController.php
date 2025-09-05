<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApplicationSubmission;
use App\Models\PaymentReference;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get payment revenue statistics
     */
    public function getPaymentStats()
    {
        try {
            // Get total verified payments (submissions with payment_verified = true)
            $totalVerifiedPayments = ApplicationSubmission::where('payment_verified', true)->count();
            
            // Get total revenue (assuming each verified payment is worth a fixed amount)
            // You can adjust this based on your fee structure
            $feePerApplication = 50000; // 50,000 MWK per application
            $totalRevenue = $totalVerifiedPayments * $feePerApplication;
            
            // Get monthly revenue breakdown
            $monthlyRevenue = ApplicationSubmission::where('payment_verified', true)
                ->selectRaw('YEAR(submitted_at) as year, MONTH(submitted_at) as month, COUNT(*) as count')
                ->groupBy('year', 'month')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get()
                ->mapWithKeys(function ($item) use ($feePerApplication) {
                    $key = $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT);
                    return [$key => $item->count * $feePerApplication];
                });

            // Get payment status breakdown
            $statusBreakdown = [
                'verified' => ApplicationSubmission::where('payment_verified', true)->count(),
                'unverified' => ApplicationSubmission::where('payment_verified', false)->count(),
                'total_submissions' => ApplicationSubmission::count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'total_payments' => $totalVerifiedPayments,
                    'total_amount' => $totalRevenue,
                    'pending_payments' => 0, // No pending payments in this system
                    'completed_payments' => $totalVerifiedPayments,
                    'failed_payments' => 0,
                    'refunded_payments' => 0,
                    'monthly_revenue' => $monthlyRevenue,
                    'status_breakdown' => $statusBreakdown,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load payment statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users with verified payment references
     */
    public function getVerifiedUsers(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 15);
            $search = $request->get('search', '');

            $query = ApplicationSubmission::where('payment_verified', true)
                ->with(['user', 'paymentReference'])
                ->orderBy('submitted_at', 'desc');

            if ($search) {
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $submissions = $query->paginate($perPage, ['*'], 'page', $page);

            $data = $submissions->map(function ($submission) {
                return [
                    'id' => $submission->id,
                    'application_id' => $submission->application_id,
                    'user' => [
                        'id' => $submission->user->id,
                        'name' => $submission->user->name,
                        'email' => $submission->user->email,
                    ],
                    'payment_reference' => $submission->payment_reference,
                    'payment_verified' => $submission->payment_verified,
                    'submitted_at' => $submission->submitted_at,
                    'status' => $submission->status,
                    'application_type' => $submission->application_type,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $data,
                    'current_page' => $submissions->currentPage(),
                    'last_page' => $submissions->lastPage(),
                    'per_page' => $submissions->perPage(),
                    'total' => $submissions->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load verified users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment reference statistics
     */
    public function getPaymentReferenceStats()
    {
        try {
            $stats = [
                'total_references' => PaymentReference::count(),
                'unused_references' => PaymentReference::where('status', 'unused')->count(),
                'used_references' => PaymentReference::where('status', 'used')->count(),
                'flagged_references' => PaymentReference::where('status', 'flagged')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load payment reference statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get verified applications for review
     */
    public function getVerifiedApplications(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search', '');
            $status = $request->get('status', '');
            $type = $request->get('type', '');

            $query = ApplicationSubmission::where('payment_verified', true)
                ->with(['user', 'workExperiences', 'referees'])
                ->orderBy('submitted_at', 'desc');

            // Search functionality
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('application_id', 'like', "%{$search}%")
                      ->orWhere('first_name', 'like', "%{$search}%")
                      ->orWhere('surname', 'like', "%{$search}%")
                      ->orWhere('email_address', 'like', "%{$search}%")
                      ->orWhereHas('user', function($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            }

            // Status filter
            if ($status) {
                $query->where('status', $status);
            }

            // Type filter
            if ($type) {
                $query->where('application_type', $type);
            }

            $submissions = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $submissions->items(),
                    'current_page' => $submissions->currentPage(),
                    'last_page' => $submissions->lastPage(),
                    'per_page' => $submissions->perPage(),
                    'total' => $submissions->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load verified applications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update application status (accept/reject)
     */
    public function updateApplicationStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:accepted,rejected',
                'comments' => 'nullable|string|max:1000',
            ]);

            $submission = ApplicationSubmission::findOrFail($id);

            if (!$submission->payment_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot review application that is not payment verified',
                ], 400);
            }

            $submission->update([
                'status' => $request->status,
                'review_comments' => $request->comments,
                'decision_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Application status updated successfully',
                'data' => $submission,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update application status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
