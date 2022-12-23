import React from 'react';
import { Alert } from 'antd';

import './error-indicator.css';

function ErrorIndicator({ description }) {
  return <Alert className="error-message" message="Error" description={description} type="error" showIcon />;
}

export default ErrorIndicator;
