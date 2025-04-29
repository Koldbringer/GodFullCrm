import { notFound } from 'next/navigation';

export default async function Page(props: {
  params: { slug?: string[] };
}) {
  const { slug } = props.params;
  
  // Simple placeholder for documentation
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Documentation</h1>
      <p className="mb-6">Documentation will be available soon.</p>
      
      {slug && slug.length > 0 && (
        <div className="p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Current Path</h2>
          <p className="font-mono">/docs/{slug.join('/')}</p>
        </div>
      )}
    </div>
  );
}

export function generateMetadata(props: {
  params: { slug?: string[] };
}) {
  return {
    title: 'Documentation',
    description: 'GodFullCrm documentation',
  };
}
