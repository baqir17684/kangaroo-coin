// src/CompanyInfo.js
import React, { useState } from 'react';

function CompanyInfo() {
    const [companyName, setCompanyName] = useState('');
    const [companyInfo, setCompanyInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setCompanyName(event.target.value);
    };

    const fetchCompanyInfo = async () => {
        setError(null);
        setCompanyInfo(null);
        try {
            const response = await fetch('http://localhost:5000/company-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ company_name: companyName })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCompanyInfo(data);
            } else {
                setError('Failed to fetch company info');
            }
        } catch (err) {
            setError('Error fetching company info');
        }
    };

    return (
        <div>
            <h1>Company Info Fetcher</h1>
            <input
                type="text"
                value={companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
            />
            <button onClick={fetchCompanyInfo}>Fetch Info</button>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {companyInfo && (
                <div>
                    <h2>{companyInfo.company_name}</h2>
                    <p>{companyInfo.summary}</p>
                    <p>{companyInfo.info}</p>
                    <img src={companyInfo.logo_url} alt="Company Logo" />
                    <a href={companyInfo.url} target="_blank" rel="noopener noreferrer">Official Website</a>
                </div>
            )}
        </div>
    );
}

export default CompanyInfo;
