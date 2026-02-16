import { formatDateTime, formatDate, formatTime, formatRelativeTime } from '../utils/dateFormat.js';

export default function useDateFormat() {
    return {
        formatDateTime,
        formatDate,
        formatTime,
        formatRelativeTime
    };
}