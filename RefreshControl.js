import { useState } from 'react';

const useRefreshControl = (resetFields) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Reset the input fields
    resetFields();
    // Add any logic here to fetch fresh data or reset the form fields
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return { refreshing, onRefresh };
};

export default useRefreshControl;
