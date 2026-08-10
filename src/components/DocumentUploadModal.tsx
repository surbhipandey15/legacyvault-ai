import React, { useState, useRef } from 'react';
import { VaultDocument } from '../types/index';
import { Upload, X, FileText, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: VaultDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      validateAndSetFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    setErrorMsg('');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(f.type)) {
      setErrorMsg('Invalid file format. Please upload PDF, JPG, or PNG files.');
      return;
    }

    if (f.size > 15 * 1024 * 1024) {
      setErrorMsg('File exceeds 15MB limit.');
      return;
    }

    setFile(f);
    if (!title) {
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a document to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        const res = await fetch('/api/vault/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title || file.name,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileData: base64Data
          })
        });

        const data = await res.json();
        setIsUploading(false);

        if (!res.ok) {
          setErrorMsg(data.error || 'Failed to process document.');
          return;
        }

        onUploadSuccess(data.document);
        onClose();
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMsg('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171C1A]/50 p-4">
      <div className="bg-white border border-[#DDE1DD] rounded-[10px] max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B726E] hover:text-[#171C1A] p-1 rounded hover:bg-[#F7F7F3] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#174C45] font-bold text-lg mb-1">
          <Upload className="w-5 h-5" />
          <span>Upload Record Document</span>
        </div>
        <p className="text-xs text-[#6B726E] font-medium mb-6">
          AI will analyze the file, suggest categorization & extract key renewal metadata for your review.
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-[7px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Dropzone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[7px] p-6 text-center cursor-pointer transition-all ${
              file
                ? 'border-[#174C45] bg-[#EBF0EE]'
                : 'border-[#DDE1DD] bg-[#F7F7F3] hover:border-[#174C45]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center space-x-3 text-left">
                <FileText className="w-8 h-8 text-[#174C45] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#171C1A] truncate max-w-[240px]">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-[#6B726E] font-medium">
                    {(file.size / 1024).toFixed(1)} KB • {file.type}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-[#6B726E] mx-auto mb-2" />
                <div className="text-xs font-bold text-[#171C1A]">
                  Click to select file or drag & drop here
                </div>
                <div className="text-[10px] text-[#6B726E] font-medium mt-1">
                  Supports PDF, JPG, PNG up to 15MB
                </div>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-[#171C1A] mb-1">
              Record Label / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Health Insurance Policy 2026"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] px-3.5 py-2.5 text-xs text-[#171C1A] focus:outline-none focus:border-[#174C45]"
            />
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-[7px] bg-[#F7F7F3] border border-[#DDE1DD] text-[11px] text-[#6B726E] flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#174C45] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#174C45] font-bold">Privacy Guarantee:</strong> Never upload ATM PINs, UPI PINs, passwords, or CVVs. Non-secret structural metadata only.
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-[7px] text-xs font-semibold text-[#6B726E] hover:text-[#171C1A] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-5 py-2.5 rounded-[7px] text-xs font-bold bg-[#174C45] text-white hover:bg-[#123e38] transition-colors flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <span>AI Extracting Details...</span>
              ) : (
                <span>Upload & Review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

