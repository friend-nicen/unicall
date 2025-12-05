declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        /* 用户信息store */
        $user: () => {
            nickname: string;
            username: string;
            used: string;
            token: string;
            expireAt: Date | null;
            role: {
                id: number | null;
                name: string | null;
            };
            depart: {
                name: string | null;
                id: number | null;
            };
            corp: {
                id: number | null;
            };
            cookie: {
                qcc: string;
            };
            permissions?: string[];
            save: (state: any) => void;
        };
        /* 权限验证函数 */
        $auth: (permiss: string | string[], or?: boolean) => boolean;
        /* 主题配置 */
        $theme: {
            "primary-color": string;
        };
        /* API接口配置 */
        $api: object;
    }
}


export {}

