export default function SuggestedSectionCard({ section, onAdd }: any) {
  return (
    <div className="flex justify-between p-3 border mb-2 rounded">
      <div>
        <p className="font-medium">{section.label}</p>
        <p className="text-xs text-gray-500">Suggested</p>
      </div>

      <button
        className="px-3 py-1 bg-green-600 text-white rounded"
        onClick={onAdd}
      >
        Add
      </button>
    </div>
  );
}
