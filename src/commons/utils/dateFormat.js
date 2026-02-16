/**
 * 날짜를 상대 시간으로 포맷 (방금 전, 5분 전, 3시간 전 등)
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // 초 단위 차이

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    // 일주일 이상이면 날짜로 표시
    return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

/**
 * 날짜를 전체 포맷으로 표시 (2024.01.15 14:30)
 */
export const formatDateTime = (dateString) => {
    if (!dateString) {
        return "";
    }

    const formatted = new Date(dateString)
        .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        .replace(/-/g, '.');

    return formatted;
};

/**
 * 날짜만 표시 (2024.01.15)
 */
export const formatDate = (dateString) => {
    if (!dateString) {
        return "";
    }

    return new Date(dateString)
        .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .replace(/-/g, '.');
};

/**
 * 시간만 표시 (14:30)
 */
export const formatTime = (dateString) => {
    if (!dateString) {
        return "";
    }

    return new Date(dateString)
        .toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
        });
};