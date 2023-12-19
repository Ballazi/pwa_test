import { useRef } from 'react';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

export const FileUploader = ({ handleFile }) => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    event.preventDefault();
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };
  return (
    <>
      <button
        className="button-upload"
        onClick={handleClick}
        style={{
          border: 'none',
          borderTopRightRadius: '5px',
          cursor: 'pointer',
          background: '#e6e6e6',
        }}
      >
        <FileUploadOutlinedIcon />
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: 'none', borderTopRightRadius: '5px' }} // Make the file input element invisible
      />
    </>
  );
};
