import { useState } from "react";
import { useStory } from "../../hooks/useStory";
import EditModal from "../AdminBar/EditModal";
import "./StoryManager.css";

const STORY_FIELDS = [
  {
    key: "year",
    label: "Year",
    type: "text",
  },
  {
    key: "title",
    label: "Title",
    type: "text",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
  },
  {
    key: "display_order",
    label: "Display Order",
    type: "number",
  },
];

const EMPTY_STORY = {
  year: "",
  title: "",
  description: "",
  display_order: 1,
};

export default function StoryManager() {
  const {
    story,
    addStory,
    updateStory,
    deleteStory,
  } = useStory();
  console.log("StoryManager story:", story);

  const [editingStory, setEditingStory] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleSave = async (values) => {
    if (adding) {
      const error = await addStory(values);

      if (error) {
        return {
          error: error.message,
        };
      }

      return {};
    }

    const error = await updateStory(
      editingStory.id,
      values
    );

    if (error) {
      return {
        error: error.message,
      };
    }

    return {};
  };

  const handleDelete =
    editingStory && !adding
      ? async () => {
          const error = await deleteStory(
            editingStory.id
          );

          if (error) {
            return {
              error: error.message,
            };
          }

          return {};
        }
      : undefined;

  return (
    <div className="story-manager">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <h2>Manage Story</h2>

        <button
          className="admin-add-btn"
          onClick={() => {
            setAdding(true);
            setEditingStory(EMPTY_STORY);
          }}
        >
          + Add Story
        </button>
      </div>

      <table className="story-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Title</th>
            <th>Order</th>
            <th style={{ width: 180 }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {story.map((item) => (
            <tr key={item.id}>
              <td>{item.year}</td>

              <td>{item.title}</td>

              <td>{item.display_order}</td>

              <td>

                <button
                  className="story-edit"
                  onClick={() => {
                    setAdding(false);
                    setEditingStory(item);
                  }}
                >
                  Edit
                </button>

                <button
                  className="story-delete"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        "Delete this story?"
                      )
                    )
                      return;

                    const error =
                      await deleteStory(item.id);

                    if (error) {
                      alert(error.message);
                    }
                  }}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingStory && (
        <EditModal
          title={
            adding
              ? "Add Story"
              : "Edit Story"
          }
          fields={STORY_FIELDS}
          initialValues={editingStory}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => {
            setEditingStory(null);
            setAdding(false);
          }}
        />
      )}

    </div>
  );
}