/*
* @author 友人a丶
* @date
* */

export default function () {
    if (!window.plus) {
        window.plus = {
            navigator: {
                getStatusbarHeight() {
                    return 20;
                },
                closeSplashscreen() {
                    return true;
                }
            }
        }
    }
}