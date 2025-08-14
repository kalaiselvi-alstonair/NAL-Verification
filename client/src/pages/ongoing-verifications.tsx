import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Download, Eye, FileText } from "lucide-react";

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
  const match = url.match(/(\?|&)id=(\d+)/) || url.match(/\/ongoing-verifications\/(\d+)/);
  if (match) {
    return match[2] || match[1];
  }
  const parts = url.split("/");
  const last = parts[parts.length - 1];
  return last && !isNaN(Number(last)) ? last : null;
}

function getMimeType(filename: string | undefined, base64String?: string) {
  // Check base64 content first for accurate MIME detection
  if (base64String) {
    const cleanBase64 = base64String.replace(/\s/g, '').split(',').pop() || '';
    if (cleanBase64.startsWith('JVBERi0')) return 'application/pdf'; // PDF signature
    if (cleanBase64.startsWith('/9j/')) return 'image/jpeg'; // JPEG signature
    if (cleanBase64.startsWith('iVBOR')) return 'image/png'; // PNG signature
    if (cleanBase64.startsWith('R0lGOD')) return 'image/gif'; // GIF signature
  }
  
  // Fallback to filename extension
  if (!filename) return "application/pdf";
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (['jpg', 'jpeg'].includes(ext || '')) return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  
  // Default to PDF for certificate-related documents
  if (filename.toLowerCase().includes('certificate') || filename.toLowerCase().includes('receipt')) {
    return 'application/pdf';
  }
  
  return 'application/pdf';
}

