import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button/Button";

const CardForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    slug: initialData.slug || "",
    subtitle: initialData.subtitle || "",
    description: initialData.description || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    template_id: initialData.template_id || "default",
    font_style: initialData.font_style || "Arial",
    background_color: initialData.background_color || "#FFFFFF",
    avatar: null,
    background_image: null,
    social_links: initialData.social_links || [],
    is_active:
      initialData.is_active !== undefined ? initialData.is_active : true, // По умолчанию активна
  });
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : type === "checkbox" ? checked : value,
    });
  };

  const handleSocialLinkChange = (e) => {
    setNewSocialLink({ ...newSocialLink, [e.target.name]: e.target.value });
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFormData({
        ...formData,
        social_links: [...formData.social_links, newSocialLink],
      });
      setNewSocialLink({ platform: "", url: "" });
    }
  };

  const removeSocialLink = (index) => {
    setFormData({
      ...formData,
      social_links: formData.social_links.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "social_links") {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key === "avatar" || key === "background_image") {
        if (formData[key]) data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });
    onSubmit(data);
  };

  return (
    <div className="create-form">
      <h3>{isEditing ? t("dashboard.editCard") : t("dashboard.createCard")}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("dashboard.titleCard")}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.slug")}</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.subtitle")}</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.description")}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.phone")}</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.avatar")}</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.background_image")}</label>
          <input
            type="file"
            name="background_image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.template_id")}</label>
          <select
            name="template_id"
            value={formData.template_id}
            onChange={handleChange}
            required
          >
            <option value="default">Default</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t("dashboard.font_style")}</label>
          <select
            name="font_style"
            value={formData.font_style}
            onChange={handleChange}
            required
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Roboto">Roboto</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t("dashboard.background_color")}</label>
          <input
            type="color"
            name="background_color"
            value={formData.background_color}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.is_active")}</label>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t("dashboard.social_links")}</label>
          <div>
            <input
              type="text"
              name="platform"
              placeholder="Platform (e.g., Twitter)"
              value={newSocialLink.platform}
              onChange={handleSocialLinkChange}
            />
            <input
              type="url"
              name="url"
              placeholder="URL"
              value={newSocialLink.url}
              onChange={handleSocialLinkChange}
            />
            <Button
              text={t("dashboard.addLink")}
              onClick={addSocialLink}
              background="#007bff"
            />
          </div>
          {formData.social_links.map((link, index) => (
            <div key={index}>
              <span>
                {link.platform}: {link.url}
              </span>
              <Button
                text={t("dashboard.remove")}
                onClick={() => removeSocialLink(index)}
                background="#dc3545"
              />
            </div>
          ))}
        </div>
        <Button type="submit" text={t("dashboard.save")} background="#28a745" />
        <Button
          text={t("dashboard.cancel")}
          background="#6c757d"
          onClick={onCancel}
        />
      </form>
    </div>
  );
};

export default CardForm;
