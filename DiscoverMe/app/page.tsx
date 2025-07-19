import ActivityLauncher from '@/components/ActivityLauncher';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NeuroBloom
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover Your Superpowers
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/caregiver" 
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Caregiver Access
            </a>
          </div>
        </div>
        <ActivityLauncher />
      </div>
    </main>
  );
} 