export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };