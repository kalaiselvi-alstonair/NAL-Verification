import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";

const documentFields = [
  { key: 'encumbrance_certificate', nameKey: 'encumbrance_certificate_name', label: 'Encumbrance Certificate (EC)' },
  { key: 'tax_paid_receipt', nameKey: 'tax_paid_receipt_name', label: 'Tax Paid Receipt' },
  { key: 'occupancy_certificate', nameKey: 'occupancy_certificate_name', label: 'Occupancy Certificate (OC)' },
  { key: 'sanctioned_building_plan', nameKey: 'sanctioned_building_plan_name', label: 'Sanctioned Building Plan' },
  { key: 'zoning_certificate', nameKey: 'zoning_certificate_name', label: 'Zoning Certificate (CDP/Green Zone)' },
  { key: 'khata_certificate', nameKey: 'khata_certificate_name', label: 'Khata Certificate & Extract' },
  { key: 'betterment_charges_receipt', nameKey: 'betterment_charges_receipt_name', label: 'Betterment Charges Receipt' },
  { key: 'allotment_letter', nameKey: 'allotment_letter_name', label: 'Allotment Letter' },
  { key: 'possession_certificate', nameKey: 'possession_certificate_name', label: 'Possession Certificate' },
  { key: 'noc_bda', nameKey: 'noc_bda_name', label: 'NOC from BDA' },
  { key: 'bmrda_approval_letter', nameKey: 'bmrda_approval_letter_name', label: 'BMRDA Approval Letter' },
  { key: 'layout_plan_approval_certificate', nameKey: 'layout_plan_approval_certificate_name', label: 'Layout Plan Approval Certificate' },
  { key: 'noc_pollution_control_board', nameKey: 'noc_pollution_control_board_name', label: 'NOC from Pollution Control Board' },
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  flagged: 'Flagged',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-200 text-yellow-800',
  approved: 'bg-green-200 text-green-800',
  rejected: 'bg-red-200 text-red-800',
  flagged: 'bg-orange-200 text-orange-800',
};

function getIdFromUrl() {
  const url = window.location.pathname + window.location.search;
  const match = url.match(/(\?|&)id=(\d+)/) || url.match(/\/verification-rating\/(\d+)/);
  if (match) {
    return match[2] || match[1];
  }
  const parts = url.split("/");
  const last = parts[parts.length - 1];
  return last && !isNaN(Number(last)) ? last : null;
}

export default function VerificationRating() {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [status, setStatus] = useState<string>('pending');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const id = getIdFromUrl();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!id) {
      setError("No property ID specified in URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost/ProfessionalWebPortal/server/php/get_property_details.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProperty(data.data);
          setStatus(data.data.status || 'pending');
        } else {
          setError(data.message || 'Failed to fetch property details');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch property details');
        setLoading(false);
      });
  }, [id]);

  const uploadedDocs = documentFields.filter(docType => property && property[docType.key]);
  const totalDocs = uploadedDocs.length;
  const totalScore = totalDocs > 0 ? Math.round((Object.values(ratings).reduce((a, b) => a + b, 0) / (totalDocs * 5)) * 100) : 0;

  function handleStarClick(docKey: string, star: number) {
    setRatings(prev => ({ ...prev, [docKey]: star }));
  }

  function updateStatus(newStatus: string) {
    if (!id) return;
    setStatusUpdating(true);
    fetch(`http://localhost/ProfessionalWebPortal/server/php/update_property_status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        setStatusUpdating(false);
        if (data.status === 'success') {
          setStatus(newStatus);
          setSuccessMsg('Status updated successfully! Redirecting to My Reports...');
          setTimeout(() => setLocation('/dashboard/my-reports'), 1000);
        } else {
          alert(data.message || 'Failed to update status');
        }
      })
      .catch(() => {
        setStatusUpdating(false);
        alert('Failed to update status');
      });
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8 mt-8">
      <button
        className="mb-6 px-4 py-2 rounded bg-gray-200 text-main font-semibold hover:bg-gray-300 transition"
        style={{ minWidth: 120 }}
        onClick={() => setLocation(`/ongoing-verifications?id=${id}`)}
      >
        ← Back to Details
      </button>
      <h2 className="text-2xl font-bold mb-4 text-main">Document Verification Rating</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {successMsg && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg text-center font-semibold">{successMsg}</div>
      )}
      {property && (
        <>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || 'bg-gray-200 text-gray-700'}`}>{STATUS_LABELS[status] || status}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {uploadedDocs.map(doc => (
              <div key={doc.key} className="flex items-center justify-between border-b pb-2">
                <span>{property[doc.nameKey] || doc.label}</span>
                <span className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${ratings[doc.key] >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => handleStarClick(doc.key, star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-lg font-semibold text-main text-right">
            Total Score: <span className="text-blue-600">{totalScore}%</span>
          </div>
          <div className="mt-8 flex gap-4 justify-end">
            <button
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              disabled={statusUpdating || status === 'approved'}
              onClick={() => updateStatus('approved')}
            >
              Approve
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              disabled={statusUpdating || status === 'rejected'}
              onClick={() => updateStatus('rejected')}
            >
              Reject
            </button>
            <button
              className="px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
              disabled={statusUpdating || status === 'flagged'}
              onClick={() => updateStatus('flagged')}
            >
              Flag
            </button>
          </div>
        </>
      )}
    </div>
  );
} 