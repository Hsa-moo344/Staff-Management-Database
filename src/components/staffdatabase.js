import React, { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StaffDatabase() {
  const [formStaffData, setStaffFormData] = useState({
    name: "",
    gender: "",
    position: "",
    image: "",
    departments: "",
    joinDate: "",
    staffCode: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/staffdatabasefunction"
      );
      setStaffList(res.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const tagsArray = formStaffData.tags.split(",").map((tag) => tag.trim());

    for (const key in formStaffData) {
      if (key === "tags") {
        formData.append("tags", JSON.stringify(tagsArray));
      } else {
        formData.append(key, formStaffData[key]);
      }
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const url = editingId
        ? `http://localhost:8000/staffdatabasefunction/${editingId}`
        : "http://localhost:8000/staffdatabasefunction";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        alert(editingId ? "Updated successfully!" : "Submitted successfully!");
        setStaffFormData({
          name: "",
          gender: "",
          position: "",
          image: "",
          departments: "",
          joinDate: "",
          staffCode: "",
          tags: "",
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        fetchStaff();
      } else {
        alert("Failed to submit");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (staff) => {
    setEditingId(staff.id);
    setStaffFormData({
      name: staff.name,
      gender: staff.gender,
      position: staff.position,
      image: staff.image,
      departments: staff.departments || staff.department,
      joinDate: staff.joinDate.split("T")[0],
      staffCode: staff.staffCode,
      tags: Array.isArray(staff.tags) ? staff.tags.join(", ") : staff.tags,
    });
    setImagePreview(staff.image);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`http://localhost:8000/staffdatabasefunction/${id}`);
        fetchStaff();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Staff Data Entry Form</h2>
      <form className={ProfileCss.profileMain} onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formStaffData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={formStaffData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Position:
          <select
            name="position"
            value={formStaffData.position}
            onChange={handleChange}
            required
          >
            <option value="">Position</option>
            <option>Director</option>
            <option>Assistant Director</option>
            <option>Deputy Director</option>
            <option>Assistant Deputy Director</option>
            <option>Manager</option>
            <option>Supervisor</option>
            <option>Coordinator</option>
            <option>In Charge</option>
            <option>Doctor</option>
            <option>Software Developer</option>
            <option>Medic Staff</option>
            <option>Staff</option>
          </select>
        </label>
        <label>
          Upload Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        {imagePreview && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: "#666" }}>Image Preview</p>
          </div>
        )}
        <label>
          Department:
          <select
            name="departments"
            value={formStaffData.departments}
            onChange={handleChange}
            required
          >
            <option value="">Departments</option>
            <option>Finance</option>
            <option>HR</option>
            <option>Adult OPD</option>
            <option>Eye</option>
            <option>Dental</option>
            <option>Child OPD/Immunization</option>
            <option>RH OPD</option>
            <option>Lab</option>
            <option>RH IPD</option>
            <option>VCT/Blood Bank</option>
            <option>Pharmacy OPD/IPD/Main Center</option>
            <option>Child IPD</option>
            <option>Surgical OPD/IPD</option>
            <option>Adult IPD</option>
            <option>Physiotherapy</option>
            <option>TCM</option>
            <option>Security/Public Relation</option>
            <option>Health Administraion Office</option>
            <option>HIS/Registration</option>
            <option>HR/OD</option>
            <option>ECU</option>
            <option>Administartion</option>
            <option>Kitchen</option>
            <option>BBHS</option>
            <option>Training</option>
          </select>
        </label>
        <label>
          Join Date:
          <input
            type="date"
            name="joinDate"
            value={formStaffData.joinDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Staff Code:
          <input
            type="text"
            name="staffCode"
            value={formStaffData.staffCode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tags (comma separated):
          <input
            type="text"
            name="tags"
            value={formStaffData.tags}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className={ProfileCss.submitBtn}>
          {editingId ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default StaffDatabase;
