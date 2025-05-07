export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  export const toISODateString = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };