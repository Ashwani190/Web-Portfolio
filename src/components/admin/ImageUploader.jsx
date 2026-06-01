import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { getStorageUrl } from '../../lib/helpers';
import toast from 'react-hot-toast';

const ImageUploader = ({ value, onChange, bucket = 'portfolio-assets', path = 'uploads', label = 'Upload Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      setProgress(10);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setProgress(30);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(80);

      // Get public URL
      const publicUrl = getStorageUrl(bucket, filePath);
      
      setProgress(100);
      toast.success('Image uploaded successfully');
      
      // Pass URL up to parent
      onChange(publicUrl);
    } catch (error) {
      toast.error(error.message || 'Error uploading image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-body font-medium text-cocoa block">
        {label}
      </label>

      {value ? (
        // Preview State
        <div className="relative rounded-xl overflow-hidden border border-canvas bg-canvas/10 max-w-md group">
          <img 
            src={value} 
            alt="Uploaded preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-cocoa/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
          {/* Success indicator */}
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-sm">
            <CheckCircle2 size={16} />
          </div>
        </div>
      ) : (
        // Upload State
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors max-w-md
                     ${uploading 
                       ? 'border-ember/50 bg-ember/5 pointer-events-none' 
                       : 'border-canvas hover:border-ember hover:bg-canvas/10 bg-canvas/5'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*"
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center gap-3">
            {uploading ? (
              <>
                <div className="w-10 h-10 border-4 border-ember/30 border-t-ember rounded-full animate-spin" />
                <div className="text-sm font-body text-timber font-medium">
                  Uploading... {progress}%
                </div>
                {/* Progress bar */}
                <div className="w-full max-w-[200px] h-1.5 bg-canvas/30 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-ember transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-canvas/30 text-timber flex items-center justify-center mb-1">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-cocoa">Click to upload image</p>
                  <p className="text-xs font-body text-burlap mt-1">SVG, PNG, JPG or GIF (max 5MB)</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
