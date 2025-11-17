import fs from 'fs/promises';
import path from 'path';

/**
 * 递归读取目录下的所有文件
 * @param dir
 * @returns {Promise<unknown[]>}
 */
async function readDirectoryFiles(dir) {
    const dirs = await fs.readdir(dir, {withFileTypes: true});
    const files = await Promise.all(dirs.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? readDirectoryFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}


/**
 * 创建目录，如果目录不存在
 * @param dir
 * @returns {Promise<void>}
 */
async function ensureDirExists(dir) {
    try {
        await fs.mkdir(dir, {recursive: true});
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}

/**
 * JS关键字
 * @type {string[]}
 */
const keywords = [
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
    'for', 'function', 'if', 'import', 'in', 'instanceof', 'new',
    'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
    'var', 'void', 'while', 'with', 'let', 'yield'
];


/**
 * 定义插件
 * @param options
 * @returns {{name: string, config(): Promise<void>}}
 */
export default function createAuto(options = {}) {

    const {
        image, // 默认的图片文件目录
        output, // 输出 JS 文件的路径
        prefix, //import的前缀
        type //需要识别的文件类型
    } = options;


    return {
        name: 'vite-plugin-autoload-image',
        async config() {

            /* 参数不完整，终止代码 */
            if (!image || !output || !prefix || !type) {
                return;
            }

            /* 读取指定目录下的所有文件 */
            const files = await readDirectoryFiles(image);

            /* 过滤出所有的指定类型的文件 */
            const imageFiles = files.filter(file => type.indexOf(path.extname(file)) > -1);

            /* 所有文件的名称 */
            const filesName = [];

            /* 为每个 image 文件生成 import 语句 */
            const imports = imageFiles.map(file => {

                /* 路径判断 */
                const relativePath = prefix + path
                    .relative(path.dirname(image), file)
                    .replace(/\\/g, '/');

                const fileName = path.basename(file, path.extname(file))
                    .replace(/[^0-9a-zA-Z]/g, "_");

                /* 排除js关键字 */
                if (/\d+/.test(fileName) || keywords.indexOf(fileName) > -1 || filesName.indexOf(fileName) > -1) {
                    filesName.push(`_${fileName}`); //记录文件名
                    return `import _${fileName} from '${relativePath}';`;
                } else {
                    filesName.push(fileName); //记录文件名
                    return `import ${fileName} from '${relativePath}';`;
                }
            });


            /* 确保输出文件的目录存在 */
            const outputDir = path.dirname(output);
            await ensureDirExists(outputDir);

            /* 将所有 import 和 export 语句写入到指定的 JS 文件中 */
            const content = imports.join('\n') + "\n\n\n\n\n" + `export default {\n\t${filesName.join(",\n\t")}\n}`;
            await fs.writeFile(output, content, 'utf-8');

            /* 拼接ts类型 */
            const types = filesName.map(item => {
                return `\t\t\t${item} : string`
            }).join(",\n");

            /* 添加ts类型，让IDE能够识别 */
            await fs.writeFile(`${outputDir}/types.d.ts`, `
declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        $images: { \n ${types} \n\t\t\t} 
    }
}

export {}
                                            `, 'utf-8');

        },
    };
}

