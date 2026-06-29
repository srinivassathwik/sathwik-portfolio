import { useState } from "react";
import { useSiteSettingsContext } from "../../context/SiteSettingsContext";
import "./WhatsAppModal.css";

export default function WhatsAppModal({ onClose }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const { settings } = useSiteSettingsContext();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all required fields.");
      return;
    }

    console.log(form);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: "WhatsApp Inquiry",
          message:
            `Company: ${form.company || "N/A"}\n\n` +
            form.message
        })
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert("Failed to send email.");
      return;
    }
  };

  const phone = settings.contact_whatsapp_number;

  const text = encodeURIComponent(
  `Hi Sathwik,

  My Name: ${form.name}

  Email: ${form.email}

  Company: ${form.company || "N/A"}

  Message:
  ${form.message}`
  );

window.open(
`https://wa.me/${phone}?text=${text}`,
"_blank"
);

onClose();

  return (
    <div className="wa-overlay">

      <div className="wa-modal">

        <button
          className="wa-close"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>Contact via WhatsApp</h2>

        <p>
          Fill in your details and I'll receive an email.
          Then WhatsApp will open automatically.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Your Name *"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email *"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="company"
            placeholder="Company (Optional)"
            value={form.company}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Message *"
            rows="5"
            value={form.message}
            onChange={handleChange}
          />

          <button
            className="wa-send"
            type="submit"
          >
            Continue to WhatsApp
          </button>

        </form>

      </div>

    </div>
  );

}