import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {session ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-200">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {session.user?.name}! 👋
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                You're all set to start building powerful automations.
              </p>
              <a
                href="/dashboard"
                className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go to Dashboard
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session.user?.email}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
                <p className="text-gray-600 text-sm mb-1">Status</p>
                <p className="text-lg font-semibold text-green-600">Connected ✓</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <p className="text-gray-600 text-sm mb-1">Gmail Access</p>
                <p className="text-lg font-semibold text-gray-900">Enabled</p>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Create Your First Workflow</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Build an automation using the visual builder or describe it in natural language.
                  </p>
                  <a href="/dashboard/create" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Start Building →
                  </a>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Browse Templates</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Explore pre-built workflows to get inspired and save time.
                  </p>
                  <a href="/templates" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Browse Templates →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8">
            {/* Hero Section */}
            <div className="pt-10">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Build Automations Visually
              </h1>
              <p className="text-xl text-gray-600 mb-2">Or just describe them with AI</p>
              <p className="text-lg text-gray-500 mb-8">
                Connect your favorite tools and automate repetitive tasks in minutes.
              </p>
              <a
                href="/api/auth/signin"
                className="inline-flex px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Get Started Free
              </a>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Builder</h3>
                <p className="text-gray-600">
                  Drag and drop to create complex workflows without coding.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
                <p className="text-gray-600">
                  Describe what you want and AI will build it for you.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">15+ Integrations</h3>
                <p className="text-gray-600">
                  Connect with Gmail, Slack, Notion, GitHub, and more.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}