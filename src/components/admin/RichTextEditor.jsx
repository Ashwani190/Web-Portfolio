import MDEditor from '@uiw/react-md-editor';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  // Check if user prefers dark mode, though our admin panel defaults to light/warm theme for content area
  // The editor takes a data-color-mode prop. We'll force it to light mode to match the admin panel background.
  
  return (
    <div data-color-mode="light" className="w-full">
      <MDEditor
        value={value}
        onChange={onChange}
        height={400}
        preview="live"
        hideToolbar={false}
        className="w-md-editor font-body"
        textareaProps={{
          placeholder: placeholder || 'Write your content here in Markdown...',
        }}
        previewOptions={{
          className: 'prose prose-sm max-w-none font-body',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
