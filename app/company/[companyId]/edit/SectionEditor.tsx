"use client";

export default function SectionEditor({
  section,
  templateFields,
  formData,
  updateField,
  onSave,
}: any) {
  if (!templateFields) return <div>No fields defined for this template.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Editing: {section.section_id}
      </h2>

      <div className="space-y-6">
        {templateFields.map((field: any) => {
          const value = formData[field.field_key] || "";

          switch (field.field_type) {
            case "text":
              return (
                <div key={field.field_key}>
                  <label className="font-semibold">{field.label}</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={value}
                    onChange={(e) => updateField(field.field_key, e.target.value)}
                  />
                </div>
              );

            case "textarea":
              return (
                <div key={field.field_key}>
                  <label className="font-semibold">{field.label}</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={5}
                    value={value}
                    onChange={(e) => updateField(field.field_key, e.target.value)}
                  />
                </div>
              );

            case "image":
              return (
                <div key={field.field_key}>
                  <label className="font-semibold">{field.label}</label>
                  <input
                    type="text"
                    placeholder="Image URL"
                    className="w-full border p-2 rounded"
                    value={value}
                    onChange={(e) => updateField(field.field_key, e.target.value)}
                  />
                </div>
              );

            case "video":
              return (
                <div key={field.field_key}>
                  <label className="font-semibold">{field.label}</label>
                  <input
                    type="text"
                    placeholder="Video URL"
                    className="w-full border p-2 rounded"
                    value={value}
                    onChange={(e) => updateField(field.field_key, e.target.value)}
                  />
                </div>
              );

            case "array":
              return (
                <div key={field.field_key}>
                  <label className="font-semibold">{field.label}</label>

                  {Array.isArray(value) &&
                    value.map((item: any, i: number) => (
                      <div key={i} className="border p-3 rounded mt-2">
                        {Object.keys(item).map((key) => (
                          <input
                            key={key}
                            className="w-full border p-2 rounded mb-2"
                            value={item[key]}
                            onChange={(e) => {
                              const newArr = [...value];
                              newArr[i][key] = e.target.value;
                              updateField(field.field_key, newArr);
                            }}
                          />
                        ))}
                      </div>
                    ))}
                </div>
              );

            default:
              return <p>Unknown field type: {field.field_type}</p>;
          }
        })}
      </div>

      <button
        onClick={onSave}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
