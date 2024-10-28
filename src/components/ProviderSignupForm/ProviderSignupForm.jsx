import React, { useState } from "react";
import { signupProvider } from "../../services/authService";

const ProviderSignupForm = () => {
  const insuranceOptions = [
    "Aetna",
    "United Health Care",
    "Blue Cross / Blue Shield",
    "Humana",
    "Fidelis Care",
    "Health Plus One",
    "Cigna",
    "Medicare",
    "Medicaid",
    "Guardian",
    "MetLife",
    "WellCare",
    "Tri-care",
    "AmeriGroup",
    "Anthem",
    "Beacon Health",
    "Community Health Choice",
    "HealthFirst",
    "Optum",
  ];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConf: "",
    firstName: "",
    lastName: "",
    credentials: "",
    bio: "",
    location: "",
    insuranceAccepted: [],
    yearsOfExperience: "",
    languages: "",
    licensureState: "",
    licenseNumber: "",
    telehealth: true,
    inPerson: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox" && name.startsWith("insurance_")) {
      const insurance = name.replace("insurance_", "");
      const updatedInsurance = checked
        ? [...formData.insuranceAccepted, insurance]
        : formData.insuranceAccepted.filter((ins) => ins !== insurance);

      setFormData({ ...formData, insuranceAccepted: updatedInsurance });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (formData.password !== formData.passwordConf) {
      errors.password = "Passwords do not match";
    }

    if (!formData.licenseNumber) {
      errors.licenseNumber = "License number is required";
    }

    if (!formData.yearsOfExperience) {
      errors.yearsOfExperience = "Years of experience is required";
    }

    if (formData.insuranceAccepted.length === 0) {
      errors.insurance = "Please select at least one insurance provider";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const filteredInsuranceOptions = insuranceOptions.filter((insurance) =>
    insurance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors) {
      console.log("Validation errors:", validationErrors);
      setError("Please fix all required fields");
      return;
    }

    try {
      // Format data before submission
      const submissionData = {
        ...formData,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10),
        // Remove passwordConf as it's not needed in the backend
        passwordConf: undefined
      };

      console.log("Submitting provider data:", submissionData);
      await signupProvider(submissionData);
      // Handle successful signup (e.g., redirect to login)
    } catch (err) {
      console.error("Signup error:", err.response?.data);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        type="password"
        name="passwordConf"
        value={formData.passwordConf}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      <input
        type="text"
        name="credentials"
        value={formData.credentials}
        onChange={handleChange}
        placeholder="Credentials"
        required
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Bio"
        required
      ></textarea>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        required
      />

      <div>
        <label>Insurance Accepted:</label>
        <input
          type="text"
          placeholder="Search insurance providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          {filteredInsuranceOptions.map((insurance) => (
            <label key={insurance}>
              <input
                type="checkbox"
                name={`insurance_${insurance}`}
                checked={formData.insuranceAccepted.includes(insurance)}
                onChange={handleChange}
              />
              {insurance}
            </label>
          ))}
        </div>
        <div>
          Selected: {formData.insuranceAccepted.length} insurance providers
        </div>
      </div>

      <input
        type="number"
        name="yearsOfExperience"
        value={formData.yearsOfExperience}
        onChange={handleChange}
        placeholder="Years of Experience"
        required
        min="0"
        max="100"
      />
      <input
        type="text"
        name="languages"
        value={formData.languages}
        onChange={handleChange}
        placeholder="Languages Spoken"
      />
      <input
        type="text"
        name="licensureState"
        value={formData.licensureState}
        onChange={handleChange}
        placeholder="Licensure State"
        required
      />
      <input
        type="text"
        name="licenseNumber"
        value={formData.licenseNumber}
        onChange={handleChange}
        placeholder="License Number"
        required
      />
      <label>
        <input
          type="checkbox"
          name="telehealth"
          checked={formData.telehealth}
          onChange={handleChange}
        />
        Offers Telehealth
      </label>
      <label>
        <input
          type="checkbox"
          name="inPerson"
          checked={formData.inPerson}
          onChange={handleChange}
        />
        Offers In-Person Sessions
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up as Provider</button>
    </form>
  );
};

export default ProviderSignupForm;
