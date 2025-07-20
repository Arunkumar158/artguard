// Debug utility for API connection issues

export interface DebugInfo {
  apiUrl: string;
  backendHealth: boolean;
  environment: string;
  timestamp: string;
  userAgent: string;
}

/**
 * Get debug information for troubleshooting API issues
 */
export async function getDebugInfo(): Promise<DebugInfo> {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const healthUrl = `${apiUrl}/health/`;
  
  let backendHealth = false;
  
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    backendHealth = response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
  }

  return {
    apiUrl,
    backendHealth,
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
}

/**
 * Log debug information to console
 */
export function logDebugInfo(info: DebugInfo): void {
  console.group('🔍 Debug Information');
  console.log('🌐 API URL:', info.apiUrl);
  console.log('🏥 Backend Health:', info.backendHealth ? '✅ Healthy' : '❌ Unhealthy');
  console.log('🔧 Environment:', info.environment);
  console.log('⏰ Timestamp:', info.timestamp);
  console.log('🌍 User Agent:', info.userAgent);
  console.groupEnd();
}

/**
 * Test API connectivity and provide troubleshooting suggestions
 */
export async function testApiConnectivity(): Promise<{
  success: boolean;
  issues: string[];
  suggestions: string[];
}> {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  const healthUrl = `${apiUrl}/health/`;
  
  // Test 1: Check if the URL is valid
  try {
    new URL(healthUrl);
  } catch (error) {
    issues.push('Invalid API URL format');
    suggestions.push('Check VITE_API_BASE_URL environment variable');
  }
  
  // Test 2: Try to fetch the health endpoint
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      issues.push(`Backend responded with status ${response.status}`);
      suggestions.push('Check if Django server is running and accessible');
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      issues.push('Network error - cannot reach the backend');
      suggestions.push('1. Ensure Django server is running on http://localhost:8000');
      suggestions.push('2. Check if there are any CORS issues');
      suggestions.push('3. Verify the API URL is correct');
    } else {
      issues.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Test 3: Check environment variables
  if (!import.meta.env.VITE_API_BASE_URL) {
    issues.push('VITE_API_BASE_URL not set');
    suggestions.push('Set VITE_API_BASE_URL in your .env file');
  }
  
  return {
    success: issues.length === 0,
    issues,
    suggestions,
  };
}

/**
 * Display troubleshooting information in the console
 */
export async function displayTroubleshootingInfo(): Promise<void> {
  console.group('🔧 API Connectivity Troubleshooting');
  
  const debugInfo = await getDebugInfo();
  logDebugInfo(debugInfo);
  
  const connectivity = await testApiConnectivity();
  
  if (connectivity.success) {
    console.log('✅ All connectivity tests passed!');
  } else {
    console.log('❌ Issues detected:');
    connectivity.issues.forEach(issue => console.log(`  - ${issue}`));
    
    console.log('💡 Suggestions:');
    connectivity.suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
  }
  
  console.groupEnd();
} 