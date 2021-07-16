export const fileExtention = (base64: any) => {
    const mytype = base64.match(/[^:/]\w+(?=;|,)/)[0];
    return mytype;
};

export const requiredExtentions = (type: string): Boolean => {
    const ext = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'mp4', 'MP4'];
    if (!ext.includes(type)) return false;
    return true;
};
