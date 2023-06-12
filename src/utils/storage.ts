export function getLocal(key: string) {
    const item = window.localStorage.getItem(key);

    if (item) {
        return JSON.parse(item);
    }

    return null;
}

export function setLocal(key: string, value: any): void {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocal(key: string): void {
    window.localStorage.removeItem(key);
}

export function clearLocal(): void {
    window.localStorage.clear();
}
