const LocationDisplay = ({ latitude, longitude, address, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <button className="close-btn" onClick={onClose}>
          <span className="icon-cross"></span>
          <span className="visually-hidden">X</span>
        </button>
        <div className="location-display">
          <iframe
            title="Location"
            width="100%"
            height="300"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          ></iframe>
        </div>
        <div className="address-details">
          <p>{address}</p>
          <p>{latitude}</p>
          <p>{longitude}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;
