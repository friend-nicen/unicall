/*
* @author 友人a丶
* @date 2022-08-12
* 获取通讯录相关数据
* */

export default function () {
    return new Promise((resolve) => {
        // 扩展API加载完毕，现在可以正常调用扩展API
        plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function (addressbook) {
            // 可通过addressbook进行通讯录操作
            addressbook.find(["displayName", "phoneNumbers"], function (contacts) {

                console.log(contacts)
                resolve(contacts)
            }, function () {
                resolve("读取失败")
            }, {multiple: true});
        }, function (e) {
            resolve(JSON.stringify(e))
        });
    })
}