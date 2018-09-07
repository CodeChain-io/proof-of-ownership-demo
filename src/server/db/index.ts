const db: string[] = [];

export async function getAll(): Promise<string[]> {
    return db;
}

export async function save(value: string): Promise<void> {
    db.push(value);
}

export async function exist(value: string): Promise<boolean> {
    for (const data of db) {
        if (data === value) {
            return true;
        }
    }
    return false;
}

export async function remove(value: string): Promise<void> {
    const index = db.indexOf(value);
    if (index === -1) {
        return;
    }
    db.splice(index, 1);

    return;
}
