import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="font-display text-3xl font-bold mb-6">Legal</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/terms" className="text-brand hover:underline">Terms of Service</Link>
        </li>
        <li>
          <Link to="/privacy" className="text-brand hover:underline">Privacy Policy</Link>
        </li>
      </ul>
    </div>
  );
}
