import { useState } from 'react';
import { usePrescriptionsStore, useAuthStore } from '../store/index.js';
import { useToast } from '../components/common/Toast';
import { isValidFileType, isValidFileSize } from '../utils/helpers.js';
import { Upload, X } from 'lucide-react';

const UploadPrescription = () => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const { uploadPrescription, prescriptions } = usePrescriptionsStore();
  const { isLoggedIn } = useAuthStore();
  const { addToast } = useToast();

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-3 py-8 text-center sm:px-4 sm:py-12">
        <p className="mb-4 text-lg text-gray-600 sm:text-xl">Please login to upload prescriptions</p>
      </div>
    );
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxFileSize = 5; // MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = [...e.dataTransfer.files];
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = [...e.target.files];
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    newFiles.forEach(file => {
      // Validate file type
      if (!isValidFileType(file, allowedTypes)) {
        addToast(`Invalid file type: ${file.name}. Only JPG, PNG, PDF allowed.`, 'error');
        return;
      }

      // Validate file size
      if (!isValidFileSize(file, maxFileSize)) {
        addToast(`File too large: ${file.name}. Max ${maxFileSize}MB allowed.`, 'error');
        return;
      }

      // Add file
      const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      };

      setFiles(prev => [...prev, fileData]);
      addToast(`${file.name} added`, 'success');
    });
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      addToast('Please select at least one file', 'error');
      return;
    }

    files.forEach(fileData => {
      uploadPrescription({
        fileName: fileData.name,
        fileType: fileData.type,
      });
    });

    setFiles([]);
    addToast('Prescription(s) uploaded successfully!', 'success');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">Upload Prescription</h1>
        <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base">Upload your doctor's prescription to use medicines marked as prescription-required</p>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-6 text-center transition sm:p-12 ${
                dragActive
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300 bg-white hover:border-primary-600'
              }`}
            >
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">Drag and drop your files</h3>
              <p className="text-gray-600 mb-4">or</p>
              <label className="btn-primary inline-block cursor-pointer">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-600 mt-4">
                Supported formats: JPG, PNG, PDF (Max 5MB per file)
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-5 rounded-lg bg-white p-4 shadow sm:mt-6 sm:p-6">
                <h3 className="font-semibold mb-4">Selected Files ({files.length})</h3>
                <div className="space-y-3">
                  {files.map(file => (
                    <div key={file.id} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                          {file.type === 'application/pdf' ? 'PDF' : 'IMG'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">{file.name}</p>
                          <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="ml-1 shrink-0 text-danger-600 hover:text-danger-700 sm:ml-4"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  className="btn-primary w-full mt-4"
                >
                  Upload {files.length} File{files.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow sm:p-6">
              <h3 className="font-semibold mb-4">Upload Guidelines</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>Clear and legible scans/photos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>Doctor's name and clinic stamp</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>Valid for 3 months</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary-600">✓</span>
                  <span>Patient name must match account</span>
                </li>
              </ul>

              <h3 className="font-semibold mt-8 mb-4">Your Prescriptions</h3>
              <div className="space-y-3">
                {prescriptions.length > 0 ? (
                  prescriptions.map(prescription => (
                    <div key={prescription.id} className="border rounded p-3">
                      <p className="text-sm font-semibold truncate">{prescription.fileName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600">{prescription.uploadedAt}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          prescription.status === 'Approved'
                            ? 'bg-success-100 text-success-800'
                            : prescription.status === 'Rejected'
                            ? 'bg-danger-100 text-danger-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {prescription.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No prescriptions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPrescription;
