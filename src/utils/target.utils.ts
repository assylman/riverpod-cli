export function formattingTarget(target: string) {
    if (target.length > 1) {
        const firstChar = target[0];
        if (firstChar) {
            if (firstChar != '/') {
                return '/' + target;
            }
        }
    }

    return target;
}