/*
* @author 友人a丶
* @date 2022-07-11
*
* 全局接口
* */

const BASE_URL = import.meta.env.PROD ? "" : "https://cdn2.nicen.cn";

export default {
    host: `${BASE_URL}`,//全局host
    avatar: `${BASE_URL}/index/avatar?text=`,
    /*用户登录*/
    login: `${BASE_URL}/entry/auth`,
    /*加载用户列表*/
    get_customers: `${BASE_URL}/lists`,
    /*上传通话记录*/
    add_record: `${BASE_URL}/add_record`,
    /*上传通话记录*/
    load_labels: `${BASE_URL}/labels`,
    /*上传通话记录*/
    load_follow: `${BASE_URL}/follows`,
    /* 新增跟进记录 */
    add_follow: `${BASE_URL}/add_follow`,
    /*用户的标签*/
    load_label: `${BASE_URL}/label`,
    /* 修改标签 */
    modify_label: `${BASE_URL}/modify_label`,
    /* 客户详细 */
    detail: `${BASE_URL}/detail`,
    /* 通话记录 */
    dial_list: `${BASE_URL}/dial_list`,
    /* 数据统计 */
    chart: `${BASE_URL}/chart`,
    /* 客户编辑 */
    modify: `${BASE_URL}/modify`,
    /* 删除客户 */
    del: `${BASE_URL}/del`,
    /* 企查查cookie */
    get_qcc_cookie: `${BASE_URL}/get_qcc_cookie`,
    /* 本机好码 */
    set_used: `${BASE_URL}/set_used`,
    /* 本机好码 */
    risk: `${BASE_URL}/risk`,
}