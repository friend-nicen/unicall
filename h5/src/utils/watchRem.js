/*
* @author 友人a丶
* @date 2022-07-11
* 自动调整rem的大小
* */


export default function () {


    let l = () => {
        /* 设置根元素的font-size */
        let r = document.documentElement, o = r.offsetWidth / 100;
        o < 3.54 && (o = 3.54), o > 5.72 && (o = 5.72), r.style.fontSize = o + "px", window.rem = o
        /* 设置px值 */
        const bound = document.body.getBoundingClientRect();
        document.documentElement.style.setProperty('--base-vw-px', bound.width.toFixed(2) + "px");
        document.documentElement.style.setProperty('--base-vh-px', window.innerHeight.toFixed(2) + "px");
    };


    l(); //初始化


    window.addEventListener("resize", () => l());

}
