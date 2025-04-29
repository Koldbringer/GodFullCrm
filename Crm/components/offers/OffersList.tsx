import React from "react";
import fs from "fs";
import path from "path";

// Helper to read offers from kombajn/content/docs
function getOffersList() {
  const docsDir = path.resolve(__dirname, "../../../kombajn/content/docs");
  const files = fs.readdirSync(docsDir);
  return files.filter(f => f.endsWith(".mdx") && f.startsWith("oferta"));
}

export default function OffersList() {
  const offers = getOffersList();
  return (
    <div className="bg-white dark:bg-neutral-900 rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">Lista wygenerowanych ofert</h2>
      <ul className="list-disc pl-6">
        {offers.map(file => (
          <li key={file}>
            <a
              className="text-blue-700 hover:underline dark:text-blue-300"
              href={`/docs/${file.replace(/\\.mdx$/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.replace(/_/g, ' ')}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
