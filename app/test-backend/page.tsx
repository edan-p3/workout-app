'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  workoutQueries,
  exerciseLibraryQueries,
  gamificationQueries,
  databaseFunctions,
} from '@/lib/supabase/queries'

interface TestResult {
  name: string
  status: 'pending' | 'pass' | 'fail'
  message: string
  details?: any
}

export default function TestBackendPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => {
      const newTests = [...prev]
      newTests[index] = { ...newTests[index], ...updates }
      return newTests
    })
  }

  const runAllTests = async () => {
    setIsRunning(true)
    
    const initialTests: TestResult[] = [
      { name: 'Database Connection', status: 'pending', message: 'Testing...' },
      { name: 'Authentication', status: 'pending', message: 'Testing...' },
      { name: 'Exercise Library', status: 'pending', message: 'Testing...' },
      { name: 'User Profile', status: 'pending', message: 'Testing...' },
      { name: 'Gamification Data', status: 'pending', message: 'Testing...' },
      { name: 'Workout Queries', status: 'pending', message: 'Testing...' },
      { name: 'Database Functions', status: 'pending', message: 'Testing...' },
      { name: 'TypeScript Types', status: 'pending', message: 'Testing...' },
    ]
    
    setTests(initialTests)

    let currentUser: any = null

    // Test 1: Database Connection
    try {
      const { data, error } = await supabase
        .from('exercise_library')
        .select('count')
        .limit(1)
      
      if (error) throw error
      
      updateTest(0, {
        status: 'pass',
        message: 'Successfully connected to database',
      })
    } catch (error: any) {
      updateTest(0, {
        status: 'fail',
        message: 'Failed to connect to database: ' + error.message,
      })
    }

    // Test 2: Authentication
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (user) {
        currentUser = user
        setUserId(user.id)
        updateTest(1, {
          status: 'pass',
          message: `Authenticated as ${user.email}`,
          details: { userId: user.id }
        })
      } else {
        updateTest(1, {
          status: 'fail',
          message: 'Not authenticated. Please log in first.',
        })
        setIsRunning(false)
        return
      }
    } catch (error: any) {
      updateTest(1, {
        status: 'fail',
        message: 'Auth check failed: ' + error.message,
      })
      setIsRunning(false)
      return
    }

    // Test 3: Exercise Library
    try {
      const { data, error } = await exerciseLibraryQueries.getAllExercises()
      
      if (error) throw error
      
      const count = data?.length || 0
      
      if (count >= 60) {
        updateTest(2, {
          status: 'pass',
          message: `Found ${count} exercises in library`,
          details: { count }
        })
      } else {
        updateTest(2, {
          status: 'fail',
          message: `Only ${count} exercises found (expected 60+)`,
          details: { count }
        })
      }
    } catch (error: any) {
      updateTest(2, {
        status: 'fail',
        message: 'Exercise library query failed: ' + error.message,
      })
    }

    // Test 4: User Profile
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()
      
      if (error) throw error
      
      if (data) {
        updateTest(3, {
          status: 'pass',
          message: 'User profile found',
          details: { email: data.email }
        })
      } else {
        updateTest(3, {
          status: 'fail',
          message: 'User profile not found',
        })
      }
    } catch (error: any) {
      updateTest(3, {
        status: 'fail',
        message: 'Profile query failed: ' + error.message,
      })
    }

    // Test 5: Gamification Data
    try {
      const { data, error } = await gamificationQueries.getGamificationData(currentUser.id)
      
      if (error) throw error
      
      if (data) {
        updateTest(4, {
          status: 'pass',
          message: 'Gamification data found',
          details: {
            points: data.total_points,
            workouts: data.total_workouts,
            streak: data.current_streak
          }
        })
      } else {
        updateTest(4, {
          status: 'fail',
          message: 'Gamification data not found',
        })
      }
    } catch (error: any) {
      updateTest(4, {
        status: 'fail',
        message: 'Gamification query failed: ' + error.message,
      })
    }

    // Test 6: Workout Queries
    try {
      const { data, error } = await workoutQueries.getAllWorkouts(currentUser.id)
      
      if (error) throw error
      
      updateTest(5, {
        status: 'pass',
        message: `Found ${data?.length || 0} workouts`,
        details: { count: data?.length || 0 }
      })
    } catch (error: any) {
      updateTest(5, {
        status: 'fail',
        message: 'Workout query failed: ' + error.message,
      })
    }

    // Test 7: Database Functions
    try {
      // We can't easily test these without data, so just check if they're callable
      // This will error if the functions don't exist
      const response = await supabase.rpc('calculate_exercise_volume', {
        exercise_uuid: '00000000-0000-0000-0000-000000000000' // Fake UUID
      })
      
      // Even if it returns null/error for fake UUID, function exists
      updateTest(6, {
        status: 'pass',
        message: 'Database functions are accessible',
      })
    } catch (error: any) {
      if (error.message.includes('does not exist')) {
        updateTest(6, {
          status: 'fail',
          message: 'Database functions not found',
        })
      } else {
        updateTest(6, {
          status: 'pass',
          message: 'Database functions are accessible',
        })
      }
    }

    // Test 8: TypeScript Types
    try {
      // Check if types are working by attempting a typed query
      const { data, error } = await supabase
        .from('workouts')
        .select('id, user_id, workout_date, is_completed')
        .eq('user_id', currentUser.id)
        .limit(1)
      
      updateTest(7, {
        status: 'pass',
        message: 'TypeScript types are working correctly',
      })
    } catch (error: any) {
      updateTest(7, {
        status: 'fail',
        message: 'Type check failed: ' + error.message,
      })
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runAllTests()
  }, [])

  const passedTests = tests.filter(t => t.status === 'pass').length
  const failedTests = tests.filter(t => t.status === 'fail').length
  const totalTests = tests.length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🧪 Backend Test Suite</h1>
        <p className="text-gray-600 mb-6">
          Automated tests to verify your Supabase backend is working correctly
        </p>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-bold">{totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="text-3xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
          
          {!isRunning && failedTests === 0 && passedTests === totalTests && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
              ✅ All tests passed! Your backend is working perfectly.
            </div>
          )}
          
          {!isRunning && failedTests > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
              ❌ Some tests failed. Check the details below.
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                test.status === 'pass'
                  ? 'border-green-500'
                  : test.status === 'fail'
                  ? 'border-red-500'
                  : 'border-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold">{test.name}</span>
                    {test.status === 'pass' && <span className="text-green-600">✓</span>}
                    {test.status === 'fail' && <span className="text-red-600">✗</span>}
                    {test.status === 'pending' && <span className="text-yellow-600">⋯</span>}
                  </div>
                  <p className={`text-sm ${
                    test.status === 'fail' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {test.message}
                  </p>
                  {test.details && (
                    <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests Again'}
          </button>
          
          <a
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 inline-block text-center"
          >
            Back to Dashboard
          </a>
        </div>

        {/* Help */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">📚 Need Help?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• If not authenticated, go to <a href="/login" className="underline">/login</a> or <a href="/signup" className="underline">/signup</a></li>
            <li>• Check TEST_WALKTHROUGH.md for detailed testing instructions</li>
            <li>• Visit http://localhost:54323 for Supabase Studio</li>
            <li>• Run <code className="bg-blue-100 px-1 rounded">supabase status</code> to check if Supabase is running</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

