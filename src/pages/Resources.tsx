import { Link } from "react-router-dom";

export default function Resources() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="font-display text-3xl font-bold mb-6">Resources</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/docs" className="text-brand hover:underline">Getting Started</Link>
        </li>
        <li>
          <Link to="/docs#api" className="text-brand hover:underline">API Reference</Link>
        </li>
        <li>
          <Link to="/docs#faq" className="text-brand hover:underline">FAQ</Link>
        </li>
      </ul>
    </div>
  );
}