export default function OngoingVerificationDetails() {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{base64: string, mimeType: string, name: string} | null>(null);
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
        } else {
          setError(data.message || 'Failed to fetch property details');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch property details');
        setLoading(false);
      });
  }, [id, statusUpdating]);

  const updateStatus = (newStatus: string) => {
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
          setProperty((prev: any) => ({ ...prev, status: newStatus }));
        } else {
          alert(data.message || 'Failed to update status');
        }
      })
      .catch(() => {
        setStatusUpdating(false);
        alert('Failed to update status');
      });
  };

  function handleView(base64Data: string, fileName: string) {
    try {
      // Debug: Log initial data
      console.log('🔍 Debug - Initial data:', {
        fileName,
        base64Preview: base64Data?.substring(0, 50),
        base64Length: base64Data?.length,
        hasDataPrefix: base64Data?.startsWith('data:'),
        base64End: base64Data?.substring(base64Data.length - 20)
      });
      
      // Log the actual base64 content for inspection
      console.log('📄 Full base64 sample (first 200 chars):', base64Data?.substring(0, 200));
      console.log('📄 Base64 signature check:', {
        startsWithJVBER: base64Data?.startsWith('JVBERi0'),
        startsWithData: base64Data?.startsWith('data:'),
        firstChars: base64Data?.substring(0, 20)
      });

      // Validate base64 data
      if (!base64Data || base64Data.trim() === '') {
        alert('Document data is empty or invalid.');
        return;
      }

      // Handle data URL prefix (remove if present)
      let cleanBase64 = base64Data;
      if (base64Data.startsWith('data:')) {
        cleanBase64 = base64Data.split(',')[1] || base64Data;
        console.log('📝 Stripped data URL prefix');
      }

      // Clean base64 data (remove whitespace/newlines)
      cleanBase64 = cleanBase64.replace(/\s/g, '');
      
      // Validate base64 format
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleanBase64)) {
        console.error('❌ Invalid base64 format');
        alert('Document data format is invalid. Please try downloading instead.');
        return;
      }

      // Detect MIME type from base64 content and filename
      const detectedMimeType = getMimeType(fileName, cleanBase64);
      
      // Additional validation for PDF
      const isPDF = cleanBase64.startsWith('JVBERi0');
      const finalMimeType = isPDF ? 'application/pdf' : detectedMimeType;
      
      console.log('🎯 Document analysis:', {
        fileName,
        detectedMimeType,
        finalMimeType,
        isPDF,
        base64Signature: cleanBase64.substring(0, 10),
        base64Length: cleanBase64.length
      });

      // Method 1: Create blob and open in new tab (most reliable)
      try {
        const byteCharacters = atob(cleanBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: finalMimeType });
        const blobUrl = URL.createObjectURL(blob);
        
        console.log('✅ Blob created successfully, trying multiple viewing methods');
        
        // Method 1: Try opening in new tab with blob URL
        const newWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
          // Create a custom HTML page with embedded PDF viewer
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Document Viewer - ${fileName}</title>
                <meta charset="utf-8">
                <style>
                  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }
                  .container { max-width: 100%; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                  .header { background: #333; color: white; padding: 15px; text-align: center; }
                  .viewer { width: 100%; height: calc(100vh - 100px); border: none; }
                  .fallback { padding: 40px; text-align: center; }
                  .btn { display: inline-block; padding: 10px 20px; background: #007cba; color: white; text-decoration: none; border-radius: 4px; margin: 10px; }
                  .error { color: #d32f2f; margin: 20px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h3>📄 ${fileName}</h3>
                    <p>Document Viewer</p>
                  </div>
                  <iframe src="${blobUrl}" class="viewer" title="Document Viewer">
                    <div class="fallback">
                      <h3>Unable to display document inline</h3>
                      <p class="error">Your browser doesn't support inline PDF viewing.</p>
                      <a href="${blobUrl}" class="btn" download="${fileName}">📥 Download Document</a>
                      <a href="${blobUrl}" class="btn" target="_blank">🔗 Open in New Tab</a>
                    </div>
                  </iframe>
                </div>
                <script>
                  // Add error handling for iframe
                  const iframe = document.querySelector('.viewer');
                  iframe.onerror = function() {
                    console.error('PDF failed to load in iframe');
                    iframe.style.display = 'none';
                    document.querySelector('.fallback').style.display = 'block';
                  };
                  
                  // Timeout fallback
                  setTimeout(function() {
                    if (!iframe.contentDocument && !iframe.contentWindow) {
                      console.log('PDF may not have loaded, showing fallback options');
                    }
                  }, 3000);
                </script>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          console.log('🚫 Popup blocked, trying fallback download');
          // Fallback: trigger download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName || `document.${finalMimeType === 'application/pdf' ? 'pdf' : 'doc'}`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        // Clean up blob URL after delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          console.log('🧹 Blob URL cleaned up');
        }, 5000);
        
      } catch (blobError) {
        console.error('❌ Blob creation failed:', blobError);
        
        // Method 2: Fallback to data URL
        const dataUrl = `data:${finalMimeType};base64,${cleanBase64}`;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName || `document.${finalMimeType === 'application/pdf' ? 'pdf' : 'doc'}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('📥 Fallback: Data URL download triggered');
      }
      
    } catch (error) {
      console.error('💥 Critical error in handleView:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to open document: ${errorMessage}. Please try downloading it instead.`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8 mt-8">
      <button
        className="mb-6 px-4 py-2 rounded bg-gray-200 text-main font-semibold hover:bg-gray-300 transition"
        style={{ minWidth: 120 }}
        onClick={() => setLocation('/verifier-dashboard')}
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold mb-4 text-main">Ongoing Verification Details</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && property && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Property & Owner Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Owner Name:</span> {property.owner_name}</div>
              <div><span className="font-medium">Property Type:</span> {property.property_type}</div>
              <div><span className="font-medium">State:</span> {property.state}</div>
              <div><span className="font-medium">District:</span> {property.district}</div>
              <div><span className="font-medium">Taluk:</span> {property.taluk}</div>
              <div><span className="font-medium">KMC Area:</span> {property.kmc_area}</div>
              <div><span className="font-medium">Ownership Type:</span> {property.ownership_type}</div>
              <div><span className="font-medium">Notes:</span> {property.notes || <span className="text-gray-400">None</span>}</div>
              <div><span className="font-medium">Submitted:</span> {property.created_at}</div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[property.status] || 'bg-gray-200 text-gray-700'}`}>{STATUS_LABELS[property.status] || property.status}</span>
              </div>
            </div>
            {/* Removed Approve, Reject, and Flag buttons */}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
            <div className="space-y-4">
              {documentFields.filter((docType: any) => property[docType.key]).map((docType: any) => {
                const fileName = property[docType.nameKey] || `${docType.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${property.id}.pdf`;
                const mimeType = getMimeType(fileName, property[docType.key]);
                return (
                  <div key={docType.key} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{docType.label}</h4>
                          <p className="text-sm text-gray-600">{fileName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`data:${mimeType};base64,${property[docType.key]}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                          download={fileName}
                          rel="noopener noreferrer"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                          onClick={() => handleView(property[docType.key], fileName)}
                          title="View document"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Verifier Notes</h5>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Add notes about this document..."
                        defaultValue=""
                      />
                      <button className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition">
                        Add Note
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => setLocation(`/verification-rating?id=${property.id}`)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}