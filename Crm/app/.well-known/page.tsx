// Simple placeholder page for .well-known directory
export default function WellKnownPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Well-Known Directory</h1>
      <p>This directory contains standard files for various services.</p>
      <ul className="list-disc ml-6 mt-4">
        <li>
          <a href="/.well-known/microsoft-identity-association" className="text-blue-600 hover:underline">
            Microsoft Identity Association
          </a>
        </li>
      </ul>
    </div>
  );
}