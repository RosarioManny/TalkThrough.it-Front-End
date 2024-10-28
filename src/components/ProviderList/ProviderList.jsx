import React, { useEffect, useState } from "react";
import { fetchProviders } from "../../services/providerService";

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await fetchProviders();
        console.log("Fetched Providers:", data); // Log the fetched data
        setProviders(data);
      } catch (error) {
        setError("Failed to load providers");
        console.error("Error loading providers:", error);
      }
    };

    loadProviders();
  }, []);

  return (
    <div>
      <h1>Providers</h1>
      {error && <p>{error}</p>}
      <ul>
        {providers.map((provider) => (
          <li key={provider._id}>
            <h2>{`${provider.firstName} ${provider.lastName}`}</h2>
            <p>
              <strong>Credentials:</strong> {provider.credentials}
            </p>
            <p>
              <strong>Bio:</strong> {provider.bio}
            </p>
            <p>
              <strong>Location:</strong> {provider.location}
            </p>
            {/* Check if insuranceAccepted is an array before calling join */}
            <p>
              <strong>Insurance Accepted:</strong>{" "}
              {Array.isArray(provider.insuranceAccepted)
                ? provider.insuranceAccepted.join(", ")
                : "Not specified"}
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {Array.isArray(provider.languages)
                ? provider.languages.join(", ")
                : "Not specified"}
            </p>
            <p>
              <strong>Telehealth:</strong> {provider.telehealth ? "Yes" : "No"}
            </p>
            <p>
              <strong>In Person:</strong> {provider.inPerson ? "Yes" : "No"}
            </p>
            <p>
              <strong>Years of Experience:</strong>{" "}
              {provider.yearsOfExperience || "Not specified"}
            </p>
            <p>
              <strong>Therapy Approaches:</strong>{" "}
              {Array.isArray(provider.therapyApproaches)
                ? provider.therapyApproaches.join(", ")
                : "Not specified"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderList;
