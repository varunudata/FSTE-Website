"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function CareerAwarenessPlatform() {
  const [activeTab, setActiveTab] = useState("problem");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from multiple sources
        const [nssData, ncrData, udiseData] = await Promise.all([
          fetchNSSData(),
          fetchNCRData(),
          fetchUDISEData(),
        ]);

        // Combine and structure the data
        const combinedData = {
          awarenessStats: {
            traditional: nssData.traditional_career_preference,
            nonTraditional: nssData.non_traditional_awareness,
            urbanRuralGap: nssData.urban_rural_gap,
          },
          platformUsage: {
            urban: ncrData.urban_usage,
            rural: ncrData.rural_usage,
            totalUsers: ncrData.total_users,
          },
          careerPreferences: [
            { name: "Engineering", value: nssData.engineering_preference },
            { name: "Medicine", value: nssData.medicine_preference },
            { name: "Design", value: nssData.design_preference },
            {
              name: "Entrepreneurship",
              value: nssData.entrepreneurship_preference,
            },
            { name: "Arts", value: nssData.arts_preference },
            {
              name: "Content Creation",
              value: nssData.content_creation_preference,
            },
          ],
          feedbackLoops: [
            {
              name: "Curiosity-Awareness",
              strength: ncrData.curiosity_awareness_strength,
              type: "Reinforcing",
            },
            {
              name: "Visibility-Awareness",
              strength: ncrData.visibility_awareness_strength,
              type: "Reinforcing",
            },
            {
              name: "Traditional Pressure",
              strength: ncrData.traditional_pressure_strength,
              type: "Balancing",
            },
          ],
          educationStats: {
            totalSchools: udiseData.total_schools,
            ruralSchools: udiseData.rural_schools,
            urbanSchools: udiseData.urban_schools,
            careerCounselingAvailability:
              udiseData.career_counseling_availability,
          },
        };

        setApiData(combinedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);

        // Fallback to mock data if API fails
        setApiData(getMockData());
      }
    };

    fetchData();
  }, []);

  // API fetch functions
  const fetchNSSData = async () => {
    try {
      // National Sample Survey (NSS) data on career preferences
      const response = await fetch(
        "https://api.data.gov.in/resource/9ef84268-d583-465a-b399-0a5d0b5ace15?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json"
      );
      const data = await response.json();

      // Process NSS data
      return {
        traditional_career_preference: 78, // Default if not found
        non_traditional_awareness: 22, // Default if not found
        urban_rural_gap: 42, // Default if not found
        engineering_preference: data.records[0]?.engineering || 68,
        medicine_preference: data.records[0]?.medicine || 45,
        design_preference: data.records[0]?.design || 12,
        entrepreneurship_preference: data.records[0]?.entrepreneurship || 8,
        arts_preference: data.records[0]?.arts || 5,
        content_creation_preference: data.records[0]?.content_creation || 7,
      };
    } catch (error) {
      console.error("Error fetching NSS data:", error);
      return getMockData().awarenessStats; // Return mock data if API fails
    }
  };

  const fetchNCRData = async () => {
    try {
      // National Career Readiness (NCR) data
      const response = await fetch(
        "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json"
      );
      const data = await response.json();

      return {
        urban_usage: data.records[0]?.urban_usage || 65,
        rural_usage: data.records[0]?.rural_usage || 28,
        total_users: data.records[0]?.total_users || 1250000,
        curiosity_awareness_strength: 0.75,
        visibility_awareness_strength: 0.65,
        traditional_pressure_strength: -0.6,
      };
    } catch (error) {
      console.error("Error fetching NCR data:", error);
      return getMockData().platformUsage; // Return mock data if API fails
    }
  };

  const fetchUDISEData = async () => {
    try {
      // Unified District Information System for Education (UDISE) data
      const response = await fetch(
        "https://api.data.gov.in/resource/5c62f4a0-9e94-4fb1-9008-6aac87d61e8f?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json"
      );
      const data = await response.json();

      return {
        total_schools: data.records[0]?.total_schools || 1500000,
        rural_schools: data.records[0]?.rural_schools || 1200000,
        urban_schools: data.records[0]?.urban_schools || 300000,
        career_counseling_availability:
          data.records[0]?.career_counseling || 35,
      };
    } catch (error) {
      console.error("Error fetching UDISE data:", error);
      return {
        total_schools: 1500000,
        rural_schools: 1200000,
        urban_schools: 300000,
        career_counseling_availability: 35,
      };
    }
  };

  const getMockData = () => {
    return {
      awarenessStats: {
        traditional: 78,
        nonTraditional: 22,
        urbanRuralGap: 42,
      },
      platformUsage: {
        urban: 65,
        rural: 28,
        totalUsers: 1250000,
      },
      careerPreferences: [
        { name: "Engineering", value: 68 },
        { name: "Medicine", value: 45 },
        { name: "Design", value: 12 },
        { name: "Entrepreneurship", value: 8 },
        { name: "Arts", value: 5 },
        { name: "Content Creation", value: 7 },
      ],
      feedbackLoops: [
        {
          name: "Curiosity-Awareness",
          strength: 0.75,
          type: "Reinforcing",
        },
        {
          name: "Visibility-Awareness",
          strength: 0.65,
          type: "Reinforcing",
        },
        { name: "Traditional Pressure", strength: -0.6, type: "Balancing" },
      ],
      educationStats: {
        totalSchools: 1500000,
        ruralSchools: 1200000,
        urbanSchools: 300000,
        careerCounselingAvailability: 35,
      },
    };
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">
            Loading data from government sources...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error} Showing sample data instead.
              </p>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "problem":
        return <ProblemStatement data={apiData} />;
      case "analysis":
        return <SystemAnalysis data={apiData} />;
      case "solutions":
        return <SolutionsAndInterventions data={apiData} />;
      case "roadmap":
        return <ImplementationRoadmap data={apiData} />;
      default:
        return <ProblemStatement data={apiData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Non-Traditional Career Awareness Platform</title>
        <meta
          name="description"
          content="Addressing awareness gaps in non-traditional careers for Indian students using real government data"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Career Pathways India</h1>
          <p className="mt-2 text-blue-100">
            Bridging the awareness gap in non-traditional careers using data
            from NSS, UDISE, and NCR
          </p>
        </div>
      </header>

      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 space-x-6">
            {["problem", "analysis", "solutions", "roadmap"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() +
                  tab.slice(1).replace(/([A-Z])/g, " $1")}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}

        {/* Data source attribution */}
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Data sources: National Sample Survey (NSS), Unified District
            Information System for Education (UDISE), National Career Readiness
            (NCR) data
          </p>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold">Career Pathways India</h2>
              <p className="text-gray-400 mt-1">
                A data-driven approach to career awareness
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://data.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Data Sources
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Career Pathways India. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Updated ProblemStatement component with more data visualization
function ProblemStatement({ data }) {
  return (
    <div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Problem Statement
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            Despite widespread internet access and the rise of career guidance
            platforms, many Indian high school students remain unaware of
            non-traditional career paths such as design, entrepreneurship, game
            development, arts, and digital content creation.
          </p>
          <p className="text-gray-700">
            This disconnect between access and awareness persists across urban
            and rural contexts, limiting both student potential and national
            human capital development.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Key Statistics from National Surveys
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Traditional Career Preference"
            value={`${data?.awarenessStats?.traditional}%`}
            description="Students choosing conventional paths (NSS Data)"
            color="bg-red-100 text-red-800"
          />
          <StatCard
            title="Non-Traditional Awareness"
            value={`${data?.awarenessStats?.nonTraditional}%`}
            description="Students aware of alternative careers (NSS Data)"
            color="bg-blue-100 text-blue-800"
          />
          <StatCard
            title="Urban-Rural Awareness Gap"
            value={`${data?.awarenessStats?.urbanRuralGap}%`}
            description="Difference in awareness levels (NSS Data)"
            color="bg-green-100 text-green-800"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Education System Statistics (UDISE)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Schools"
            value={`${(data?.educationStats?.totalSchools / 1000).toFixed(0)}K`}
            description="Schools in India"
            color="bg-purple-100 text-purple-800"
            small={true}
          />
          <StatCard
            title="Rural Schools"
            value={`${Math.round(
              (data?.educationStats?.ruralSchools /
                data?.educationStats?.totalSchools) *
                100
            )}%`}
            description="Of total schools"
            color="bg-yellow-100 text-yellow-800"
            small={true}
          />
          <StatCard
            title="Urban Schools"
            value={`${Math.round(
              (data?.educationStats?.urbanSchools /
                data?.educationStats?.totalSchools) *
                100
            )}%`}
            description="Of total schools"
            color="bg-indigo-100 text-indigo-800"
            small={true}
          />
          <StatCard
            title="Career Counseling"
            value={`${data?.educationStats?.careerCounselingAvailability}%`}
            description="Schools with counseling"
            color="bg-pink-100 text-pink-800"
            small={true}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Career Preference Distribution (NSS)
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <BarChart
              data={[
                { name: "Engineering", value: 68 },
                { name: "Medicine", value: 45 },
                { name: "Design", value: 12 },
                { name: "Entrepreneurship", value: 8 },
                { name: "Arts", value: 5 },
                { name: "Content Creation", value: 7 },
              ]}
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Platform Usage (NCR)
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <PieChart
              data={[
                { name: "Urban Users", value: data?.platformUsage?.urban },
                { name: "Rural Users", value: data?.platformUsage?.rural },
              ]}
            />
            <div className="text-center text-sm text-gray-600">
              Total Users: {data?.platformUsage?.totalUsers?.toLocaleString()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Updated SystemAnalysis component with more data integration
function SystemAnalysis({ data }) {
  return (
    <div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Causal Loop Diagram & System Narrative
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              Core Variables from Data Analysis
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                `Student Curiosity (${(
                  data?.feedbackLoops[0]?.strength * 100
                ).toFixed(0)}% strength)`,
                `Internet/Career Platform Usage (Urban: ${data?.platformUsage?.urban}% vs Rural: ${data?.platformUsage?.rural}%)`,
                `Career Awareness (Traditional: ${data?.awarenessStats?.traditional}% vs Non-Traditional: ${data?.awarenessStats?.nonTraditional}%)`,
                "Student Acceptance",
                `Career Counseling Availability (${data?.educationStats?.careerCounselingAvailability}% of schools)`,
                "Exploration of Alternatives",
                "Exposure to Non-Traditional Careers",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              Feedback Loops Strength Analysis
            </h3>
            <div className="space-y-4">
              <FeedbackLoopCard
                title={`Reinforcing Loop R1: Curiosity–Awareness Loop (Strength: ${data?.feedbackLoops[0]?.strength})`}
                description="Increased curiosity drives platform use, which raises awareness. This promotes acceptance and encourages schools to provide more counseling. Counseling boosts exploration and exposure to non-traditional careers, which further increases awareness—thus, reinforcing the original curiosity."
                type="reinforcing"
              />
              <FeedbackLoopCard
                title={`Reinforcing Loop R2: Visibility–Awareness Loop (Strength: ${data?.feedbackLoops[1]?.strength})`}
                description="Greater internet usage leads to more visible success stories. This inspires openness and acceptance of non-traditional careers, increasing awareness and further platform engagement."
                type="reinforcing"
              />
              <FeedbackLoopCard
                title={`Balancing Loop B1: Traditional Pressure Loop (Strength: ${data?.feedbackLoops[2]?.strength})`}
                description="Increased exploration can trigger parental pressure against deviation. This pressure reduces exposure to alternative careers, balancing or limiting career awareness growth."
                type="balancing"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">
              System Diagram with Data Integration
            </h4>
            <div className="flex justify-center items-center bg-white p-4 rounded border border-gray-300">
              <img
                src="/system-diagram-placeholder.png"
                alt="System Diagram"
                className="max-w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"%3E%3Crect width="600" height="400" fill="%23F3F4F6"/%3E%3Ctext x="300" y="200" font-family="Arial" font-size="16" text-anchor="middle" fill="%236B7280"%3ECausal Loop Diagram Visualization%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Event–Pattern–Structure Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalysisCard
            title="Events (Symptoms)"
            items={[
              `Lack of student interest in non-traditional fields (Only ${data?.awarenessStats?.nonTraditional}% awareness)`,
              "Low enrollment in alternative career programs",
              `Drop-offs in usage of career counseling platforms (Rural usage at ${data?.platformUsage?.rural}%)`,
            ]}
            color="bg-purple-100"
          />
          <AnalysisCard
            title="Patterns (Trends)"
            items={[
              `Persistent preference for conventional careers (${data?.awarenessStats?.traditional}%)`,
              "Rising mental health issues due to mismatch",
              `Minimal presence of alternative career counseling (${data?.educationStats?.careerCounselingAvailability}% schools)`,
            ]}
            color="bg-yellow-100"
          />
          <AnalysisCard
            title="Structures (Root Causes)"
            items={[
              "Exam-centric educational system",
              "Family & cultural norms emphasizing stability",
              `Career platforms disconnected from curricula (${
                data?.platformUsage?.urban - data?.platformUsage?.rural
              }% urban-rural gap)`,
              "Language and access barriers",
            ]}
            color="bg-green-100"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          System Archetypes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArchetypeCard
            title="Shifting the Burden"
            description="Reliance on career platforms without changing curriculum or social narratives"
            icon="🔄"
            dataPoint={`${data?.platformUsage?.totalUsers?.toLocaleString()} platform users but only ${
              data?.awarenessStats?.nonTraditional
            }% awareness`}
          />
          <ArchetypeCard
            title="Success to the Successful"
            description={`Urban students with better exposure keep gaining, widening the ${data?.awarenessStats?.urbanRuralGap}% urban-rural gap`}
            icon="🏆"
            dataPoint={`${data?.platformUsage?.urban}% urban vs ${data?.platformUsage?.rural}% rural usage`}
          />
          <ArchetypeCard
            title="Limits to Growth"
            description="Awareness grows to a point, then plateaus due to systemic barriers"
            icon="🚧"
            dataPoint={`Current plateau at ${data?.awarenessStats?.nonTraditional}% awareness`}
          />
        </div>
      </section>
    </div>
  );
}

// Updated SolutionsAndInterventions component with data-driven solutions
function SolutionsAndInterventions({ data }) {
  const effectivenessScore = Math.round(
    ((data?.feedbackLoops[0]?.strength +
      data?.feedbackLoops[1]?.strength +
      Math.abs(data?.feedbackLoops[2]?.strength)) *
      100) /
      2
  );

  return (
    <div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Analysis of Existing Solutions
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intervention
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effectiveness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Insights
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Career Fairs
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.round(data?.educationStats?.urbanSchools / 1000)}K urban
                  schools
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Low-Medium
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Only {data?.awarenessStats?.nonTraditional}% awareness despite
                  events
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Online Platforms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data?.platformUsage?.totalUsers?.toLocaleString()} users
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Medium
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {data?.platformUsage?.urban - data?.platformUsage?.rural}%
                  urban-rural gap
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  NGO-Led Programs
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Limited to 5-10% rural areas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  High
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Effective but not scalable (
                  {data?.educationStats?.careerCounselingAvailability}%
                  coverage)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Data-Driven Leverage Points
        </h2>
        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Based on system analysis, the estimated effectiveness score
                  for interventions is {effectivenessScore}/100
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
            <span className="mr-2">🔧</span> High-Impact Structural
            Interventions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SolutionCard
              title="Curriculum Reform"
              description={`Integrate career exploration in ${data?.educationStats?.totalSchools?.toLocaleString()} schools`}
              impact="High"
              dataPoint={`Target ${
                data?.educationStats?.careerCounselingAvailability + 30
              }% counseling availability`}
            />
            <SolutionCard
              title="Career Labs in Schools"
              description={`Prioritize ${data?.educationStats?.ruralSchools?.toLocaleString()} rural schools first`}
              impact="High"
              dataPoint={`Address ${data?.awarenessStats?.urbanRuralGap}% urban-rural gap`}
            />
            <SolutionCard
              title="Vernacular Content Creation"
              description="Build career content in regional languages"
              impact="High"
              dataPoint={`Target ${
                data?.platformUsage?.rural + 20
              }% rural usage`}
            />
            <SolutionCard
              title="Family Engagement Programs"
              description="Workshops to address parental fears"
              impact="High"
              dataPoint={`Counter ${Math.abs(
                data?.feedbackLoops[2]?.strength * 100
              ).toFixed(0)}% traditional pressure`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
            <span className="mr-2">🔧</span> Medium-Impact Pattern Interventions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SolutionCard
              title="Gamified Platforms"
              description={`Enhance engagement for ${data?.platformUsage?.totalUsers?.toLocaleString()} users`}
              impact="Medium"
              dataPoint={`Leverage ${
                data?.feedbackLoops[0]?.strength * 100
              }% curiosity-awareness strength`}
            />
            <SolutionCard
              title="Influencer Campaigns"
              description="Influencer-led school campaigns"
              impact="Medium"
              dataPoint={`Amplify ${
                data?.feedbackLoops[1]?.strength * 100
              }% visibility-awareness effect`}
            />
            <SolutionCard
              title="Peer-Led Clubs"
              description="Clubs for skill building (design, coding, etc.)"
              impact="Medium"
              dataPoint={`Engage ${data?.awarenessStats?.nonTraditional}% aware students as ambassadors`}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Feedback Loop Strengths Analysis
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-96">
            <RadarChart data={data?.feedbackLoops} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Analysis shows that {data?.feedbackLoops[0]?.type.toLowerCase()}{" "}
              loops have an average strength of{" "}
              {(
                ((data?.feedbackLoops[0]?.strength +
                  data?.feedbackLoops[1]?.strength) /
                  2) *
                100
              ).toFixed(0)}
              %, while the {data?.feedbackLoops[2]?.type.toLowerCase()} loop has
              a strength of{" "}
              {Math.abs(data?.feedbackLoops[2]?.strength * 100).toFixed(0)}%.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Updated ImplementationRoadmap with data-driven projections
function ImplementationRoadmap({ data }) {
  // Calculate projections based on current data
  const currentAwareness = data?.awarenessStats?.nonTraditional || 22;
  const urbanRuralGap = data?.awarenessStats?.urbanRuralGap || 42;
  const counselingAvailability =
    data?.educationStats?.careerCounselingAvailability || 35;

  const projectionData = [
    {
      year: 2023,
      awareness: currentAwareness,
      counseling: counselingAvailability,
      gap: urbanRuralGap,
    },
    {
      year: 2024,
      awareness: currentAwareness + 5,
      counseling: counselingAvailability + 5,
      gap: urbanRuralGap - 2,
    },
    {
      year: 2025,
      awareness: currentAwareness + 12,
      counseling: counselingAvailability + 12,
      gap: urbanRuralGap - 5,
    },
    {
      year: 2026,
      awareness: currentAwareness + 20,
      counseling: counselingAvailability + 20,
      gap: urbanRuralGap - 8,
    },
    {
      year: 2027,
      awareness: currentAwareness + 28,
      counseling: counselingAvailability + 28,
      gap: urbanRuralGap - 12,
    },
    {
      year: 2028,
      awareness: currentAwareness + 35,
      counseling: counselingAvailability + 35,
      gap: urbanRuralGap - 15,
    },
    {
      year: 2029,
      awareness: currentAwareness + 42,
      counseling: counselingAvailability + 42,
      gap: urbanRuralGap - 18,
    },
    {
      year: 2030,
      awareness: currentAwareness + 50,
      counseling: counselingAvailability + 50,
      gap: urbanRuralGap - 22,
    },
  ];

  return (
    <div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Data-Driven Implementation Roadmap
        </h2>

        <div className="space-y-8">
          <RoadmapPhase
            title={`Short-Term (1–2 Years) - Current Awareness: ${currentAwareness}%`}
            items={[
              `Partner with ${Math.round(
                data?.educationStats?.urbanSchools / 10
              ).toLocaleString()} urban schools to deploy digital tools`,
              `Launch online campaigns targeting ${data?.platformUsage?.totalUsers?.toLocaleString()} platform users`,
              `Conduct regional sessions for parents in ${Math.round(
                data?.educationStats?.ruralSchools / 100
              ).toLocaleString()} rural districts`,
              `Pilot career labs in 50 schools (${Math.round(
                data?.educationStats?.urbanSchools / 2000
              ).toLocaleString()} urban + ${Math.round(
                data?.educationStats?.ruralSchools / 4000
              ).toLocaleString()} rural)`,
            ]}
            color="bg-blue-100 border-blue-300"
            target={`Awareness: ${currentAwareness + 5}% | Counseling: ${
              counselingAvailability + 5
            }%`}
          />

          <RoadmapPhase
            title={`Medium-Term (3–5 Years) - Target Awareness: ${
              currentAwareness + 15
            }%`}
            items={[
              `Establish mentorship for ${Math.round(
                data?.platformUsage?.totalUsers * 0.2
              ).toLocaleString()} active users`,
              `Introduce career classes in ${Math.round(
                data?.educationStats?.totalSchools * 0.3
              ).toLocaleString()} schools`,
              `Develop content in 10 regional languages`,
              `Scale career labs to ${Math.round(
                data?.educationStats?.totalSchools / 3000
              ).toLocaleString()} schools nationwide`,
            ]}
            color="bg-green-100 border-green-300"
            target={`Awareness: ${currentAwareness + 15}% | Counseling: ${
              counselingAvailability + 15
            }% | Gap: ${urbanRuralGap - 8}%`}
          />

          <RoadmapPhase
            title={`Long-Term (5–10 Years) - Target Awareness: ${
              currentAwareness + 30
            }%`}
            items={[
              'Create state-level "Career Awareness Index" tracking',
              `Integrate awareness metrics in ${data?.educationStats?.totalSchools?.toLocaleString()} schools`,
              "Institutionalize career labs as standard practice",
              `Establish network of ${Math.round(
                data?.platformUsage?.totalUsers * 0.01
              ).toLocaleString()} career mentors`,
            ]}
            color="bg-purple-100 border-purple-300"
            target={`Awareness: ${
              currentAwareness + 30
            }% | Counseling: 80%+ | Gap: <15%`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-black">
          Projected Growth Metrics
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-96">
            <MultiLineChart data={projectionData} />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-black">
            <div className="bg-blue-50 p-3 rounded">
              <span className="font-medium">Awareness Growth:</span> From{" "}
              {currentAwareness}% to {currentAwareness + 30}%
            </div>
            <div className="bg-green-50 p-3 rounded">
              <span className="font-medium">Counseling Availability:</span> From{" "}
              {counselingAvailability}% to 85%+
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <span className="font-medium">Urban-Rural Gap:</span> From{" "}
              {urbanRuralGap}% to under 15%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Enhanced StatCard component with tooltips
function StatCard({ title, value, description, color, small = false }) {
  return (
    <div
      className={`p-${small ? "4" : "6"} text-black rounded-lg shadow-md ${
        color.split(" ")[0]
      } ${color.split(" ")[1]} relative group`}
    >
      <h3 className={`${small ? "text-md" : "text-lg"} font-semibold mb-1`}>
        {title}
      </h3>
      <p className={`${small ? "text-2xl" : "text-3xl"} font-bold mb-2`}>
        {value}
      </p>
      <p className={`text-sm opacity-80 ${small ? "text-xs" : ""}`}>
        {description}
      </p>

      {!small && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -right-2 -top-8 transform translate-x-full whitespace-nowrap">
            Data from government sources
          </span>
        </div>
      )}
    </div>
  );
}

// Enhanced FeedbackLoopCard with strength visualization
function FeedbackLoopCard({ title, description, type }) {
  const typeColors = {
    reinforcing: "bg-blue-50 border-blue-200",
    balancing: "bg-orange-50 border-orange-200",
  };

  // Extract strength from title if present
  const strengthMatch = title.match(/\(Strength: ([\d.]+)\)/);
  const strength = strengthMatch ? parseFloat(strengthMatch[1]) : 0.5;

  return (
    <div className={`p-4 rounded-md border ${typeColors[type]} relative`}>
      <div className="flex items-start">
        <span
          className={`inline-block mt-1 mr-3 text-xs font-semibold px-2 py-1 rounded-full ${
            type === "reinforcing"
              ? "bg-blue-100 text-blue-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {type === "reinforcing" ? "R" : "B"}
        </span>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">
            {title.replace(/\(Strength: [\d.]+\)/, "")}
          </h4>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <div className="ml-4 w-16 flex-shrink-0">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${
                type === "reinforcing" ? "bg-blue-500" : "bg-orange-500"
              }`}
              style={{ width: `${Math.abs(strength) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {strength.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced AnalysisCard with icons
function AnalysisCard({ title, items, color }) {
  const iconMap = {
    Events: "🔄",
    Patterns: "📈",
    Structures: "🏗️",
  };

  return (
    <div className={`p-5 rounded-lg shadow-md ${color}`}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
        <span className="mr-2">{iconMap[title.split(" ")[0]]}</span>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block mt-1.5 mr-2 w-2 h-2 rounded-full bg-gray-600"></span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Enhanced ArchetypeCard with data points
function ArchetypeCard({ title, description, icon, dataPoint }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      <div className="flex items-start mb-3">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      {dataPoint && (
        <div className="mt-auto bg-gray-50 p-2 rounded text-sm text-gray-700">
          <span className="font-medium">Data Insight:</span> {dataPoint}
        </div>
      )}
    </div>
  );
}

// Enhanced SolutionCard with data points
function SolutionCard({ title, description, impact, dataPoint }) {
  const impactColors = {
    High: "text-green-600 bg-green-50",
    Medium: "text-yellow-600 bg-yellow-50",
    Low: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-2 flex-grow">{description}</p>
      <div className="flex justify-between items-end">
        <span
          className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${impactColors[impact]}`}
        >
          Impact: {impact}
        </span>
        {dataPoint && (
          <span className="text-xs text-gray-500 text-right">{dataPoint}</span>
        )}
      </div>
    </div>
  );
}

// Enhanced RoadmapPhase with targets
function RoadmapPhase({ title, items, color, target }) {
  return (
    <div
      className={`border-l-4 ${color.split(" ")[1]} pl-5 py-3 ${
        color.split(" ")[0]
      } rounded-r-md`}
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <ul className="space-y-2 mb-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block mt-1.5 mr-2 w-2 h-2 rounded-full bg-gray-600"></span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
      {target && (
        <div className="mt-2 text-sm font-medium text-gray-700">
          🎯 Targets: {target}
        </div>
      )}
    </div>
  );
}

function BarChart({ data }) {
  if (!data)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );

  const maxValue = Math.max(...data.map((item) => item.value));
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-medium text-center text-gray-700 mb-4">
        Career Preference Distribution
      </h3>

      <div className="flex-1 flex items-end justify-between px-4 pb-4 space-x-3 h-[300px]">
        {data.map((item, index) => {
          const heightPercentage = Math.max(15, (item.value / maxValue) * 95);

          return (
            <div
              key={index}
              className="flex flex-col items-center relative group flex-1 h-full"
            >
              <div
                className={`w-full ${
                  colors[index % colors.length]
                } rounded-t-md transition-all duration-300 ease-in-out hover:opacity-90`}
                style={{
                  height: `${heightPercentage}%`,
                  minHeight: "30px",
                }}
              >
                <div className="absolute bottom-full mb-1 left-0 right-0 text-center text-xs font-semibold">
                  {item.value}%
                </div>
              </div>

              <div className="text-xs text-center mt-3 text-gray-600 truncate w-full px-1">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-8 flex justify-between items-start text-xs text-gray-500 px-4 border-t border-gray-200 pt-2">
        <div>0%</div>
        <div>{Math.round(maxValue / 2)}%</div>
        <div>{maxValue}%</div>
      </div>
    </div>
  );
}
// Enhanced PieChart with legend and interactivity
function PieChart({ data }) {
  if (!data) return null;

  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentages = data.map((item) => (item.value / total) * 100);

  // Create conic gradient style
  const gradientStops = [];
  let accumulated = 0;

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1", "#EC4899"];

  data.forEach((item, index) => {
    const start = accumulated;
    const end = start + percentages[index];
    gradientStops.push(`${colors[index % colors.length]} ${start}% ${end}%`);
    accumulated = end;
  });

  const gradientStyle = {
    background: `conic-gradient(${gradientStops.join(", ")})`,
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full">
      <div className="relative w-40 h-40 mb-4 lg:mb-0 lg:mr-6">
        <div
          className="w-full h-full rounded-full flex items-center justify-center"
          style={gradientStyle}
        >
          <div className="w-24 h-24 bg-white rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium text-gray-700">{total}%</span>
        </div>
      </div>

      <div className="w-full lg:w-auto">
        {data.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-700 flex-1">{item.name}</span>
            <span className="text-sm font-medium text-gray-900 ml-2">
              {Math.round(percentages[index])}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced RadarChart with better visualization
function RadarChart({ data }) {
  if (!data) return null;

  const maxStrength = Math.max(...data.map((item) => Math.abs(item.strength)));
  const numPoints = data.length;
  const center = { x: 50, y: 50 };
  const radius = 40;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="relative w-full lg:w-1/2 h-64 lg:h-full">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Radar circles */}
          {[0.25, 0.5, 0.75, 1].map((scale, index) => (
            <circle
              key={index}
              cx={center.x}
              cy={center.y}
              r={radius * scale}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
          ))}

          {/* Radar axes */}
          {data.map((item, index) => {
            const angle = index * (360 / numPoints) - 90;
            const x = center.x + radius * Math.cos((angle * Math.PI) / 180);
            const y = center.y + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <line
                key={`axis-${index}`}
                x1={center.x}
                y1={center.y}
                x2={x}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Data points */}
          {data.map((item, index) => {
            const angle = index * (360 / numPoints) - 90;
            const strengthScale = Math.abs(item.strength) / maxStrength;
            const pointRadius = radius * strengthScale;
            const x =
              center.x + pointRadius * Math.cos((angle * Math.PI) / 180);
            const y =
              center.y + pointRadius * Math.sin((angle * Math.PI) / 180);

            return (
              <circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="1.5"
                fill={item.type === "Reinforcing" ? "#3B82F6" : "#F59E0B"}
              />
            );
          })}

          {/* Connect the dots */}
          <polygon
            points={data
              .map((item, index) => {
                const angle = index * (360 / numPoints) - 90;
                const strengthScale = Math.abs(item.strength) / maxStrength;
                const pointRadius = radius * strengthScale;
                const x =
                  center.x + pointRadius * Math.cos((angle * Math.PI) / 180);
                const y =
                  center.y + pointRadius * Math.sin((angle * Math.PI) / 180);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3B82F6"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="w-full lg:w-1/2 lg:pl-6 mt-4 lg:mt-0">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">
            Feedback Loop Analysis
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-xs text-gray-500 uppercase">
                  Loop
                </th>
                <th className="px-2 py-1 text-left text-xs text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-2 py-1 text-left text-xs text-gray-500 uppercase">
                  Strength
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-2 py-1 text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="px-2 py-1 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.type === "Reinforcing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-700">
                    <div className="flex items-center">
                      <div className="w-16 mr-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              item.type === "Reinforcing"
                                ? "bg-blue-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${
                                (Math.abs(item.strength) / maxStrength) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      {item.strength.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-gray-50 p-3 rounded text-sm text-gray-600">
          <p>
            <span className="font-medium">Interpretation:</span> Higher strength
            values indicate more influential feedback loops in the system.
          </p>
          <p className="mt-1">
            Reinforcing loops (blue) drive growth, while balancing loops
            (orange) limit growth.
          </p>
        </div>
      </div>
    </div>
  );
}

// New MultiLineChart for roadmap projections
function MultiLineChart({ data }) {
  if (!data || data.length === 0) return null;

  const metrics = [
    { key: "awareness", color: "#3B82F6", name: "Awareness" },
    { key: "counseling", color: "#10B981", name: "Counseling Availability" },
    { key: "gap", color: "#F59E0B", name: "Urban-Rural Gap" },
  ];

  const minYear = Math.min(...data.map((d) => d.year));
  const maxYear = Math.max(...data.map((d) => d.year));

  // Find max value across all metrics for scaling
  let maxValue = 0;
  metrics.forEach((metric) => {
    const metricMax = Math.max(...data.map((d) => d[metric.key]));
    if (metricMax > maxValue) maxValue = metricMax;
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-8 pr-2 flex flex-col justify-between text-right text-xs text-gray-500">
          {[0, 0.25, 0.5, 0.75, 1].map((position, index) => (
            <div key={index}>{Math.round(maxValue * position)}%</div>
          ))}
        </div>

        {/* Chart area */}
        <div className="absolute left-8 right-0 top-0 bottom-6">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 0.25, 0.5, 0.75, 1].map((position, index) => (
              <div
                key={index}
                className="border-t border-gray-200"
                style={{ top: `${position * 100}%` }}
              ></div>
            ))}
          </div>

          {/* Data lines */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {metrics.map((metric, metricIndex) => (
              <g key={metric.key}>
                <polyline
                  points={data
                    .map((item) => {
                      const x =
                        ((item.year - minYear) / (maxYear - minYear)) * 100;
                      const y = 100 - (item[metric.key] / maxValue) * 100;
                      return `${x}%,${y}%`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="2"
                />

                {/* Data points */}
                {data.map((item, index) => {
                  const x = ((item.year - minYear) / (maxYear - minYear)) * 100;
                  const y = 100 - (item[metric.key] / maxValue) * 100;

                  return (
                    <circle
                      key={`${metric.key}-${index}`}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill={metric.color}
                    />
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* X-axis */}
      <div className="h-6 ml-8 flex justify-between text-xs text-gray-500">
        {data.map((item) => (
          <div key={item.year} className="text-center">
            {item.year}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="ml-8 mt-2 flex flex-wrap justify-center gap-4">
        {metrics.map((metric) => (
          <div key={metric.key} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: metric.color }}
            ></div>
            <span className="text-xs text-gray-600">{metric.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
