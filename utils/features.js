import DataURIParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    const parser = new DataURIParser();
    // const extName = file.originalname.split(".").pop();
    const extName = path.extname(file.originalname).toString(); // (.png, .jpg, .jpeg, .gif, .bmp, .webp, .svg, .tiff, .ico, .jfif, .pjpeg, .pjp, .avif, .apng, .x-icon, .)
    return parser.format(extName, file.buffer);
}

export default getDataUri;