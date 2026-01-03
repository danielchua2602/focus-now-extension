import { useState } from "react";

interface WebsiteListProps {
  websites: string[];
  onAddWebsite: (website: string) => void;
  onRemoveWebsite: (website: string) => void;
}

export default function WebsiteList({ websites, onAddWebsite, onRemoveWebsite }: WebsiteListProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAddWebsite(input.trim());
      setInput("");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
      <h2 className="text-base font-semibold mb-3 text-gray-700">Blocked Websites</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="example.com"
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 active:bg-blue-800"
        >
          Add
        </button>
      </form>
      <ul className="list-none max-h-[150px] overflow-y-auto">
        {websites.length === 0 ? (
          <div className="text-center text-gray-400 py-5 text-sm">No websites blocked yet</div>
        ) : (
          websites.map((website) => (
            <li key={website} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded mb-1.5 text-sm">
              <span>{website}</span>
              <button
                className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                onClick={() => onRemoveWebsite(website)}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
