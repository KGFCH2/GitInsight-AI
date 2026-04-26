import { Link } from "react-router-dom";

export default function Product() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="font-display text-3xl font-bold mb-6">Product</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/analyze" className="text-brand hover:underline">Analyze</Link>
        </li>
        <li>
          <Link to="/history" className="text-brand hover:underline">History</Link>
        </li>
        <li>
          <Link to="/docs" className="text-brand hover:underline">Documentation</Link>
        </li>
        <li>
          <Link to="/docs#faq" className="text-brand hover:underline">FAQs</Link>
        </li>
      </ul>
    </div>
  );
}
