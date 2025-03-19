export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to ninexGo X Analytics</h1>
      <p className="text-gray-600 mb-6">Free insights for non-premium X users. Get started now!</p>
      <a href="/dashboard" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Dashboard
      </a>
    </div>
  );
}