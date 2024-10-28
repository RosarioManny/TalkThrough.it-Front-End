import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupProvider } from "../../services/authService";

const ProviderSignupForm = () => {
  const navigate = useNavigate();
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
    acceptingClients: true
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredInsuranceOptions = insuranceOptions.filter((insurance) =>
    insurance.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    if (!formData.licenseNumber?.trim()) {
      errors.licenseNumber = "License number is required";
    }

    if (!formData.yearsOfExperience) {
      errors.yearsOfExperience = "Years of experience is required";
    }

    if (formData.insuranceAccepted.length === 0) {
      errors.insurance = "Please select at least one insurance provider";
    }

    const requiredFields = [
      'email',
      'firstName',
      'lastName',
      'credentials',
      'bio',
      'location',
      'licensureState'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors) {
      setError(Object.values(validationErrors).join(", "));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const submissionData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        credentials: formData.credentials.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        insuranceAccepted: formData.insuranceAccepted,
        yearsOfExperience: Number(formData.yearsOfExperience),
        languages: [formData.languages.trim() || 'English'],
        licensureState: formData.licensureState.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        telehealth: formData.telehealth,
        inPerson: formData.inPerson,
        acceptingClients: true
      };

      const response = await signupProvider(submissionData);
      setSuccess(true);
      
      // Show success message and redirect
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Registration successful! Redirecting to login page...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="passwordConf"
              value={formData.passwordConf}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credentials</label>
          <input
            type="text"
            name="credentials"
            value={formData.credentials}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Insurance Accepted</label>
          <input
            type="text"
            placeholder="Search insurance providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {filteredInsuranceOptions.map((insurance) => (
              <label key={insurance} className="flex items-center">
                <input
                  type="checkbox"
                  name={`insurance_${insurance}`}
                  checked={formData.insuranceAccepted.includes(insurance)}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">{insurance}</span>
              </label>
            ))}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Selected: {formData.insuranceAccepted.length} insurance providers
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Languages</label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="English"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Licensure State</label>
            <input
              type="text"
              name="licensureState"
              value={formData.licensureState}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="telehealth"
              checked={formData.telehealth}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Offers Telehealth</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="inPerson"
              checked={formData.inPerson}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Offers In-Person Sessions</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isLoading || success 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isLoading ? 'Submitting...' : success ? 'Registration Complete!' : 'Sign Up as Provider'}
        </button>
      </form>
    </div>
  );
};

export default ProviderSignupForm;
