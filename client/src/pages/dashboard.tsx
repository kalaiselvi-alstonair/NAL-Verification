import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import NewVerification from "@/pages/new-verification";
import { PropertyMap } from "@/components/ui/property-map";
import { useRef } from "react";
import { useLocation } from "wouter";
import React, { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarUrl, getGenderFromName } from '@/lib/utils';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, LogOut, Edit2, KeyRound } from 'lucide-react';

// Accept props for wouter compatibility
export default function Dashboard(props: any) {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  // Extract menu param from URL
  const menuParam = (() => {
    const match = location.match(/[?&]menu=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : "dashboard";
  })();
  const [selectedMenu, setSelectedMenu] = useState(menuParam);
  // Keep selectedMenu in sync with URL
  React.useEffect(() => {
    setSelectedMenu(menuParam);
  }, [menuParam]);

  // Add VaultDoc type
  type VaultDoc = {
    name: string;
    data: string | ArrayBuffer | null;
    password: string;
    uploaded: string;
  };

  // Vault state
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUnlock, setShowUnlock] = useState<number | null>(null); // doc index
  const [unlockPwd, setUnlockPwd] = useState("");
  const [unlockedDocs, setUnlockedDocs] = useState<number[]>([]); // array of doc indices
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mock data for stat cards
  const stats = [
    {
      label: "Trust Score",
      value: "8.4/10",
      sub: "Excellent standing",
      icon: TrendingUp,
    },
    {
      label: "Ongoing",
      value: "2",
      sub: "Active verifications",
      icon: Clock,
    },
    {
      label: "Completed",
      value: "2",
      sub: "Verified properties",
      icon: CheckCircle,
    },
    {
      label: "Risk Level",
      value: "Low",
      sub: "Minimal concerns",
      icon: Shield,
    },
  ];

  // Mock data for ongoing verifications
  const ongoing = [
    {
      id: 1,
      title: "Plot No. 45, Whitefield",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Flat 12B, Green Acres",
      status: "In Progress",
    },
  ];

  // Mock data for reports
  const mockReports = [
    {
      id: 1,
      propertyName: "Plot No. 123, Sector 7, Whitefield",
      address: "Whitefield, Bengaluru, Karnataka",
      overallRisk: "high",
      lastChecked: "2023-10-27",
      documents: [
        { name: "Survey Plan", risk: "high", details: "Document contains discrepancies in dimensions and boundaries." },
        { name: "Title Deed", risk: "medium", details: "Document has minor inconsistencies in ownership details." },
        { name: "Encumbrance Certificate", risk: "low", details: "Document is free of encumbrances." },
      ],
    },
    {
      id: 2,
      propertyName: "Flat 45, Green Meadows, Indiranagar",
      address: "Indiranagar, Bengaluru, Karnataka",
      overallRisk: "medium",
      lastChecked: "2023-10-26",
      documents: [
        { name: "Sale Deed", risk: "medium", details: "Document has some minor discrepancies in property details." },
        { name: "Property Tax Receipt", risk: "low", details: "Document is valid and up-to-date." },
        { name: "Encumbrance Certificate", risk: "low", details: "Document is free of encumbrances." },
      ],
    },
    {
      id: 3,
      propertyName: "Plot No. 78, Sector 10, Koramangala",
      address: "Koramangala, Bengaluru, Karnataka",
      overallRisk: "low",
      lastChecked: "2023-10-25",
      documents: [
        { name: "Survey Plan", risk: "low", details: "Document is accurate and free of discrepancies." },
        { name: "Title Deed", risk: "low", details: "Document is valid and up-to-date." },
        { name: "Encumbrance Certificate", risk: "low", details: "Document is free of encumbrances." },
      ],
    },
  ];

  // Mock data for AI suggested properties
  const aiSuggestedProperties = [
    {
      propertyName: "Plot No. 101, Sector 1, Whitefield",
      address: "Whitefield, Bengaluru, Karnataka",
      overallRisk: "medium",
    },
    {
      propertyName: "Flat 78, Green Meadows, Indiranagar",
      address: "Indiranagar, Bengaluru, Karnataka",
      overallRisk: "low",
    },
    {
      propertyName: "Plot No. 150, Sector 12, Koramangala",
      address: "Koramangala, Bengaluru, Karnataka",
      overallRisk: "high",
    },
  ];

  // Mock data for legal checks
  const mockLegalChecks = [
    { name: "Plot No. 123, Sector 7, Whitefield", status: "Active Case", details: "Property involved in a land dispute case." },
    { name: "Flat 45, Green Meadows, Indiranagar", status: "No Cases", details: "No active legal disputes found." },
    { name: "Plot No. 78, Sector 10, Koramangala", status: "Active Case", details: "Owner involved in a property tax dispute." },
  ];

  // Mock data for zoning checks
  const mockZoningChecks = [
    { name: "Plot No. 123, Sector 7, Whitefield", status: "Compliant", details: "Property falls within a permitted zone." },
    { name: "Flat 45, Green Meadows, Indiranagar", status: "Restricted", details: "Property is located in a green belt area." },
    { name: "Plot No. 78, Sector 10, Koramangala", status: "Compliant", details: "Property is in a city-planned zone." },
  ];

  // Handle upload
  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileInputRef.current) return;
    const file = fileInputRef.current.files && fileInputRef.current.files[0];
    if (!file) return;
    const pwd = prompt("Set a password to secure this document:");
    if (!pwd) return;
    const reader = new FileReader();
    reader.onload = () => {
      setVaultDocs(docs => [
        ...docs,
        {
          name: file.name,
          data: reader.result,
          password: pwd,
          uploaded: new Date().toLocaleString(),
        },
      ]);
    };
    reader.readAsDataURL(file);
    fileInputRef.current.value = "";
  }

  // Handle unlock
  function handleUnlock(idx: number) {
    if (vaultDocs[idx].password === unlockPwd) {
      setUnlockedDocs(docs => [...docs, idx]);
      setShowUnlock(null);
      setUnlockPwd("");
    } else {
      alert("Incorrect password");
    }
  }

  // Mock data for property overview bar chart
  const propertyOverviewData = [
    { month: 'Jan', searched: 12, verified: 10, highRisk: 2, mediumRisk: 1 },
    { month: 'Feb', searched: 15, verified: 12, highRisk: 3, mediumRisk: 2 },
    { month: 'Mar', searched: 18, verified: 15, highRisk: 4, mediumRisk: 3 },
    { month: 'Apr', searched: 20, verified: 18, highRisk: 5, mediumRisk: 4 },
    { month: 'May', searched: 22, verified: 20, highRisk: 6, mediumRisk: 5 },
    { month: 'Jun', searched: 25, verified: 22, highRisk: 7, mediumRisk: 6 },
    { month: 'Jul', searched: 28, verified: 25, highRisk: 8, mediumRisk: 7 },
    { month: 'Aug', searched: 30, verified: 28, highRisk: 9, mediumRisk: 8 },
    { month: 'Sep', searched: 32, verified: 30, highRisk: 10, mediumRisk: 9 },
    { month: 'Oct', searched: 35, verified: 32, highRisk: 11, mediumRisk: 10 },
    { month: 'Nov', searched: 38, verified: 35, highRisk: 12, mediumRisk: 11 },
    { month: 'Dec', searched: 40, verified: 38, highRisk: 13, mediumRisk: 12 },
  ];

  // Fetch Documents State
  const [fetchForm, setFetchForm] = useState({
    survey_number: '',
    owner_name: '',
    village_area: '',
    state: '',
  });
  const [fetchResults, setFetchResults] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFetchInput = (field: string, value: string) => {
    setFetchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFetchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchLoading(true);
    setFetchError(null);
    setFetchResults([]);
    try {
      const params = new URLSearchParams(fetchForm as any).toString();
      const res = await fetch('http://localhost/ProfessionalWebPortal/server/php/search_documents.php?' + params);
      const data = await res.json();
      if (data.success) {
        setFetchResults(data.documents);
      } else {
        setFetchError(data.error || 'No results found.');
      }
    } catch (err) {
      setFetchError('Failed to fetch documents.');
    } finally {
      setFetchLoading(false);
    }
  };

  // Add this useEffect for auto-refresh
  useEffect(() => {
    if (
      fetchForm.survey_number ||
      fetchForm.owner_name ||
      fetchForm.village_area ||
      fetchForm.state
    ) {
      const interval = setInterval(() => {
        handleFetchSubmit({ preventDefault: () => {} } as React.FormEvent);
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [fetchForm]); // re-run if search criteria change

  return (
    <div className="flex min-h-screen bg-background flex-col">
      <DashboardTopbar />
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block" style={{ marginTop: '72px' }}>
        <DashboardSidebar onMenuSelect={setSelectedMenu} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">
          {selectedMenu === "fetch-docs" ? (
            <div className="max-w-3xl mx-auto">
              <Card className="bg-blue-light p-8">
                <CardContent>
                  <h2 className="text-2xl font-bold mb-2 text-main text-center">Search Property Documents</h2>
                  <p className="text-muted-foreground mb-8 text-center">Enter search criteria to find property documents</p>
                  <form className="space-y-6" onSubmit={handleFetchSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-main font-medium mb-2">Survey Number</label>
                        <input type="text" value={fetchForm.survey_number} onChange={e => handleFetchInput('survey_number', e.target.value)} placeholder="Enter survey number" className="w-full bg-white border border-card-shadow rounded-lg px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-main font-medium mb-2">Owner Name</label>
                        <input type="text" value={fetchForm.owner_name} onChange={e => handleFetchInput('owner_name', e.target.value)} placeholder="Enter owner name" className="w-full bg-white border border-card-shadow rounded-lg px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-main font-medium mb-2">Village / Area</label>
                        <input type="text" value={fetchForm.village_area} onChange={e => handleFetchInput('village_area', e.target.value)} placeholder="Enter village or area" className="w-full bg-white border border-card-shadow rounded-lg px-4 py-2" />
                      </div>
                      <div>
                        <label className="block text-main font-medium mb-2">State</label>
                        <input type="text" value={fetchForm.state} onChange={e => handleFetchInput('state', e.target.value)} placeholder="Enter state" className="w-full bg-white border border-card-shadow rounded-lg px-4 py-2" />
                      </div>
                    </div>
                    <div className="flex items-start mt-4">
                      <input type="checkbox" id="consent" className="mt-1 mr-2" />
                      <label htmlFor="consent" className="text-sm text-main">
                        <span className="font-semibold">I consent to NAL India accessing government records for property verification purposes.</span> I understand that this data will be used solely for generating the trust report and will be handled according to our <a href="#" className="text-accent-blue underline">Privacy Policy</a> and <a href="#" className="text-accent-blue underline">Terms of Service</a>.
                      </label>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                      <button type="submit" className="bg-accent-blue text-white px-6 py-2 rounded-lg font-medium shadow" disabled={fetchLoading}>{fetchLoading ? 'Searching...' : 'Search Documents'}</button>
                      <button type="reset" className="bg-white border border-card-shadow text-main px-6 py-2 rounded-lg font-medium shadow" onClick={() => setFetchForm({ owner_name: '', survey_number: '',  village_area: '', state: '' })}>Clear</button>
                    </div>
                  </form>
                  {/* Results */}
                  <div className="mt-8">
                    {fetchError && <div className="text-red-600 text-center mb-4">{fetchError}</div>}
                    {fetchResults.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border rounded-lg">
                          <thead>
                            <tr className="bg-gray-100">
                              
                              <th className="px-4 py-2 text-left font-semibold">Owner Name</th>
                              <th className="px-4 py-2 text-left font-semibold">Survey Number</th>
                              <th className="px-4 py-2 text-left font-semibold">Village / Area</th>
                              <th className="px-4 py-2 text-left font-semibold">State</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fetchResults.map((doc, i) => (
                              <tr key={i} className="border-b last:border-b-0">
                                <td className="px-4 py-2">{doc.survey_number}</td>
                                <td className="px-4 py-2">{doc.owner_name}</td>
                                <td className="px-4 py-2">{doc.village_area}</td>
                                <td className="px-4 py-2">{doc.state}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {fetchResults.length === 0 && !fetchLoading && !fetchError && (
                      <div className="text-center text-muted-foreground">No results to display.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : selectedMenu === "vault" ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-main">eProp Vault</h2>
              <form onSubmit={handleUpload} className="flex items-center gap-4 mb-8">
                <input ref={fileInputRef} type="file" className="bg-white rounded-lg p-2 border border-card-shadow" />
                <button type="submit" className="accent-bg px-4 py-2 rounded-lg font-medium">Upload</button>
              </form>
              <div className="space-y-6">
                {vaultDocs.length === 0 && <div className="text-muted-foreground">No documents uploaded yet.</div>}
                {vaultDocs.map((doc, idx) => (
                  <Card key={idx} className="flex flex-col md:flex-row items-center justify-between p-4 bg-blue-light">
                    <div>
                      <div className="font-semibold text-main">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">Uploaded: {doc.uploaded}</div>
                    </div>
                    {unlockedDocs.includes(idx) ? (
                      <a
                        href={doc.data as string}
                        download={doc.name}
                        className="accent-bg px-4 py-2 rounded-lg font-medium mt-2 md:mt-0"
                      >
                        Download
                      </a>
                    ) : (
                      <button
                        className="mint-bg px-4 py-2 rounded-lg font-medium mt-2 md:mt-0"
                        onClick={() => setShowUnlock(idx)}
                      >
                        Unlock
                      </button>
                    )}
                    {showUnlock === idx && (
                      <div className="mt-2 flex gap-2 items-center">
                        <input
                          type="password"
                          className="bg-white border border-card-shadow rounded-lg px-2 py-1"
                          value={unlockPwd}
                          onChange={e => setUnlockPwd(e.target.value)}
                          placeholder="Enter password"
                        />
                        <button
                          className="accent-bg px-3 py-1 rounded-lg font-medium"
                          onClick={() => handleUnlock(idx)}
                          type="button"
                        >
                          Unlock
                        </button>
                        <button
                          className="text-sm text-muted-foreground ml-2"
                          onClick={() => setShowUnlock(null)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : selectedMenu === "map" ? (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-main">Property Risk Map</h2>
                <p className="text-muted-foreground">Visualize property locations and their risk levels across India</p>
              </div>
              <PropertyMap height="600px" showLegend={true} />
            </div>
          ) : selectedMenu === "new-verification" ? (
            <NewVerification minimal />
          ) : selectedMenu === "reports" ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-main">My Property Reports</h2>
              {/* Mock property reports data */}
              {mockReports.map((report) => (
                <Card key={report.id} className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-main mb-1">{report.propertyName}</h3>
                        <div className="text-sm text-muted-foreground mb-1">{report.address}</div>
                        <div className="flex gap-2 items-center">
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            report.overallRisk === 'high' ? 'bg-red-500' : report.overallRisk === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                          }`}></span>
                          <span className={`font-semibold ${
                            report.overallRisk === 'high' ? 'text-red-600' : report.overallRisk === 'medium' ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {report.overallRisk === 'high' ? 'High Risk' : report.overallRisk === 'medium' ? 'Medium Risk' : 'Safe'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className="text-xs text-muted-foreground">Last checked: {report.lastChecked}</span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border rounded-lg">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left font-semibold">Document</th>
                            <th className="px-4 py-2 text-left font-semibold">Status</th>
                            <th className="px-4 py-2 text-left font-semibold">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.documents.map((doc, i) => (
                            <tr key={i} className="border-b last:border-b-0">
                              <td className="px-4 py-2 font-medium text-main">{doc.name}</td>
                              <td className="px-4 py-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                                  doc.risk === 'high' ? 'bg-red-100 text-red-700' : doc.risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {doc.risk === 'high' ? 'High Risk' : doc.risk === 'medium' ? 'Medium Risk' : 'Safe'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">{doc.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {mockReports.length === 0 && (
                <div className="text-center text-muted-foreground py-12">No reports found. Search for properties to generate reports.</div>
              )}
            </div>
          ) : selectedMenu === "legal" ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-main">Legal Case Status (Litigation Check)</h2>
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-accent-blue rounded">
                <div className="mb-2"><span className="font-semibold text-main">Purpose:</span> Identifies if the property or owner is involved in active court cases or disputes.</div>
                <div className="mb-2"><span className="font-semibold text-main">Source:</span> <a href="https://ecourts.gov.in/" target="_blank" rel="noopener noreferrer" className="text-accent-blue underline">ecourts.gov.in (National Judicial Data Grid)</a>, High Court portals.</div>
                <div><span className="font-semibold text-main">Legal Check:</span> Helps avoid disputed properties that may be under litigation.</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-main">Litigation Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">Property/Owner</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                      <th className="px-4 py-2 text-left font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLegalChecks.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2 font-medium text-main">{item.name}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                            item.status === 'No Cases' ? 'bg-green-100 text-green-700' : item.status === 'Active Case' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{item.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedMenu === "zoning" ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-main">Zoning / City Development Plan (CDP) & Green Zone Validation</h2>
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <div className="mb-2"><span className="font-semibold text-main">Purpose:</span> Checks if land falls under restricted use like green belts, forest areas, or city-planned zones.</div>
                <div className="mb-2"><span className="font-semibold text-main">Source:</span> BDA (Bangalore), HMDA (Hyderabad), NGT, Forest Dept Maps.</div>
                <div><span className="font-semibold text-main">Legal Check:</span> Verifies compliance with urban planning and environmental laws.</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-main">Zoning Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-semibold">Property</th>
                      <th className="px-4 py-2 text-left font-semibold">Zoning Status</th>
                      <th className="px-4 py-2 text-left font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockZoningChecks.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-4 py-2 font-medium text-main">{item.name}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                            item.status === 'Compliant' ? 'bg-green-100 text-green-700' : item.status === 'Restricted' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{item.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : selectedMenu === "profile" ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-main">Profile</h2>
              <Card className="mb-8 p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg border border-card-shadow">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={getAvatarUrl(user?.username || user?.email || '')} />
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-semibold text-main">{user?.username || 'User'}</span>
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold ml-2">Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email || 'user@email.com'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{getGenderFromName(user?.username || '') === 'male' ? 'Male' : getGenderFromName(user?.username || '') === 'female' ? 'Female' : 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since: 2023-01-01</span>
                  </div>
                </div>
              </Card>
              <Card className="mb-8 p-6">
                <h3 className="text-lg font-semibold mb-4 text-main">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Username</div>
                    <div className="font-medium text-main">{user?.username || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Email</div>
                    <div className="font-medium text-main">{user?.email || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Phone</div>
                    <div className="font-medium text-main">+91 98765 43210</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Address</div>
                    <div className="font-medium text-main">Bangalore, India</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Gender</div>
                    <div className="font-medium text-main">{getGenderFromName(user?.username || '') === 'male' ? 'Male' : getGenderFromName(user?.username || '') === 'female' ? 'Female' : 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">User ID</div>
                    <div className="font-medium text-main">{user?.id || 'N/A'}</div>
                  </div>
                </div>
              </Card>
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                <button className="flex items-center gap-2 px-4 py-2 rounded bg-accent-blue text-white font-semibold shadow hover:bg-accent-blue/90 transition">
                  <Edit2 className="h-4 w-4" /> Edit Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-main font-semibold shadow hover:bg-gray-200 transition">
                  <KeyRound className="h-4 w-4" /> Change Password
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          ) : selectedMenu === "help" ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-main">Help & Support</h2>
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-accent-blue rounded">
                <div className="text-lg font-semibold mb-1">How can we help you?</div>
                <div className="text-sm text-muted-foreground">Find answers to common questions or contact our support team for assistance.</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-main">Frequently Asked Questions</h3>
              <ul className="mb-8 space-y-3">
                <li><span className="font-medium text-main">What is property verification?</span><br /><span className="text-sm text-muted-foreground">Property verification is the process of checking the legal, zoning, and ownership status of a property to ensure it is safe for purchase or investment.</span></li>
                <li><span className="font-medium text-main">How do I upload my documents?</span><br /><span className="text-sm text-muted-foreground">Go to the eProp Vault section and use the upload button to securely add your property documents.</span></li>
                <li><span className="font-medium text-main">How do I check the status of my property?</span><br /><span className="text-sm text-muted-foreground">Use the dashboard or reports section to view the verification and risk status of your properties.</span></li>
                <li><span className="font-medium text-main">Who can I contact for legal help?</span><br /><span className="text-sm text-muted-foreground">You can reach out to our support team or consult a legal expert for property-related legal queries.</span></li>
                <li><span className="font-medium text-main">How do I reset my password?</span><br /><span className="text-sm text-muted-foreground">Go to your profile page and click on 'Change Password' to reset your password securely.</span></li>
              </ul>
              <h3 className="text-lg font-semibold mb-3 text-main">Contact Support</h3>
              <div className="mb-8 space-y-2">
                <div><span className="font-medium text-main">Email:</span> <a href="mailto:support@nalindia.com" className="text-accent-blue underline">support@nalindia.com</a></div>
                <div><span className="font-medium text-main">Phone:</span> <a href="tel:+919876543210" className="text-accent-blue underline">+91 98765 43210</a></div>
                <div><span className="font-medium text-main">Live Chat:</span> <span className="text-muted-foreground">Coming soon</span></div>
                <div><span className="font-medium text-main">Office Hours:</span> Mon-Fri, 9:00 AM - 6:00 PM IST</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-main">Resources</h3>
              <ul className="mb-8 space-y-2">
                <li><a href="#" className="text-accent-blue underline">User Guide</a></li>
                <li><a href="#" className="text-accent-blue underline">Terms of Service</a></li>
                <li><a href="#" className="text-accent-blue underline">Privacy Policy</a></li>
              </ul>
              <div className="p-4 bg-gray-50 rounded border text-center">
                <span className="font-medium text-main">Have feedback or need more help?</span><br />
                <span className="text-sm text-muted-foreground">Let us know and we’ll be happy to assist you!</span>
              </div>
            </div>
          ) : (
            <>
              {/* Welcome */}
              <div className="mb-6">
                <Card className="p-6 rounded-2xl shadow bg-blue-light flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2">
                      Welcome back, {user?.email || "User"}! <span className="text-2xl">👋</span>
                    </h2>
                    <p className="text-main text-base">Let's continue securing your property investments with AI-powered verification.</p>
                  </div>
                </Card>
              </div>
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                  <Card key={stat.label} className={`rounded-2xl p-6 flex flex-col items-start gap-2 shadow ${i === 0 ? 'bg-blue-light border-l-8 border-accent-blue' : i === 1 ? 'bg-mint-light border-l-8 border-accent-mint' : i === 2 ? 'bg-purple-light border-l-8 border-accent-purple' : 'bg-white border-l-8 border-accent-orange'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <stat.icon className={`h-6 w-6 ${i === 0 ? 'text-accent-blue' : i === 1 ? 'text-accent-mint' : i === 2 ? 'text-accent-purple' : 'text-accent-orange'}`} />
                      <span className="text-lg font-semibold text-main">{stat.label}</span>
                    </div>
                    <div className="text-3xl font-bold text-main">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.sub}</div>
                  </Card>
                ))}
              </div>


              {/* Property Overview Bar Chart */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-main">Property Overview</h3>
                <div className="bg-white rounded-2xl shadow-lg border border-card-shadow p-6">
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart
                      data={propertyOverviewData}
                      margin={{ top: 24, right: 32, left: 8, bottom: 8 }}
                      barCategoryGap={"20%"}
                      barGap={6}
                    >
                      <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" className="text-base" tick={{ fontSize: 15, fill: '#374151' }} axisLine={false} tickLine={false} />
                      <YAxis className="text-base" tick={{ fontSize: 15, fill: '#374151' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, fontSize: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                        labelStyle={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}
                        itemStyle={{ fontSize: 15, color: '#2563eb' }}
                        cursor={{ fill: '#f3f4f6', opacity: 0.7 }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 15, paddingTop: 8 }}
                        iconType="circle"
                        align="left"
                        verticalAlign="top"
                        height={36}
                      />
                      <Bar dataKey="searched" name="Searched" fill="#2563eb" radius={[8, 8, 0, 0]} barSize={32} />
                      <Bar dataKey="verified" name="Verified" fill="#10b981" radius={[8, 8, 0, 0]} barSize={32} />
                      <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={32} />
                      <Bar dataKey="mediumRisk" name="Medium Risk" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Property Search */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-main">Recent Property Search</h3>
                <div className="space-y-2">
                  {mockReports.slice(0, 3).map((report) => (
                    <Card key={report.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-main">{report.propertyName}</div>
                        <div className="text-xs text-muted-foreground">{report.address}</div>
                      </div>
                      <div className="flex gap-2 items-center mt-2 md:mt-0">
                        <span className={`inline-block w-3 h-3 rounded-full ${
                          report.overallRisk === 'high' ? 'bg-red-500' : report.overallRisk === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`}></span>
                        <span className={`font-semibold text-xs ${
                          report.overallRisk === 'high' ? 'text-red-600' : report.overallRisk === 'medium' ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {report.overallRisk === 'high' ? 'High Risk' : report.overallRisk === 'medium' ? 'Medium Risk' : 'Safe'}
                        </span>
                      </div>
                    </Card>
                  ))}
                  {mockReports.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">No recent searches.</div>
                  )}
                </div>
              </div>

              {/* AI Suggested Properties (Already Verified) */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-main">AI Suggested Properties (Verified)</h3>
                <div className="space-y-2">
                  {aiSuggestedProperties.map((prop, i) => (
                    <Card key={i} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-main">{prop.propertyName}</div>
                        <div className="text-xs text-muted-foreground">{prop.address}</div>
                      </div>
                      <div className="flex gap-2 items-center mt-2 md:mt-0">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="font-semibold text-xs text-green-600">Verified</span>
                      </div>
                    </Card>
                  ))}
                  {aiSuggestedProperties.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">No suggestions at this time.</div>
                  )}
                </div>
              </div>
              
              {/* Ongoing Verifications */}
              <h3 className="text-lg font-semibold mb-4 text-main">Ongoing Verifications</h3>
              <div className="space-y-4">
                {ongoing.map((item, i) => (
                  <Card key={item.id} className={i % 3 === 0 ? "p-4 flex items-center justify-between rounded-xl bg-blue-light shadow" : i % 3 === 1 ? "p-4 flex items-center justify-between rounded-xl bg-mint-light shadow" : "p-4 flex items-center justify-between rounded-xl bg-purple-light shadow"}>
                    <div className="font-medium text-main">{item.title}</div>
                    <Badge variant="secondary" className={i % 2 === 0 ? "bg-accent-blue text-white" : "bg-accent-mint text-white"}>{item.status}</Badge>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
        </div>
      </div>
    </div>
  );
}