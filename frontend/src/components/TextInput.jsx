export default function TextInput({ value, onChange }) {
  return (
    <div className="flex flex-col h-full">
      <label className="text-sm font-semibold text-gray-600 mb-1">
        Input Text
      </label>
      <textarea
        className="flex-1 w-full p-3 border border-gray-300 rounded-lg resize-none
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono text-sm
                   bg-white text-gray-900"
        placeholder="Paste or type your text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
