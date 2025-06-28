// Status color mapping like Jira
const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase();
  if (statusLower?.includes('pending') || statusLower?.includes('moved')) {
    return { bg: '#DDD6FE', color: '#5B21B6', border: '#8B5CF6' }; // Purple
  }
  if (statusLower?.includes('rejected') || statusLower?.includes('no show')) {
    return { bg: '#FEE2E2', color: '#DC2626', border: '#F87171' }; // Red
  }
  if (statusLower?.includes('selected') || statusLower?.includes('recommended')) {
    return { bg: '#D1FAE5', color: '#059669', border: '#34D399' }; // Green
  }
  if (statusLower?.includes('created') || statusLower?.includes('assigned')) {
    return { bg: '#DBEAFE', color: '#2563EB', border: '#60A5FA' }; // Blue
  }
  return { bg: '#F3F4F6', color: '#374151', border: '#9CA3AF' }; // Gray
};
export default getStatusColor;