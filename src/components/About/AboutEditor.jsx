import EditModal from '../AdminBar/EditModal';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';

const ABOUT_FIELDS = [
  {
    key: 'about_label',
    label: 'Section Label',
    type: 'text'
  },
  {
    key: 'about_headline',
    label: 'Headline',
    type: 'text'
  },
  {
    key: 'about_paragraph_1',
    label: 'Paragraph 1',
    type: 'textarea'
  },
  {
    key: 'about_paragraph_2',
    label: 'Paragraph 2',
    type: 'textarea'
  },
  {
    key: 'about_paragraph_3',
    label: 'Paragraph 3',
    type: 'textarea'
  }
];

export default function AboutEditor({ onClose }) {

  const {
    settings,
    updateSettings
  } = useSiteSettingsContext();

  const handleSave = async (values) => {

    console.log("Saving About...", values);

    const error = await updateSettings(values);

    if (error) {
        console.error(error);
        alert("Failed to save.");
        return;
    }

    alert("About section updated successfully!");

    onClose();
    };

  return (
    <EditModal
      title="Edit About Section"
      fields={ABOUT_FIELDS}
      initialValues={settings}
      onSave={handleSave}
      onClose={onClose}
    />
  );

}