// QRCodeComponent.js
import React from 'react';
import QRCode from 'qrcode.react';

const qrCodeComponent = ({ value }) => {
  return (
    <div>
      {value ? (
        <QRCode value={value} size={256} /> // You can adjust the size as needed
      ) : (
        <p>No QR Code to display</p>
      )}
    </div>
  );
};

export default qrCodeComponent;
