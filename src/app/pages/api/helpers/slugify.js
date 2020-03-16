const convertToSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,"")
        .replace(/ +/g,"-");
};

export default convertToSlug;