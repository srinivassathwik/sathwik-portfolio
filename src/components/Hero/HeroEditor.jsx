import EditModal from '../AdminBar/EditModal';
import { useState } from 'react';
import { uploadResume } from '../../hooks/useResumeUpload';
import { useSiteSettingsContext } from '../../context/SiteSettingsContext';

const HERO_FIELDS = [
  {
    key: 'hero_first_name',
    label: 'First Name',
    type: 'text',
  },
  {
    key: 'hero_middle_name',
    label: 'Middle Name',
    type: 'text',
  },
  {
    key: 'hero_last_name',
    label: 'Last Name',
    type: 'text',
  },
  {
    key: 'hero_animation_1',
    label: 'Animation 1',
    type: 'text',
  },
  {
    key: 'hero_animation_2',
    label: 'Animation 2',
    type: 'text',
  },
  {
    key: 'hero_animation_3',
    label: 'Animation 3',
    type: 'text',
  },
  {
    key: 'hero_animation_4',
    label: 'Animation 4',
    type: 'text',
  },
  {
    key: 'hero_animation_5',
    label: 'Animation 5',
    type: 'text',
  },
  {
    key: 'hero_description',
    label: 'Description',
    type: 'textarea',
  },
  {
    key: 'hero_experience',
    label: 'Experience',
    type: 'text',
  },
  {
    key: 'hero_projects',
    label: 'Projects',
    type: 'text',
  },
  {
    key: 'hero_availability',
    label: 'Availability',
    type: 'text',
  }
];

export default function HeroEditor({ onClose }) {

  const {
    settings,
    updateSettings,
  } = useSiteSettingsContext();
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleSave = async (values) => {

    try {

        setUploading(true);

        if (resumeFile) {
        await uploadResume(resumeFile);
        }

        const error = await updateSettings(values);

        if (error) {
        alert("Failed to save Hero.");
        return;
        }

        alert("Hero updated successfully!");

        onClose();

    } catch (err) {

        alert(err.message);

    } finally {

        setUploading(false);

    }

    };



  return (
    <EditModal
      title="Edit Hero"
      fields={HERO_FIELDS}
      initialValues={settings}
      onSave={handleSave}
      onClose={onClose}
    />
  );
}