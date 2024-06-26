export function parseUnixTimestamp(created: number): string {
    const now = new Date(); 
    const createdDate = new Date(created * 1000); 
    const diffInMs = now.getTime() - createdDate.getTime(); 
  
    const seconds = Math.floor(diffInMs / 1000); 
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60); 
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4); 
    const years = Math.floor(months / 12);
  
    if (years > 0) {
        return years === 1 ? "1y ago" : `${years}y ago`;
    } else if (months > 0) {
        return months === 1 ? "1mo ago" : `${months}mo ago`;
    } else if (weeks > 0) {
        return weeks === 1 ? "1w ago" : `${weeks}w ago`;
    } else if (days > 0) {
        return days === 1 ? "1d ago" : `${days}d ago`;
    } else if (hours > 0) {
        return hours === 1 ? "1h ago" : `${hours}h ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? "1m ago" : `${minutes}m ago`;
    } else {
        return "Just Now";
    }
}