export default function dbTimeForHuman(str) {
    if (!str) return '';
    return str.replace('T', ' ').substring(0, 16);
}