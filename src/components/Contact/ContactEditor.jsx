import EditModal from "../AdminBar/EditModal";
import { useSiteSettingsContext } from "../../context/SiteSettingsContext";

const CONTACT_FIELDS = [
  {
    key: "contact_email",
    label: "Email",
    type: "text",
  },
  {
    key: "contact_whatsapp_number",
    label: "WhatsApp Number",
    type: "text",
  },
  {
    key: "contact_location",
    label: "Location",
    type: "text",
  },
  {
    key: "contact_availability",
    label: "Availability",
    type: "text",
  },
  {
    key: "contact_response_time",
    label: "Response Time",
    type: "text",
  },
];

export default function ContactEditor({ onClose }) {

  const {
    settings,
    updateSettings,
  } = useSiteSettingsContext();

  const handleSave = async (values) => {

    const error = await updateSettings(values);

    if (error) {
      alert("Failed to save Contact.");
      return;
    }

    alert("Contact updated successfully!");

    onClose();
  };

  return (
    <EditModal
      title="Edit Contact"
      fields={CONTACT_FIELDS}
      initialValues={settings}
      onSave={handleSave}
      onClose={onClose}
    />
  );
}